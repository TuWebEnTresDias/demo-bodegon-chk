/* ==========================================================================
   CHEKA BODEGÓN URBANO — Script
   Interactividad: scroll reveal, header, menú mobile, tabs, formulario
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------------------
       HEADER — Cambio al hacer scroll
       ------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Ejecutar al cargar

    /* -------------------------------------------------------------------------
       MENÚ MOBILE — Toggle
       ------------------------------------------------------------------------- */
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

    const toggleMobileMenu = () => {
        menuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    /* -------------------------------------------------------------------------
       SCROLL REVEAL — Animaciones al entrar en viewport
       ------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay basado en la posición en el padre
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let siblingIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) siblingIndex = i;
                });
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, siblingIndex * 100);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* -------------------------------------------------------------------------
       MENÚ TABS — Navegación por categorías
       ------------------------------------------------------------------------- */
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    const switchTab = (tabId) => {
        // Actualizar tabs activos
        menuTabs.forEach(tab => {
            tab.classList.toggle('menu__tab--active', tab.dataset.tab === tabId);
        });

        // Mostrar categoría correspondiente
        menuCategories.forEach(category => {
            const isActive = category.id === tabId;
            category.classList.toggle('menu__category--active', isActive);
            
            // Resetear animación de items
            if (isActive) {
                const items = category.querySelectorAll('.menu__item');
                items.forEach((item, i) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50 + i * 30);
                });
            }
        });
    };

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Soporte para teclado en tabs
    menuTabs.forEach(tab => {
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(tab.dataset.tab);
            }
        });
    });

    /* -------------------------------------------------------------------------
       FORMULARIO — Enviar reserva por WhatsApp
       ------------------------------------------------------------------------- */
    const form = document.getElementById('reservaForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const personas = document.getElementById('personas').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            // Validación básica
            if (!nombre || !telefono || !fecha || !hora || !personas) {
                // Efecto visual en campos vacíos
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#e74c3c';
                        field.addEventListener('focus', () => {
                            field.style.borderColor = '';
                        }, { once: true });
                    }
                });
                return;
            }
            
            // Formatear fecha
            const fechaObj = new Date(fecha + 'T12:00:00');
            const opcionesFecha = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const fechaFormateada = fechaObj.toLocaleDateString('es-AR', opcionesFecha);
            
            // Construir mensaje
            let texto = `Hola CHEKA 👋\n\n`;
            texto += `Quiero hacer una reserva:\n\n`;
            texto += `👤 *Nombre:* ${nombre}\n`;
            texto += `📱 *Teléfono:* ${telefono}\n`;
            texto += `📅 *Fecha:* ${fechaFormateada}\n`;
            texto += `🕐 *Hora:* ${hora}\n`;
            texto += `👥 *Personas:* ${personas}\n`;
            
            if (mensaje) {
                texto += `\n💬 *Mensaje:* ${mensaje}\n`;
            }
            
            texto += `\n¡Gracias! 🍷`;
            
            // Abrir WhatsApp
            const whatsappUrl = `https://wa.me/5491167258986?text=${encodeURIComponent(texto)}`;
            window.open(whatsappUrl, '_blank');
            
            // Feedback visual
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ¡Enviado!
            `;
            submitBtn.style.backgroundColor = '#27ae60';
            submitBtn.style.borderColor = '#27ae60';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
                form.reset();
            }, 2500);
        });
    }

    /* -------------------------------------------------------------------------
       SMOOTH SCROLL — Para links internos
       ------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* -------------------------------------------------------------------------
       IMÁGENES — Error handling con fallback
       ------------------------------------------------------------------------- */
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(135deg, #2E4B3B 0%, #1A2F25 100%)';
            this.style.minHeight = '200px';
            this.alt = '';
        });
    });

    /* -------------------------------------------------------------------------
       PARALLAX — Efecto sutil en hero
       ------------------------------------------------------------------------- */
    const heroBg = document.querySelector('.hero__bg-img');
    
    if (heroBg && window.innerWidth > 768) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * 0.15;
                    heroBg.style.transform = `scale(1.05) translateY(${rate}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* -------------------------------------------------------------------------
       GALLERY — Lightbox simple (click para ver imagen completa)
       ------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.galeria__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            fullImg.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 1.5rem;
                right: 2rem;
                font-size: 2.5rem;
                color: white;
                background: none;
                border: none;
                cursor: pointer;
                line-height: 1;
                z-index: 10001;
            `;
            
            overlay.appendChild(fullImg);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            // Animar entrada
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                fullImg.style.transform = 'scale(1)';
            });
            
            const closeLightbox = () => {
                overlay.style.opacity = '0';
                fullImg.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target === closeBtn) {
                    closeLightbox();
                }
            });
            
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    /* -------------------------------------------------------------------------
       NAV ACTIVE STATE — Highlight según sección visible
       ------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
    
    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* -------------------------------------------------------------------------
       PERFORMANCE — Lazy load de imágenes que entran al viewport
       ------------------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
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
        }, {
            rootMargin: '200px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* -------------------------------------------------------------------------
       FECHA MÍNIMA — Formulario no permite fechas pasadas
       ------------------------------------------------------------------------- */
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        fechaInput.setAttribute('min', `${year}-${month}-${day}`);
    }

    /* -------------------------------------------------------------------------
       LOG — Consola branding
       ------------------------------------------------------------------------- */
    console.log(
        '%c🍺 CHEKA BODEGÓN URBANO %c Directorio 152, San Antonio de Padua',
        'background: #2E4B3B; color: #EDE5D3; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 4px 0 0 4px;',
        'background: #C9A96E; color: #1A2F25; padding: 8px 16px; font-size: 14px; border-radius: 0 4px 4px 0;'
    );

});
