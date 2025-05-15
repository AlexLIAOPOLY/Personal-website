// Set default language to English if not set
if (!localStorage.getItem('preferredLanguage')) {
    localStorage.setItem('preferredLanguage', 'en');
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Apply the default language
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    document.documentElement.lang = currentLang;
    
    // Language switch functionality
    const langSwitchers = document.querySelectorAll('.language-switch a');
    langSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            
            // Update localStorage
            localStorage.setItem('preferredLanguage', lang);
            
            // Update active state
            langSwitchers.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
            
            // Update content (if you have translations)
            updateContent(lang);
        });
        
        // Set initial active state
        if (switcher.getAttribute('data-lang') === currentLang) {
            switcher.classList.add('active');
        } else {
            switcher.classList.remove('active');
        }
    });
    
    // 延迟一会儿检查荣誉奖项和联系方式部分
    setTimeout(function() {
        console.log('Checking awards and contact sections...');
        
        // 检查奖项部分
        const awardsTitle = document.querySelector('#awards h2');
        if (awardsTitle) {
            console.log('Awards title:', awardsTitle.textContent);
            console.log('Awards data-i18n:', awardsTitle.getAttribute('data-i18n'));
        } else {
            console.warn('Awards title element not found!');
        }
        
        // 检查联系方式部分
        const contactTitle = document.querySelector('#contact h2');
        if (contactTitle) {
            console.log('Contact title:', contactTitle.textContent);
            console.log('Contact data-i18n:', contactTitle.getAttribute('data-i18n'));
        } else {
            console.warn('Contact title element not found!');
        }
        
        // 检查当前语言
        const savedLang = localStorage.getItem('preferredLanguage');
        console.log('Current language from localStorage:', savedLang);
        
        // 确保translations对象存在并包含正确的键
        if (window.translations) {
            console.log('EN awards-title:', window.translations.en['awards-title']);
            console.log('ZH awards-title:', window.translations.zh['awards-title']);
            console.log('EN contact-title:', window.translations.en['contact-title']);
            console.log('ZH contact-title:', window.translations.zh['contact-title']);
        } else {
            console.warn('Translations object not found!');
        }
    }, 1000);

    // Initialize AOS (Animate on Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Set current year in footer copyright
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Preloader - Make sure it's reliable
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // First try using load event
        if (document.readyState === 'complete') {
            // If already loaded, hide immediately
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        } else {
            // Otherwise wait for load event
            window.addEventListener('load', function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            });
            
            // Backup timeout in case load event doesn't fire
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 3000);
        }
    }

    // Handle Header Scroll Effect
    const header = document.querySelector('header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hero Slider - Fixed reliability issues
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = document.querySelectorAll('.hero-slide');
        const sliderContainer = document.querySelector('.hero-slider-container');
        const dotsContainer = document.querySelector('.hero-slider-nav');
        let currentSlide = 0;
        let slideInterval;

        // Make sure we have slides
        if (slides.length === 0) return;

        // Create dots for each slide
        if (slides.length > 1 && dotsContainer) {
            dotsContainer.innerHTML = ''; // Clear existing dots
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('hero-slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        // Initialize all slides - ensure images are loaded
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img && img.getAttribute('loading') === 'lazy') {
                // Remove lazy loading for slider images to ensure they display immediately
                img.removeAttribute('loading');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            }
            // Only the first slide should be active initially
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Function to go to a specific slide
        function goToSlide(index) {
            // Remove active class from current slide and dot
            slides[currentSlide].classList.remove('active');
            const dots = document.querySelectorAll('.hero-slider-dot');
            if (dots.length > 0) {
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = index;
            
            // Add active class to new slide and dot
            slides[currentSlide].classList.add('active');
            if (dots.length > 0 && dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
            
            // Update container transform to show the current slide
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Function to go to the next slide
        function nextSlide() {
            const newIndex = (currentSlide + 1) % slides.length;
            goToSlide(newIndex);
        }

        // Start automatic slideshow if there are multiple slides
        if (slides.length > 1) {
            // Set initial transform
            sliderContainer.style.transform = 'translateX(0)';
            
            // Clear any existing interval first
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            
            slideInterval = setInterval(nextSlide, 5000);
            
            // Pause slideshow on mouse hover
            heroSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            // Resume slideshow when mouse leaves
            heroSlider.addEventListener('mouseleave', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });

            // Add swipe functionality for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});
            
            function handleSwipe() {
                const SWIPE_THRESHOLD = 50;
                if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
                    // Swipe left - go to next slide
                    nextSlide();
                } else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
                    // Swipe right - go to previous slide
                    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
                    goToSlide(newIndex);
                }
            }
        }
    }

    // Projects Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    // Remove animation class
                    card.classList.remove('animate');
                    
                    if (filterValue === 'all') {
                        // Show all cards
                        card.classList.remove('hidden');
                        // Add animation with a slight delay
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, 50);
                    } else {
                        // Check if card has the selected category
                        const cardCategories = card.getAttribute('data-categories')?.split(',') || [];
                        if (cardCategories.includes(filterValue)) {
                            card.classList.remove('hidden');
                            // Add animation with a slight delay
                            setTimeout(() => {
                                card.classList.add('animate');
                            }, 50);
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
        
        // Initially animate all cards
        projectCards.forEach(card => {
            card.classList.add('animate');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Close mobile menu if open
                    const navList = document.querySelector('header nav ul');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navList && navList.classList.contains('nav-active')) {
                        navList.classList.remove('nav-active');
                        if (navToggle) {
                            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                    
                    // Remove active class from all links
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    // Add active class to the clicked link
                    this.classList.add('active');
                    
                    // Scroll to the target element with smooth behavior
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Account for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Update URL without a page reload
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Active navigation link based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Call the function on scroll
    window.addEventListener('scroll', setActiveNavLink);
    // Call it once when the page loads
    setActiveNavLink();

    // Handle mobile navigation toggle (for responsive design)
    const handleMobileNav = () => {
        const navList = document.querySelector('header nav ul');
        const container = document.querySelector('header .container');
        
        if (!navList || !container) return;
        
        if (window.innerWidth <= 768) {
            // If on mobile, make nav list hidden by default
            navList.classList.add('nav-collapsed');
            
            // Create toggle button if it doesn't exist
            if (!document.querySelector('.nav-toggle')) {
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'nav-toggle';
                toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
                toggleBtn.addEventListener('click', () => {
                    navList.classList.toggle('nav-active');
                    toggleBtn.innerHTML = navList.classList.contains('nav-active') 
                        ? '<i class="fas fa-times"></i>' 
                        : '<i class="fas fa-bars"></i>';
                });
                container.appendChild(toggleBtn);
            }
        } else {
            // If on desktop, ensure nav is visible
            navList.classList.remove('nav-collapsed');
            navList.classList.remove('nav-active');
            
            // Remove toggle button if it exists
            const toggleBtn = document.querySelector('.nav-toggle');
            if (toggleBtn) {
                toggleBtn.remove();
            }
        }
    };
    
    // Call handleMobileNav on initial load
    handleMobileNav();
    
    // Call handleMobileNav on window resize
    window.addEventListener('resize', handleMobileNav);

    // Animate skill bars when they come into view - FIXED NUMBER ANIMATION
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-bar-progress');
        
        if (skillBars.length === 0) return;
        
        const animateBar = (bar) => {
            // 获取skill-bar-percent元素
            const percentBar = bar.querySelector('.skill-bar-percent');
            
            if (!percentBar) return;
            
            // 获取data-percent属性值或使用默认值
            const percentAttr = percentBar.getAttribute('data-percent');
            const percentage = percentAttr && !isNaN(parseInt(percentAttr)) ? percentAttr : '80';
            
            // 设置百分比宽度
            percentBar.style.width = percentage + '%';
            
            // 获取百分比文本元素
            const percentText = bar.querySelector('.skill-bar-percent-text');
            if (percentText) {
                // 直接设置初始值显示
                percentText.textContent = percentage + '%';
                
                // 然后设置动画
                let count = 0;
                const target = parseInt(percentage);
                // 固定持续时间
                const duration = 1200; // 1.2秒
                const steps = 25; // 固定步数
                const increment = Math.ceil(target / steps); // 计算每步增加值
                const stepTime = duration / steps; // 每步时间
                
                const timer = setInterval(() => {
                    count += increment;
                    // 确保不超过目标值
                    if (count >= target) {
                        clearInterval(timer);
                        percentText.textContent = target + '%';
                    } else {
                        percentText.textContent = count + '%';
                    }
                }, stepTime);
            }
        };
        
        // 使用Intersection Observer优化性能
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateBar(entry.target);
                    }, 300); // 稍微延迟，让页面有时间滚动到位
                    observer.unobserve(entry.target); // 动画完成后不再观察
                }
            });
        }, { threshold: 0.2 }); // 提高触发阈值，使元素更多地进入视口才开始动画
        
        skillBars.forEach(bar => observer.observe(bar));
    };
    
    // Call animateSkillBars on initial load
    animateSkillBars();
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = document.querySelector('#contact-form button[type="submit"]');
            
            // Clear any previous messages
            showFormMessage('', '');
            
            // More strict validation
            if (!nameInput.value.trim()) {
                showFormMessage('Please enter your name', 'error');
                nameInput.focus();
                return;
            }
            
            if (!emailInput.value.trim()) {
                showFormMessage('Please enter your email', 'error');
                emailInput.focus();
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showFormMessage('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            if (!messageInput.value.trim()) {
                showFormMessage('Please enter your message', 'error');
                messageInput.focus();
                return;
            }
            
            // Disable submit button and show loading
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // 添加网络连接检查
                if (!navigator.onLine) {
                    throw new Error('您的网络连接似乎已断开。请检查您的互联网连接后重试。');
                }
                
                // Send form data to the server
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim()
                    }),
                    timeout: 10000 // 10秒超时
                });
                
                if (!response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '发送消息失败。请稍后再试。');
                    } else {
                        throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
                    }
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    // Show success message
                    showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
                    // Reset form
                    contactForm.reset();
                } else {
                    console.error('Form submission error:', data);
                    // Show detailed error message
                    showFormMessage(data.message || 'Failed to send message. Please try again later.', 'error');
                }
            } catch (error) {
                console.error('Network or Server Error:', error);
                
                // 更详细的错误信息
                if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                    showFormMessage('Network error. The server may be down or unreachable. Please check your connection and try again.', 'error');
                } else {
                    showFormMessage(error.message || 'Network error. Please check your connection and try again.', 'error');
                }
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
        
        function showFormMessage(message, type) {
            const messageElement = document.getElementById('form-message');
            if (!messageElement) return;
            
            if (!message) {
                messageElement.style.display = 'none';
                return;
            }
            
            messageElement.textContent = message;
            messageElement.className = `form-message ${type}`;
            messageElement.style.display = 'block';
            
            // Auto-scroll to message if not in view
            const rect = messageElement.getBoundingClientRect();
            const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isInView) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Hide success message after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        messageElement.style.display = 'none';
                        messageElement.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }

    // Lazy load for images - improved implementation
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
    } else {
        // Fallback: load lazysizes polyfill
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Fix any parallax effects that might be causing issues
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    if (parallaxBgs.length > 0) {
        const handleParallax = () => {
            parallaxBgs.forEach(bg => {
                const speed = parseFloat(bg.getAttribute('data-speed') || 0.2);
                const offset = window.pageYOffset;
                const yPos = -(offset * speed);
                bg.style.backgroundPositionY = yPos + 'px';
            });
        };
        
        window.addEventListener('scroll', handleParallax);
    }

    // 项目过滤功能
    const initProjectFilters = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const cardsPerPage = 6; // 每页最多显示6个项目
        
        if (filterBtns.length > 0 && projectCards.length > 0) {
            console.log('Initializing project filters');
            
            // 初始化 - 只显示前6个项目卡片
            projectCards.forEach((card, index) => {
                if (index < cardsPerPage) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 300);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 添加过滤按钮点击事件
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // 更新活跃按钮状态
                    filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 获取过滤类别
                    const filterValue = this.getAttribute('data-filter');
                    console.log('Filtering projects by:', filterValue);
                    
                    // 收集匹配的项目卡片
                    const matchingCards = [];
                    
                    // 先隐藏所有卡片并移除动画
                    projectCards.forEach(card => {
                        card.classList.remove('animate');
                        card.style.display = 'none';
                    });
                    
                    // 找出所有匹配的卡片
                    projectCards.forEach(card => {
                        // 获取卡片类别
                        const categories = card.getAttribute('data-categories');
                        
                        if (!categories) {
                            console.warn('Project card missing data-categories attribute');
                            return;
                        }
                        
                        const categoriesList = categories.split(',');
                        
                        // 检查是否匹配过滤条件
                        if (filterValue === 'all' || categoriesList.includes(filterValue)) {
                            matchingCards.push(card);
                        }
                    });
                    
                    // 只显示匹配卡片中的前6个
                    matchingCards.slice(0, cardsPerPage).forEach(card => {
                        setTimeout(() => {
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.classList.add('animate');
                            }, 50);
                        }, 50);
                    });
                    
                    // 更新分页状态 - 根据匹配卡片的数量决定是否显示分页
                    updatePagination(matchingCards.length, filterValue);
                    
                    // 重置为第一页
                    const pageButtons = document.querySelectorAll('.page-btn');
                    if (pageButtons.length > 0) {
                        pageButtons.forEach(b => b.classList.remove('active'));
                        pageButtons[0].classList.add('active');
                    }
                });
            });
        }
    };
    
    // 初始化项目卡片功能
    const initProjectCards = () => {
        // 添加项目卡片悬停效果
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // 确保卡片一开始是可见的并带有动画
            card.style.display = 'flex';
            card.classList.add('animate');
            
            // 处理卡片中的图像
            const header = card.querySelector('.project-header');
            if (header) {
                // 确保16:9比例显示
                const headerBg = header.querySelector('.ai-chip-bg, .logistics-bg');
                if (headerBg) {
                    headerBg.style.position = 'absolute';
                    headerBg.style.width = '100%';
                    headerBg.style.height = '100%';
                }
            }
        });
    };

    // 初始化分页功能
    const initPagination = () => {
        const pageButtons = document.querySelectorAll('.page-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const cardsPerPage = 6;
        const pageIndicator = document.querySelector('.page-indicator span');
        
        if (pageButtons.length === 0 || projectCards.length === 0) return;
        
        // 设置初始状态 - 只显示第一页
        showPage(1);
        
        // 添加页面按钮点击事件
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                
                // 获取当前活跃的过滤类别
                const activeFilter = document.querySelector('.filter-btn.active');
                const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
                
                showPage(page, filterValue);
                
                // 更新活跃按钮
                pageButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 更新页面指示器文本
                if (pageIndicator) {
                    const lang = localStorage.getItem('preferredLanguage') || 'en';
                    if (lang === 'en') {
                        pageIndicator.textContent = `Page ${page} of 2`;
                    } else {
                        pageIndicator.textContent = `第${page}页，共2页`;
                    }
                }
                
                // 滚动到项目部分顶部
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // 显示指定页的函数
        function showPage(page, filterValue = 'all') {
            const matchingCards = [];
            const projectCards = document.querySelectorAll('.project-card');
            
            // 找出所有匹配当前过滤条件的卡片
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                
                if (!categories) {
                    console.warn('Project card missing data-categories attribute');
                    return;
                }
                
                const categoriesList = categories.split(',');
                
                // 检查是否匹配过滤条件
                if (filterValue === 'all' || categoriesList.includes(filterValue)) {
                    matchingCards.push(card);
                }
            });
            
            // 首先隐藏所有卡片
            projectCards.forEach(card => {
                card.classList.remove('animate');
                card.style.display = 'none';
            });
            
            // 计算当前页应该显示的卡片
            const startIndex = (page - 1) * cardsPerPage;
            const endIndex = Math.min(startIndex + cardsPerPage, matchingCards.length);
            
            // 显示当前页的卡片
            for (let i = startIndex; i < endIndex; i++) {
                const card = matchingCards[i];
                setTimeout(() => {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 50);
                }, 50);
            }
        }
    };

    // 更新分页状态
    function updatePagination(totalMatchingCards, filterValue) {
        const paginationContainer = document.querySelector('.pagination-container');
        const pageButtons = document.querySelectorAll('.page-btn');
        const cardsPerPage = 6;
        
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(totalMatchingCards / cardsPerPage);
        
        // 如果只有一页，隐藏分页
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'flex';
            
            // 确保只显示需要的页码按钮
            pageButtons.forEach((btn, index) => {
                if (index < totalPages) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            });
            
            // 更新页面指示器文本
            const pageIndicator = document.querySelector('.page-indicator span');
            if (pageIndicator) {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                if (lang === 'en') {
                    pageIndicator.textContent = `Page 1 of ${totalPages}`;
                } else {
                    pageIndicator.textContent = `第1页，共${totalPages}页`;
                }
            }
        }
    }

    // 初始化项目相关功能
    initProjectFilters();
    initProjectCards();
    initPagination();

    // 添加项目卡片图片滑动功能
    initProjectImageSliders();

    // Mobile Menu Toggle Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('header nav'); // The <nav> element itself

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isExpanded);
                icon.classList.toggle('fa-times', isExpanded);
            }
        });
    }

    // Dynamic Header Resize on Scroll (Mobile Only)
    let lastScrollTop = 0;
    let headerScrollTimeout;
    const headerElement = document.querySelector('header');

    function handleHeaderScroll() {
        if (!headerElement) return;

        if (window.innerWidth <= 768) { // Only on mobile
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Close mobile menu if open and user starts scrolling
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }

            if (scrollTop > lastScrollTop && scrollTop > headerElement.offsetHeight) {
                // Scrolling DOWN page content (finger swipe down, page scrolls up) -> Header EXPANDS
                headerElement.classList.add('header-extended');
                headerElement.classList.remove('header-retracted');
            } else if (scrollTop < lastScrollTop) {
                // Scrolling UP page content (finger swipe up, page scrolls down) -> Header SHRINKS
                headerElement.classList.add('header-retracted');
                headerElement.classList.remove('header-extended');
            } else if (scrollTop === 0) {
                // At the top of the page, ensure normal state
                headerElement.classList.remove('header-retracted', 'header-extended');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            clearTimeout(headerScrollTimeout);
            if (scrollTop > 0) { // Only set timeout if not at the top
                headerScrollTimeout = setTimeout(() => {
                    headerElement.classList.remove('header-retracted', 'header-extended');
                }, 1500); // Reset after 1.5 seconds of no scrolling
            }
        } else {
            // On desktop, ensure classes are removed and menu is not in mobile 'active' state
            headerElement.classList.remove('header-retracted', 'header-extended');
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                 if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('resize', handleHeaderScroll); // Re-check on resize
});

