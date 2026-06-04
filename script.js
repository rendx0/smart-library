// ============ NAVIGATION FUNCTIONALITY ============
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeCarousel();
    initializeScrollAnimations();
    initializeFormValidation();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scroll and active link highlight
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Set initial active link
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ============ SEARCH FUNCTIONALITY ============
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterSelects = document.querySelectorAll('.filter-select');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    filterSelects.forEach(select => {
        select.addEventListener('change', performSearch);
    });
}

function performSearch() {
    const query = document.querySelector('.search-input').value;
    const category = document.querySelector('.filter-select:nth-of-type(1)').value;
    const rating = document.querySelector('.filter-select:nth-of-type(2)').value;

    if (query.trim() === '') {
        showNotification('Хайх үгээ оруулна уу', 'warning');
        return;
    }

    console.log('Searching:', {
        query: query,
        category: category,
        rating: rating
    });

    // Simulate search results
    showNotification(`"${query}" - ээр ${12} ном олдлоо`, 'success');
    
    // Scroll to featured section
    document.querySelector('.featured-section').scrollIntoView({ behavior: 'smooth' });
}

// ============ CAROUSEL FUNCTIONALITY ============
function initializeCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!carouselTrack) return;

    const scrollAmount = 200;

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}

// ============ SCROLL ANIMATIONS ============
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.book-card, .category-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ============ FORM VALIDATION ============
function initializeFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            // Validation
            if (!name) {
                showNotification('Нэр оруулна уу', 'error');
                return;
            }

            if (!email || !isValidEmail(email)) {
                showNotification('Зөв имэйл оруулна уу', 'error');
                return;
            }

            if (!message) {
                showNotification('Мессеж оруулна уу', 'error');
                return;
            }

            // Send form
            console.log('Form submitted:', { name, email, message });
            showNotification('Мессеж амжилттай илгээгдлээ! Баярлалаа.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    `;

    // Set background color based on type
    const colors = {
        success: 'background: linear-gradient(135deg, #4CAF50, #45a049); color: white;',
        error: 'background: linear-gradient(135deg, #f44336, #da190b); color: white;',
        warning: 'background: linear-gradient(135deg, #ff9800, #e65100); color: white;',
        info: 'background: linear-gradient(135deg, #2196F3, #0b7dda); color: white;'
    };

    notification.style.cssText += colors[type] || colors.info;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============ BUTTON INTERACTIONS ============
document.addEventListener('DOMContentLoaded', function() {
    // Book action buttons
    document.querySelectorAll('.book-actions .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bookTitle = this.closest('.book-info').querySelector('h3').textContent;
            
            if (this.classList.contains('btn-primary')) {
                showNotification(`"${bookTitle}" номын дэлгэрэнгүй мэдээлэл`, 'info');
            } else if (this.classList.contains('btn-secondary')) {
                showNotification(`"${bookTitle}" номыг захиалалаа!`, 'success');
            }
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            showNotification(`${categoryName} ангилалд нэвтэрч байна...`, 'info');
        });
    });

    // Small book cards
    document.querySelectorAll('.book-card-small .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const bookTitle = this.closest('.book-card-small').querySelector('h4').textContent;
            showNotification(`"${bookTitle}" номын дэлгэрэнгүй`, 'info');
        });
    });

    // Auth buttons
    document.querySelectorAll('.nav-link.auth').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const authType = this.textContent.trim();
            showNotification(`${authType} хуудас нээхүүллээ`, 'info');
        });
    });
});

// ============ SMOOTH PAGE LOAD ============
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close modals (if any)
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        }
    }
});

// ============ DARK MODE TOGGLE (Optional Feature) ============
function initializeDarkMode() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    prefersDarkScheme.addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

// ============ PERFORMANCE OPTIMIZATION ============
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============ EXPORT FUNCTIONS FOR GLOBAL ACCESS ============
window.SmartLibrary = {
    search: performSearch,
    notify: showNotification,
    handleBookClick: function(bookTitle) {
        showNotification(`"${bookTitle}" номыг сонгосон`, 'info');
    }
};

// ============ ADDITIONAL STYLES FOR NOTIFICATIONS ============
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification {
        max-width: 400px;
    }

    @media (max-width: 480px) {
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

console.log('Smart Library initialized successfully! 📚');