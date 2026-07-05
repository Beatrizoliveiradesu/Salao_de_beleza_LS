document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MENU MOBILE & SCROLL HEADER
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Change header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       ACTIVE LINK HIGHLIGHT ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Aciona quando a seção está no meio da tela
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       SCROLL REVEAL (REVELAÇÃO AO ROLAR A PÁGINA)
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Aciona um pouco antes de entrar na tela
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Roda a animação apenas uma vez
            }
        });
    }, revealObserverOptions);

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    /* ==========================================================================
       SERVIÇOS - TAB FILTER (FILTRAGEM DE CATEGORIAS)
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            serviceCards.forEach(card => {
                // Efeito suave de transição ao ocultar/exibir
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       DEPOIMENTOS - SLIDER SIMPLE CAROUSEL
       ========================================================================== */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % testimonialCards.length;
        showSlide(nextIndex);
    }

    // Event listener for dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(slideInterval);
            const index = parseInt(e.target.getAttribute('data-slide'));
            showSlide(index);
            startAutoplay();
        });
    });

    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 6000); // Muda a cada 6 segundos
    }

    startAutoplay();

    /* ==========================================================================
       AGENDAMENTO INTERATIVO COM WHATSAPP
       ========================================================================== */
    const bookingForm = document.getElementById('booking-form');
    const bookingDateInput = document.getElementById('booking-date');

    // Impede a seleção de datas passadas no formulário
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name').value.trim();
        const service = document.getElementById('service-select').value;
        const dateInput = bookingDateInput.value;
        const period = document.getElementById('booking-time').value;
        const notes = document.getElementById('booking-notes').value.trim();

        // Formatar data para DD/MM/AAAA
        const dateParts = dateInput.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Número de telefone do salão Studios Luz & Stylo
        // Pode ser customizado com o número real do cliente
        const phoneNumber = '5592988441542'; 

        // Montagem da mensagem formatada para WhatsApp
        let message = `Olá, *Studios Luz & Stylo*!\n\n`;
        message += `Gostaria de realizar um pré-agendamento de atendimento:\n\n`;
        message += `👤 *Nome:* ${name}\n`;
        message += `💇‍♀️ *Procedimento:* ${service}\n`;
        message += `📅 *Data Desejada:* ${formattedDate}\n`;
        message += `🕒 *Período:* ${period}\n`;
        
        if (notes) {
            message += `📝 *Observação:* ${notes}\n`;
        }

        message += `\nAguardo a confirmação da disponibilidade de horário! Obrigado.`;

        // URL para redirecionamento
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Abre em uma nova aba/janela
        window.open(whatsappUrl, '_blank');
    });
});