/**
 * 初始化所有项目卡片的图片滑动功能
 */
function initProjectImageSliders() {
    // 获取所有项目卡片
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // 获取项目名称用于加载正确的图片
        const projectTitle = card.querySelector('h3').getAttribute('data-i18n');
        
        // 检查项目卡片头部
        const projectHeader = card.querySelector('.project-header');
        if (!projectHeader) return;
        
        // 清空现有内容，确保没有额外的文本节点
        projectHeader.textContent = '';
        
        // 创建图片滑动容器
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'project-image-slider';
        
        // 创建图片容器
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'project-images-container';
        sliderContainer.appendChild(imagesContainer);
        
        // 添加图片占位符（实际使用时将从文件夹动态加载）
        // 开始时先模拟两张图片
        for (let i = 1; i <= 2; i++) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'project-image-wrapper';
            
            // 根据项目名称确定图片路径
            const folderPath = getFolderNameForProject(projectTitle);
            const imgPath = `images/Project/${folderPath}/${i}.jpg`;
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = `${getProjectName(projectTitle)} Screenshot ${i}`;
            img.className = 'project-image';
            img.setAttribute('loading', 'lazy');
            
            // 添加错误处理，如果图片不存在则显示背景
            img.onerror = function() {
                this.style.display = 'none';
                imageWrapper.classList.add(i === 1 ? 'ai-chip-bg' : 'logistics-bg');
                
                // 添加图标作为替代
                const icon = document.createElement('i');
                icon.className = i === 1 ? 'fas fa-microchip' : 'fas fa-cogs';
                icon.style.fontSize = '32px';
                icon.style.color = 'white';
                icon.style.position = 'absolute';
                icon.style.top = '50%';
                icon.style.left = '50%';
                icon.style.transform = 'translate(-50%, -50%)';
                imageWrapper.appendChild(icon);
            };
            
            imageWrapper.appendChild(img);
            imagesContainer.appendChild(imageWrapper);
        }
        
        // 添加导航控件
        const navPrev = document.createElement('div');
        navPrev.className = 'project-image-nav project-image-prev';
        navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const navNext = document.createElement('div');
        navNext.className = 'project-image-nav project-image-next';
        navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        sliderContainer.appendChild(navPrev);
        sliderContainer.appendChild(navNext);
        
        // 添加小圆点导航
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'project-image-dots';
        
        for (let i = 0; i < 2; i++) {
            const dot = document.createElement('div');
            dot.className = 'project-image-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }
        
        sliderContainer.appendChild(dotsContainer);
        
        // 将滑动容器添加到项目头部
        projectHeader.appendChild(sliderContainer);
        
        // 初始化滑动功能
        initProjectSlider(card);
    });
}

