// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,  // Whether animation should happen only once - while scrolling down
        mirror: false, // Whether elements should animate out while scrolling past them
        offset: 100,  // Offset (in px) from the original trigger point
        delay: 0     // Default delay before animation starts
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
            
            // Basic validation
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                showFormMessage('Please fill all required fields', 'error');
                return;
            }
            
            // Disable submit button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Send form data to the server
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        email: emailInput.value,
                        subject: subjectInput.value,
                        message: messageInput.value
                    })
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    // Show success message
                    showFormMessage('Message sent successfully!', 'success');
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error message
                    showFormMessage(data.message || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage('Failed to send message. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
        
        function showFormMessage(message, type) {
            const messageElement = document.getElementById('form-message');
            if (messageElement) {
                messageElement.textContent = message;
                messageElement.className = `form-message ${type}`;
                messageElement.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none';
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
}); 