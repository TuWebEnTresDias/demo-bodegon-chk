/* ============================================
   CHEKA BODEGÓN URBANO — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // --- Mobile Menu ---
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    mainNav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // --- Menu Tabs ---
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('menu__tab--active'));
            tab.classList.add('menu__tab--active');
            
            // Update active category
            menuCategories.forEach(cat => cat.classList.remove('menu__category--active'));
            document.getElementById(targetId)?.classList.add('menu__category--active');
            
            // Scroll to menu content
            const menuContent = document.querySelector('.menu__content');
            if (menuContent) {
                const offset = menuContent.offsetTop - 100;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Menu Expand/Collapse ---
    const expandButtons = document.querySelectorAll('.menu__expand-btn');
    
    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const hiddenItems = document.getElementById(targetId);
            
            if (hiddenItems) {
                hiddenItems.classList.toggle('expanded');
                btn.textContent = hiddenItems.classList.contains('expanded') 
                    ? 'Mostrar menos' 
                    : btn.textContent.includes('todos') 
                        ? `Ver todos los platos` 
                        : 'Ver más';
                
                // Update button text based on context
                if (hiddenItems.classList.contains('expanded')) {
                    btn.textContent = 'Mostrar menos';
                } else if (targetId.includes('compartir')) {
                    btn.textContent = 'Ver todos los platos para compartir';
                } else if (targetId.includes('principales')) {
                    btn.textContent = 'Ver todos los platos principales';
                } else {
                    btn.textContent = 'Ver más postres';
                }
            }
        });
    });
    
    // --- Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements in the same section
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => observer.observe(el));
    
    // --- Reservation Form to WhatsApp ---
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(reservationForm);
            const name = formData.get('name') || 'No especificado';
            const phone = formData.get('phone') || 'No especificado';
            const date = formData.get('date') || 'No especificada';
            const time = formData.get('time') || 'No especificada';
            const guests = formData.get('guests') || 'No especificados';
            const message = formData.get('message') || '';
            
            // Format date for display
            let formattedDate = date;
            if (date) {
                const dateObj = new Date(date + 'T12:00:00');
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                formattedDate = dateObj.toLocaleDateString('es-AR', options);
            }
            
            // Build WhatsApp message
            let whatsappMessage = `🍽️ *Reserva en CHEKA Bodegón Urbano*\n\n`;
            whatsappMessage += `👤 *Nombre:* ${name}\n`;
            whatsappMessage += `📱 *Teléfono:* ${phone}\n`;
            whatsappMessage += `📅 *Fecha:* ${formattedDate}\n`;
            whatsappMessage += `🕐 *Hora:* ${time}\n`;
            whatsappMessage += `👥 *Personas:* ${guests}\n`;
            
            if (message) {
                whatsappMessage += `\n💬 *Mensaje adicional:* ${message}\n`;
            }
            
            whatsappMessage += `\n¡Gracias! Espero su confirmación.`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5491167258986?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Show success feedback
            const submitBtn = reservationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>¡Mensaje enviado!</span>';
            submitBtn.style.backgroundColor = '#25D366';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                reservationForm.reset();
            }, 3000);
        });
    }
    
    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Parallax Effect for Hero (subtle) ---
    const heroBg = document.querySelector('.hero__bg-img');
    
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${rate}px)`;
            }
        }, { passive: true });
    }
    
    // --- Gallery Hover Effect Enhancement ---
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // --- Current Year in Footer ---
    const yearElements = document.querySelectorAll('.footer__copyright');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = el.textContent.replace(/\d{4}/, currentYear);
    });
    
    // --- Active Navigation Highlight ---
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.header__nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav, { passive: true });
    
    // --- Lazy Load Images (native + fallback) ---
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // --- WhatsApp Float Animation on Scroll ---
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        let hasAnimated = false;
        
        window.addEventListener('scroll', () => {
            if (!hasAnimated && window.scrollY > 300) {
                whatsappFloat.style.animation = 'none';
                whatsappFloat.offsetHeight; // Trigger reflow
                whatsappFloat.style.animation = 'whatsappBounce 0.5s ease';
                hasAnimated = true;
            }
        }, { passive: true });
    }
    
    // --- Console Easter Egg ---
    console.log('%c🍷 CHEKA BODEGÓN URBANO', 'font-size: 20px; font-weight: bold; color: #C4A265;');
    console.log('%cEl bodegón del barrio que se puso las pilas.', 'font-size: 12px; color: #F7F1E3;');
    console.log('%cDirectorio 152, San Antonio de Padua', 'font-size: 10px; color: #666;');
});

/* ============================================
   ADDITIONAL ANIMATION KEYFRAME (injected via JS)
   ============================================ */
const style = document.createElement('style');
style.textContent = `
    @keyframes whatsappBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .header__nav-link.active {
        color: var(--dorado);
    }
    
    .header__nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