/**
 * 根据项目标题获取对应的文件夹名称
 */
function getFolderNameForProject(projectTitle) {
    // 映射项目标题到文件夹名称
    const titleToFolder = {
        'proj-tokenizer-title': 'AI-Tokenizer-Visualizer',
        'proj-litho-title': 'Lithography-Simulation-Suite',
        'proj-support-title': 'Lithography-Support-Platform',
        'proj-ios-title': 'iOS-Social-Messaging-Application',
        'proj-ai-integration-title': 'Lithography-AI-Assistant',
        'proj-rag-title': 'Specialized-RAG-System',
        'proj-non-conv-title': 'Non-Conversational-AI-System',
        'proj-mnist-title': 'MNIST-Handwriting-Recognition',
        'proj-cc-curve-title': 'Photoresist-CC-Curve-Optimization',
        'proj-python-crawler-title': 'Python-Logging-Web-Crawler',
        'proj-3d-coordinate-title': '3D-Coordinate-Generation',
        'proj-vrp-title': 'VRP-APP-Vehicle-Routing'
    };
    
    const folder = titleToFolder[projectTitle] || 'default';
    console.log('Mapping project title to folder:', projectTitle, '->', folder);
    return folder;
}

/**
 * 根据项目标题获取项目名称（用于alt文本）
 */
