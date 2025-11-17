// ===========================
// Smooth Scrolling & Navigation
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contact-form');

    // ===========================
    // Navbar Scroll Effect
    // ===========================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        if (currentScroll > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // ===========================
    // Mobile Menu Toggle
    // ===========================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===========================
    // Active Navigation Link
    // ===========================
    const sections = document.querySelectorAll('section[id]');

    const setActiveLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Set active on load

    // ===========================
    // Smooth Scroll
    // ===========================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // Scroll to Top
    // ===========================
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===========================
    // Counter Animation for Stats
    // ===========================
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(start);
            }
        }, 16);
    };

    // ===========================
    // Intersection Observer for Animations
    // ===========================
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters when stats section is visible
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.classList.add('fade-in');
        observer.observe(stat);
    });

    // Observe all cards for entrance animations
    const cards = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // ===========================
    // Form Validation & Submission
    // ===========================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            }, 2000);
        });
    }

    // ===========================
    // Notification System
    // ===========================
    const showNotification = (message, type = 'success') => {
        // Remove existing notification if any
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : '✕'}
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    };

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-icon {
            font-size: 1.25rem;
            font-weight: bold;
        }
        
        .notification-message {
            font-size: 0.9375rem;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    // ===========================
    // Parallax Effect on Hero Section
    // ===========================
    const heroShapes = document.querySelectorAll('.hero-shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ===========================
    // Typing Effect for Hero Title (Optional)
    // ===========================
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    };

    // Uncomment to enable typing effect
    // const heroTitle = document.querySelector('.hero-title .title-line:first-child');
    // if (heroTitle) {
    //     const originalText = heroTitle.textContent;
    //     typeWriter(heroTitle, originalText, 100);
    // }

    // ===========================
    // Add hover effect to project cards
    // ===========================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===========================
    // Skill Card Animations
    // ===========================
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
        });
    });

    // ===========================
    // Add ripple effect to buttons
    // ===========================
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===========================
    // Lazy Loading Images (if you add images later)
    // ===========================
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===========================
    // Cursor Follow Effect (Optional)
    // ===========================
    const createCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #6366f1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            display: none;
        `;
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        cursorDot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #6366f1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            display: none;
        `;
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursorDot.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursorDot.style.left = e.clientX - 3 + 'px';
            cursorDot.style.top = e.clientY - 3 + 'px';
        });

        // Scale up on hover over interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#8b5cf6';
                cursorDot.style.background = '#8b5cf6';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#6366f1';
                cursorDot.style.background = '#6366f1';
            });
        });
    };

    // Uncomment to enable custom cursor (desktop only)
    // if (window.innerWidth > 768) {
    //     createCursor();
    // }

    // ===========================
    // Performance: Debounce scroll events
    // ===========================
    const debounce = (func, wait = 10) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Apply debounce to scroll-heavy operations
    window.addEventListener('scroll', debounce(() => {
        // Your scroll operations here
    }, 10));

    // ===========================
    // Add loading animation
    // ===========================
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        }
    });

    // ===========================
    // Console Art (Optional)
    // ===========================
    console.log('%c👋 Hi there!', 'font-size: 2em; color: #6366f1; font-weight: bold;');
    console.log('%cLooking for something? Feel free to reach out!', 'font-size: 1.2em; color: #8b5cf6;');
    console.log('%c💼 Portfolio built with ❤️', 'font-size: 1em; color: #6b7280;');

    // ===========================
    // Log initialization
    // ===========================
    console.log('✅ Portfolio initialized successfully!');
});

// ===========================
// Utility Functions
// ===========================

// Detect if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Get scroll percentage
const getScrollPercentage = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
};

// Throttle function for performance
const throttle = (func, limit) => {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
