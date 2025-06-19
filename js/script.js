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

                // 初始加载时，基于所有项目更新分页
                updatePagination(projectCards.length, 'all');
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
        const cardsPerPage = 6;

        if (filterBtns.length === 0 || projectCards.length === 0) {
            return;
        }

        // 初始加载：显示前6个项目
        projectCards.forEach((card, index) => {
            card.style.display = index < cardsPerPage ? 'flex' : 'none';
            if (index < cardsPerPage) {
                setTimeout(() => card.classList.add('animate'), 50);
            }
        });

        // 关键修复：在页面首次加载时，使用所有项目的总数来初始化分页控件
        updatePagination(projectCards.length, 'all');

        // 为所有过滤按钮添加点击事件
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                const matchingCards = [];

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-categories').split(',');
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        matchingCards.push(card);
                    }
                    card.style.display = 'none'; // 先隐藏所有卡片
                });

                // 显示匹配项的第一页
                matchingCards.slice(0, cardsPerPage).forEach((card, index) => {
                    card.style.display = 'flex';
                    setTimeout(() => card.classList.add('animate'), 50 * (index + 1));
                });

                // 更新分页以匹配新的筛选结果
                updatePagination(matchingCards.length, filterValue);

                // 重置分页按钮到第一页
                const pageButtons = document.querySelectorAll('.page-btn');
                pageButtons.forEach(b => b.classList.remove('active'));
                if (pageButtons.length > 0) {
                    pageButtons[0].classList.add('active');
                }
            });
        });
    };

    // 初始化项目卡片功能，并处理基于LocalStorage的浏览量增加
    const initProjectCards = () => {
        const projectCards = document.querySelectorAll('.project-card');
        const today = new Date().toISOString().split('T')[0]; // 获取 YYYY-MM-DD格式的今天日期

        const observerOptions = {
            root: null, // 使用浏览器视口作为根
            rootMargin: '0px',
            threshold: 0.1 // 卡片至少10%可见时触发
        };

        const  projectCardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const projectTitleKey = card.querySelector('h3[data-i18n]')?.getAttribute('data-i18n');

                    if (!projectTitleKey) {
                        console.warn('Project card missing h3[data-i18n] attribute, cannot track views for:', card);
                        observer.unobserve(card); // 停止观察无效卡片
                        return;
                    }

                    const viewCountStorageKey = `viewCount_${projectTitleKey}`;
                    const lastIncrementDateStorageKey = `lastViewIncrement_${projectTitleKey}`;

                    let currentViews = 0;
                    const storedViews = localStorage.getItem(viewCountStorageKey);
                    const htmlDataViewCount = card.querySelector('.project-views')?.getAttribute('data-view-count');
                    
                    if (storedViews !== null) {
                        currentViews = parseInt(storedViews, 10);
                    } else if (htmlDataViewCount !== null && !isNaN(parseInt(htmlDataViewCount, 10))) {
                        currentViews = parseInt(htmlDataViewCount, 10);
                    } else {
                        currentViews = 0; // 如果都没有，则从0开始
                    }

                    const lastIncrementDate = localStorage.getItem(lastIncrementDateStorageKey);

                    if (lastIncrementDate !== today) {
                        currentViews++; // 增加浏览量
                        localStorage.setItem(viewCountStorageKey, currentViews.toString());
                        localStorage.setItem(lastIncrementDateStorageKey, today);
                        console.log(`View count for ${projectTitleKey} incremented to ${currentViews} on ${today}`);
                    }

                    // 更新页面上的浏览量显示
                    const viewsCountElement = card.querySelector('.project-views .views-count');
                    if (viewsCountElement) {
                        viewsCountElement.textContent = currentViews;
                    }
                    // 更新 data-view-count 属性，以便其他依赖此属性的逻辑（如果有）能获取到最新值
                    const projectViewsDiv = card.querySelector('.project-views');
                    if (projectViewsDiv) {
                        projectViewsDiv.setAttribute('data-view-count', currentViews.toString());
                    }

                    // 处理完后停止观察此卡片，避免重复触发
                    observer.unobserve(card);
                }
            });
        }, observerOptions);

        projectCards.forEach(card => {
            // 确保卡片一开始是可见的并带有动画 (如果初始过滤器允许)
            // card.style.display = 'flex'; //  这个由过滤器控制
            // card.classList.add('animate'); // 这个也由过滤器控制

            const viewsCountElement = card.querySelector('.project-views .views-count');
            const projectViewsDiv = card.querySelector('.project-views');
            const projectTitleKey = card.querySelector('h3[data-i18n]')?.getAttribute('data-i18n');
            const htmlDataViewCount = projectViewsDiv?.getAttribute('data-view-count');

            // 初始化显示：优先从LocalStorage读取，否则用HTML中的值
            if (projectTitleKey) {
                const storedViews = localStorage.getItem(`viewCount_${projectTitleKey}`);
                if (storedViews !== null) {
                    if (viewsCountElement) viewsCountElement.textContent = storedViews;
                    if (projectViewsDiv) projectViewsDiv.setAttribute('data-view-count', storedViews);
                } else if (htmlDataViewCount !== null && viewsCountElement) {
                     viewsCountElement.textContent = htmlDataViewCount; // 确保初始显示HTML值
                }
            }

            // 开始观察卡片
            projectCardObserver.observe(card);
        });
    };

    // 初始化分页功能
    const initPagination = () => {
        const pageButtons = document.querySelectorAll('.page-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const cardsPerPage = 6;
        const pageIndicator = document.querySelector('.page-indicator span');
        
        if (pageButtons.length === 0 || projectCards.length === 0) return;
        
        // 为所有分页按钮添加点击事件
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
                    // 计算当前筛选条件下的匹配卡片数量
                    const allProjectCards = document.querySelectorAll('.project-card');
                    let matchingCardsCount = 0;
                    allProjectCards.forEach(card => {
                        const categories = card.getAttribute('data-categories');
                        if (categories) {
                            const categoriesList = categories.split(',');
                            if (filterValue === 'all' || categoriesList.includes(filterValue)) {
                                matchingCardsCount++;
                            }
                        }
                    });
                    const totalPages = Math.ceil(matchingCardsCount / cardsPerPage);
                    if (lang === 'en') {
                        pageIndicator.textContent = `Page ${page} of ${Math.max(1, totalPages)}`;
                    } else {
                        pageIndicator.textContent = `第${page}页，共${Math.max(1, totalPages)}页`;
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
        
        // 始终显示分页控件，即使只有一页
            paginationContainer.style.display = 'flex';
            
                    // 确保只显示需要的页码按钮
        pageButtons.forEach((btn, index) => {
            if (index < totalPages) {
                btn.style.display = 'flex';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                // 隐藏不需要的页面按钮
                btn.style.display = 'none';
            }
        });
            
            // 更新页面指示器文本
            const pageIndicator = document.querySelector('.page-indicator span');
            if (pageIndicator) {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                if (lang === 'en') {
                pageIndicator.textContent = `Page 1 of ${Math.max(1, totalPages)}`;
                } else {
                pageIndicator.textContent = `第1页，共${Math.max(1, totalPages)}页`;
            }
        }
    }

    // 初始化项目相关功能
    initProjectFilters();
    initProjectCards();
    initPagination();

    // 添加项目卡片图片滑动功能
    initProjectImageSliders();
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
        
        // 保存现有的 project-views 元素（如果存在）
        const existingViews = projectHeader.querySelector('.project-views');
        
        // 清空现有内容，确保没有额外的文本节点，但保留 project-views
        projectHeader.innerHTML = ''; // 使用 innerHTML 清空，以便后续可以重新插入元素
        if (existingViews) {
            projectHeader.appendChild(existingViews); // 先把views加回去，确保它在最上层（如果需要）
        }
        
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
        'proj-vrp-title': 'VRP-APP-Vehicle-Routing',
        'proj-langchain-rag-title': 'Langchain_RAG_Streamlit',
        'proj-mcp-title': 'MCP_definition_stdio_demo',
        'proj-langchain-agent-title': 'Langchain_Agent_Functioncalling_Streamlit'
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
        'proj-vrp-title': 'VRP APP Vehicle Routing',
        'proj-langchain-rag-title': 'Langchain RAG Streamlit',
        'proj-mcp-title': 'MCP Geospatial API Tools',
        'proj-langchain-agent-title': 'Langchain Agent with Function Calling'
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

// 多语言翻译对象
window.translations = {
    en: {
        // 导航
        'logo': 'Liao Wang',
        'home': 'Home',
        'about': 'About Me',
        'education': 'Education',
        'experience': 'Experience',
        'projects': 'Projects',
        'certifications': 'Certifications',
        'skills': 'Skills',
        'awards': 'Awards',
        'contact': 'Contact',
        
        // Hero部分
        'welcome': 'Welcome to My Portfolio',
        'aspiring': 'Aspiring AI & Technology Professional',
        'hero-title-ai-researcher': 'AI Researcher',
        'hero-desc-ai-researcher': 'Exploring the infinite possibilities of AI',
        'hero-title-litho-explorer': 'Lithography Explorer',
        'hero-desc-litho-explorer': 'Dedicated to advancing cutting-edge lithography',
        'hero-subtitle-education': 'Aspiring AI & Technology Professional | Master of Science Student',
        'contact-me': 'Contact Me',
        'download-cv': 'Download CV',
        
        // About部分
        'about-me': 'About Me',
        'ai-tech': 'AI Technology',
        'ai-tech-desc': 'Passionate about artificial intelligence and its applications in various domains.',
        'academic': 'Academic Excellence',
        'academic-desc': 'SGPA 3.92/4.00, Dean\'s List at The Hong Kong Polytechnic University.',
        'industry': 'Industry Experience',
        'industry-desc': 'Experience in AI chip design, new media operations, bidding management, and telecom industry.',
        'about-p1': 'I am a dedicated student currently pursuing a Master of Science in Microelectronics Science and Technology at the University of Hong Kong. With a strong foundation in Logistics Engineering from my undergraduate studies at The Hong Kong Polytechnic University, I have developed a comprehensive understanding of both technical and operational aspects of technology.',
        'about-p2': 'My academic journey has been marked by excellence, maintaining a SGPA of 3.92/4.00 and earning a place on the Dean\'s List. This achievement reflects my commitment to academic rigor and my passion for continuous learning in the rapidly evolving field of technology.',
        'about-p3': 'Through various internships and practical experiences, I have gained valuable insights into AI chip design, lithography simulation, and technology management. My goal is to contribute to the advancement of AI and microelectronics technologies while bridging the gap between theoretical knowledge and practical applications.',
        
        // 项目部分
        'all': 'All',
        'litho': 'Lithography & Microelectronics',
        'ai': 'AI',
        'web': 'Web Development',
        'logistics-filter': 'Logistics',
        'desktop': 'Desktop Applications',
        'mobile': 'Mobile Applications',
        'source-code': 'Source Code',
        'try-now-tokenizer': 'Try Now',
        'demo': 'Live Demo',
        'demo-1': 'OPC Simulation',
        'demo-2': 'Proximity Effect',
        'demo-user': 'User Interface',
        'demo-admin': 'Admin Panel',
        
        // 项目标题和描述
        'proj-tokenizer-title': 'AI Tokenizer Visualizer',
        'proj-tokenizer-desc': 'An open-source web tool that visualizes token conversion and semantic embeddings based on OpenAI\'s tokenizer, helping users understand NLP concepts through interactive 3D visualization.',
        'proj-tokenizer-tooltip': 'This open-source visualization tool showcases how large language models convert text into tokens. Based on OpenAI\'s tokenizer, it transforms English text into tokens and special prompts, then presents them as 3D vectors to demonstrate semantic relationships. It\'s an excellent educational resource for understanding tokenization and semantic embedding in AI language processing.',
        
        'proj-litho-title': 'Lithography Simulation Suite',
        'proj-litho-desc': 'A comprehensive suite of desktop applications leveraging deep learning algorithms to simulate proximity effects in lithography, optimize masks, and enhance photoresist curve modeling with 2D/3D visualization capabilities.',
        'proj-litho-tooltip': 'This sophisticated desktop application suite simulates crucial lithography manufacturing processes with deep learning algorithms. It predicts proximity effects in lithography, generates optimized initial masks, and enhances photoresist curve modeling. The suite features advanced 2D/3D visualization tools, parameter management, and detailed operation logging, providing comprehensive control and analysis capabilities for semiconductor fabrication.',
        
        'proj-support-title': 'Lithography Support Platform',
        'proj-support-desc': 'A real-time customer support web platform for lithography applications featuring separate user and admin interfaces, live chat functionality, and an intelligent assistant powered by keyword-matching algorithms.',
        'proj-support-tooltip': 'This integrated web and database system creates a networked customer support platform specifically for lithography applications. It features distinct login interfaces for users and administrators, a real-time communication system for efficient customer service, and backend management tools. The platform also incorporates an intelligent assistant with keyword-matching algorithms that automatically generates responses to common queries, significantly improving support efficiency.',
        
        'proj-ios-title': 'iOS Social Messaging Application',
        'proj-ios-desc': 'A fully-functional iOS application replicating core social media features including instant messaging, group chats, social feeds, QR code scanning, and user profile management.',
        'proj-ios-tooltip': 'This comprehensive iOS application successfully replicates the core functionality of popular messaging platforms like WeChat. The app features real-time one-on-one and group messaging, social media feed capabilities, QR code scanning for contact additions, and detailed user profile management. Built with Swift and following iOS design principles, it demonstrates advanced mobile development skills and user experience design.',
        
        // 项目标签
        'tag-nlp': 'NLP',
        'tag-visualization': 'Visualization',
        'tag-web-app': 'Web App',
        'tag-deep-learning': 'Deep Learning',
        'tag-simulation': 'Simulation',
        'tag-gui': 'GUI',
        'tag-customer-support': 'Customer Support',
        'tag-real-time': 'Real-time',
        'tag-database': 'Database',
        'tag-ios': 'iOS',
        'tag-swift': 'Swift',
        'tag-social': 'Social Media',
        
        // 其他
        'work-experience': 'Work Experience',
        'work-exp': 'Work Experience',
        'internship-exp': 'Internship Experience',
        'practical-exp': 'Practical Experience',
        'responsibilities': 'Responsibilities',
        'achievements': 'Achievements',
        'team-label': 'Practice Team',
        'org-label': 'Organizing Unit',
        'content-label': 'Practice Content',
        
        // 联系表单
        'send-message': 'Send Me a Message',
        'name': 'Name',
        'subject': 'Subject',
        'message': 'Message',
        'send': 'Send Message'
    },
    zh: {
        // 导航
        'logo': '廖望',
        'home': '首页',
        'about': '关于我',
        'education': '教育背景',
        'experience': '工作经验',
        'projects': '项目展示',
        'certifications': '资格认证',
        'skills': '技能专长',
        'awards': '荣誉奖项',
        'contact': '联系方式',
        
        // Hero部分
        'welcome': '欢迎来到我的作品集',
        'aspiring': '未来的人工智能与技术专业人才',
        'hero-title-ai-researcher': 'AI研究员',
        'hero-desc-ai-researcher': '探索人工智能的无限可能',
        'hero-title-litho-explorer': '光刻技术探索者',
        'hero-desc-litho-explorer': '致力于推进前沿光刻技术',
        'hero-subtitle-education': '未来的人工智能与技术专业人才 | 理学硕士研究生',
        'contact-me': '联系我',
        'download-cv': '下载简历',
        
        // About部分
        'about-me': '关于我',
        'ai-tech': '人工智能技术',
        'ai-tech-desc': '对人工智能及其在各个领域的应用充满热情。',
        'academic': '学术卓越',
        'academic-desc': 'SGPA 3.92/4.00，香港理工大学院长嘉许名单。',
        'industry': '行业经验',
        'industry-desc': '在AI芯片设计、新媒体运营、招投标管理和电信行业拥有丰富经验。',
        'about-p1': '我是一名专注的学生，目前在香港大学攻读微电子科学与技术理学硕士学位。在香港理工大学物流工程本科学习的坚实基础上，我对技术的技术和运营方面都有了全面的理解。',
        'about-p2': '我的学术历程以卓越为标志，保持着3.92/4.00的SGPA，并获得院长嘉许名单的认可。这一成就反映了我对学术严谨性的承诺以及我对在快速发展的技术领域持续学习的热情。',
        'about-p3': '通过各种实习和实践经验，我在AI芯片设计、光刻仿真和技术管理方面获得了宝贵的见解。我的目标是为AI和微电子技术的进步做出贡献，同时在理论知识和实际应用之间架起桥梁。',
        
        // 项目部分
        'all': '全部',
        'litho': '光刻与微电子',
        'ai': '人工智能',
        'web': '网页开发',
        'logistics-filter': '物流',
        'desktop': '桌面应用',
        'mobile': '移动应用',
        'source-code': '源代码',
        'try-now-tokenizer': '立即体验',
        'demo': '在线演示',
        'demo-1': 'OPC仿真',
        'demo-2': '邻近效应',
        'demo-user': '用户界面',
        'demo-admin': '管理面板',
        
        // 项目标题和描述
        'proj-tokenizer-title': 'AI分词可视化工具',
        'proj-tokenizer-desc': '基于OpenAI分词器的开源网页工具，通过交互式3D可视化帮助用户理解NLP概念，展示文本转换为标记和语义嵌入的过程。',
        'proj-tokenizer-tooltip': '这个开源可视化工具展示了大型语言模型如何将文本转换为标记。基于OpenAI的分词器，它将英文文本转换为标记和特殊提示符，然后以3D向量的形式呈现，展示语义关系。这是理解AI语言处理中分词和语义嵌入的优秀教育资源。',
        
        'proj-litho-title': '光刻仿真套件',
        'proj-litho-desc': '利用深度学习算法的桌面应用程序套件，用于仿真光刻中的邻近效应、优化掩模，并通过2D/3D可视化功能增强光阻曲线建模。',
        'proj-litho-tooltip': '这个复杂的桌面应用程序套件使用深度学习算法仿真关键的光刻制造过程。它预测光刻中的邻近效应，生成优化的初始掩模，并增强光阻曲线建模。该套件具有先进的2D/3D可视化工具、参数管理和详细的操作日志记录，为半导体制造提供全面的控制和分析能力。',
        
        'proj-support-title': '光刻支持平台',
        'proj-support-desc': '面向光刻应用的实时客户支持网页平台，具有独立的用户和管理员界面、实时聊天功能，以及基于关键词匹配算法的智能助手。',
        'proj-support-tooltip': '这个集成的网页和数据库系统专为光刻应用创建了网络化的客户支持平台。它具有用户和管理员的独立登录界面、高效客户服务的实时通信系统，以及后台管理工具。该平台还集成了具有关键词匹配算法的智能助手，可以自动生成对常见查询的响应，显著提高支持效率。',
        
        'proj-ios-title': 'iOS社交消息应用',
        'proj-ios-desc': '功能齐全的iOS应用程序，复制核心社交媒体功能，包括即时消息、群聊、社交动态、二维码扫描和用户资料管理。',
        'proj-ios-tooltip': '这个综合性的iOS应用程序成功复制了微信等流行消息平台的核心功能。该应用具有实时一对一和群组消息传递、社交媒体动态功能、用于添加联系人的二维码扫描，以及详细的用户资料管理。使用Swift构建并遵循iOS设计原则，展示了先进的移动开发技能和用户体验设计。',
        
        // 项目标签
        'tag-nlp': '自然语言处理',
        'tag-visualization': '可视化',
        'tag-web-app': '网页应用',
        'tag-deep-learning': '深度学习',
        'tag-simulation': '仿真',
        'tag-gui': '图形界面',
        'tag-customer-support': '客户支持',
        'tag-real-time': '实时',
        'tag-database': '数据库',
        'tag-ios': 'iOS',
        'tag-swift': 'Swift',
        'tag-social': '社交媒体',
        
        // 其他
        'work-experience': '工作经验',
        'work-exp': '工作经验',
        'internship-exp': '实习经验',
        'practical-exp': '实践经验',
        'responsibilities': '职责',
        'achievements': '成就',
        'team-label': '实践团队',
        'org-label': '组织单位',
        'content-label': '实践内容',
        
        // 联系表单
        'send-message': '给我留言',
        'name': '姓名',
        'subject': '主题',
        'message': '留言',
        'send': '发送留言'
    }
};

// 更新页面内容的函数
function updateContent(lang) {
    console.log('Updating content for language:', lang);
    
    // 更新所有具有 data-i18n 属性的元素
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    elementsWithI18n.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (window.translations[lang] && window.translations[lang][key]) {
            element.textContent = window.translations[lang][key];
        }
    });
    
    // 更新分页指示器
    updatePaginationLanguage(lang);
    
    // 更新语言特定的显示/隐藏元素
    updateLanguageSpecificElements(lang);
}

// 更新分页指示器语言
function updatePaginationLanguage(lang) {
    const pageIndicator = document.querySelector('.page-indicator span');
    if (pageIndicator) {
        const currentText = pageIndicator.textContent;
        // 提取页码信息
        const pageMatch = currentText.match(/\d+/g);
        if (pageMatch && pageMatch.length >= 2) {
            const currentPage = pageMatch[0];
            const totalPages = pageMatch[1];
            
            if (lang === 'en') {
                pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
            } else {
                pageIndicator.textContent = `第${currentPage}页，共${totalPages}页`;
            }
        }
    }
}

// 更新语言特定的显示/隐藏元素
function updateLanguageSpecificElements(lang) {
    // 通过设置HTML lang属性来控制语言显示，CSS会自动处理
    // 移除之前的内联样式设置，让CSS规则接管
    const enElements = document.querySelectorAll('.en');
    const zhElements = document.querySelectorAll('.zh');
    
    // 清除任何内联样式，让CSS规则生效
    enElements.forEach(el => el.style.display = '');
    zhElements.forEach(el => el.style.display = '');
}

// 页面加载完成后立即应用语言设置
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    updateContent(currentLang);
}); 