function getProjectName(projectTitle) {
    // 映射项目标题到可读项目名称
    const titleToName = {
        'proj-tokenizer-title': 'AI Tokenizer Visualizer',
        'proj-litho-title': 'Lithography Simulation Suite',
        'proj-support-title': 'Lithography Support Platform',
        'proj-ios-title': 'iOS Social Messaging Application',
        'proj-ai-integration-title': 'Lithography AI Assistant',
        'proj-rag-title': 'Specialized RAG System',
        'proj-non-conv-title': 'Non-Conversational AI System',
        'proj-mnist-title': 'MNIST Handwriting Recognition',
        'proj-cc-curve-title': 'Photoresist CC Curve Optimization',
        'proj-python-crawler-title': 'Python Logging Web Crawler',
        'proj-3d-coordinate-title': '3D Coordinate Generation',
        'proj-vrp-title': 'VRP APP Vehicle Routing'
    };
    
    return titleToName[projectTitle] || 'Project';
}

/**
 * 为每个项目卡片初始化图片滑动功能
 */
function initProjectSlider(card) {
    const sliderContainer = card.querySelector('.project-image-slider');
    if (!sliderContainer) return;
    
    const imagesContainer = sliderContainer.querySelector('.project-images-container');
    const imageWrappers = sliderContainer.querySelectorAll('.project-image-wrapper');
    const navPrev = sliderContainer.querySelector('.project-image-prev');
    const navNext = sliderContainer.querySelector('.project-image-next');
    const dots = sliderContainer.querySelectorAll('.project-image-dot');
    
    if (imageWrappers.length <= 1) {
        // 如果只有一张图片，隐藏导航
        if (navPrev) navPrev.style.display = 'none';
        if (navNext) navNext.style.display = 'none';
        if (dots.length > 0) {
            sliderContainer.querySelector('.project-image-dots').style.display = 'none';
        }
        return;
    }
    
    let currentIndex = 0;
    const imageCount = imageWrappers.length;
    
    // 更新滑动位置
    function updateSliderPosition() {
        imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新小圆点状态
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 前一张图片
    function prevImage() {
        currentIndex = (currentIndex - 1 + imageCount) % imageCount;
        updateSliderPosition();
    }
    
    // 下一张图片
    function nextImage() {
        currentIndex = (currentIndex + 1) % imageCount;
        updateSliderPosition();
    }
    
    // 绑定事件
    if (navPrev) navPrev.addEventListener('click', prevImage);
    if (navNext) navNext.addEventListener('click', nextImage);
    
    // 为小圆点绑定事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSliderPosition();
        });
    });
    
    // 自动轮播（可选）
    let autoSlideInterval = setInterval(nextImage, 5000);
    
    // 鼠标悬停时暂停自动轮播
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextImage, 5000);
    });
} 