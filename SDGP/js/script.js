document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
});

/* ==================== NAVBAR SCROLL EFFECT ==================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    handleScroll();

    // Listen for scroll events with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });
}

/* ==================== MOBILE MENU TOGGLE ==================== */
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navCta = document.querySelector('.nav-cta-btn');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function() {
            // Toggle hamburger animation
            mobileBtn.classList.toggle('active');
            
            // Toggle nav links visibility
            navLinks.classList.toggle('active');
            
            // Show/hide CTA button
            if (navLinks.classList.contains('active')) {
                navCta.style.display = 'block';
                navCta.classList.add('active');
            } else {
                navCta.classList.remove('active');
                setTimeout(() => {
                    navCta.style.display = '';
                }, 300);
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
                navCta.classList.remove('active');
                setTimeout(() => {
                    navCta.style.display = '';
                }, 300);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
                navCta.classList.remove('active');
            }
        });
    }
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    // Handle anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== SCROLL REVEAL ANIMATIONS ==================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });
}

/* ==================== PARALLAX EFFECT ==================== */
function initParallax() {
    const blobs = document.querySelectorAll('.gradient-blob, .cta-blob');
    
    if (blobs.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollY = window.scrollY;
                
                blobs.forEach((blob, index) => {
                    const speed = 0.1 + (index * 0.02);
                    const yPos = scrollY * speed;
                    blob.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

/* ==================== ADDITIONAL ENHANCEMENTS ==================== */

// Add floating animation intensity variation to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.match-card');
    
    cards.forEach((card, index) => {
        // Add slight delay variations for more organic feel
        card.style.animationDelay = `${index * 0.5}s`;
    });
});

// Add hover effect to timeline steps
const timelineSteps = document.querySelectorAll('.timeline-step');
timelineSteps.forEach(step => {
    step.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    step.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Handle window resize to reset mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const navCta = document.querySelector('.nav-cta-btn');
        
        if (mobileBtn) mobileBtn.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (navCta) {
            navCta.classList.remove('active');
            navCta.style.display = '';
        }
    }
});

// Preload fonts for smoother appearance
if ('fonts' in document) {
    document.fonts.ready.then(function() {
        document.body.classList.add('fonts-loaded');
    });
}

// Add CSS class when fonts are loaded
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    body.fonts-loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Trigger initial animation
window.addEventListener('load', function() {
    document.body.classList.add('fonts-loaded');
});

