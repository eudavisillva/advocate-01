/**
 * Script para Landing Page - Neli Carvalho Novaes Advocacia
 *
 * Funcionalidades:
 * 1. Animações ao rolar (Intersection Observer)
 * 2. Toggle de Dark Mode com persistência em localStorage
 * 3. Validação de Formulário de Contato (Client-side)
 * 4. Simulação de Envio de Formulário (AJAX/Fetch) - Requer adaptação para backend real
 * 5. Header Fixo com mudança de estilo ao rolar (Scrollspy simples)
 * 6. Menu Mobile (Toggle)
 * 7. Atualização do ano no rodapé
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Animações ao Rolar (Intersection Observer) ---
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const revealObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Ativa quando 15% está visível
        };

        const revealCallback = (entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Adiciona delay baseado no índice do elemento (opcional, pode usar classes delay-X)
                    // entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Anima só uma vez
                }
            });
        };
        const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
        elementsToReveal.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback para navegadores antigos: revela tudo de uma vez
        console.warn("IntersectionObserver não suportado. Revelando elementos.");
        elementsToReveal.forEach(el => el.classList.add('is-visible'));
    }


    // --- 2. Toggle de Dark Mode ---
    const themeToggleButton = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Aplica tema salvo ou preferência do sistema no carregamento inicial
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add("dark-mode"); // Compatibilidade com regras que usam classe
    } else if (currentTheme === 'light') {
         document.body.setAttribute('data-theme', 'light');
         document.body.classList.remove("dark-mode");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
         // Se não há tema salvo, usa a preferência do sistema
         document.body.setAttribute('data-theme', 'dark');
         document.body.classList.add("dark-mode");
    } // O padrão é light (definido no body ou CSS inicial)

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme;
            if (document.body.getAttribute('data-theme') === 'dark') {
                newTheme = 'light';
                document.body.classList.remove("dark-mode");
            } else {
                newTheme = 'dark';
                 document.body.classList.add("dark-mode");
            }
            document.body.setAttribute('data-theme', newTheme);
            // Salva preferência no localStorage
            localStorage.setItem('theme', newTheme);
             // Adiciona atributo para CSS saber que foi definido pelo usuário
             document.documentElement.setAttribute('data-user-theme', '');
        });
    }


    // --- 3. Validação e "Envio" do Formulário de Contato ---
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        const formStatus = contactForm.querySelector('.form-status');

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do HTML
            clearErrors(contactForm); // Limpa erros anteriores
            formStatus.textContent = 'Enviando...';
            formStatus.style.color = 'var(--color-secondary)';

            if (!validateForm(contactForm)) {
                formStatus.textContent = 'Por favor, corrija os erros no formulário.';
                 formStatus.style.color = '#dc3545'; // Cor de erro
                return; // Interrompe se a validação falhar
            }

            // Simulação de envio com Fetch (REQUER BACKEND REAL)
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action'); // Pegar URL real do action

            // --- SUBSTITUA ESTE BLOCO PELO SEU ENVIO REAL ---
            console.log("Dados do formulário a serem enviados:", Object.fromEntries(formData));
            // Exemplo usando um serviço como Formspree ou um endpoint seu:
            try {
                 // Simula um delay de rede
                 await new Promise(resolve => setTimeout(resolve, 1500));

                 // Exemplo com Fetch (descomente e ajuste action/headers se for usar)
                 /*
                 const response = await fetch(formAction, {
                     method: 'POST',
                     body: formData, // FormData é bom para arquivos, ou use JSON.stringify(Object.fromEntries(formData))
                     headers: {
                          // 'Content-Type': 'application/json', // Se enviar JSON
                         'Accept': 'application/json'
                     }
                 });

                 if (!response.ok) {
                      // Tenta pegar erro do backend, se houver
                     const errorData = await response.json().catch(() => ({}));
                     throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
                 }

                 const result = await response.json(); // Ou .text() dependendo do backend
                 console.log('Sucesso:', result);
                 */

                 // --- SIMULAÇÃO DE SUCESSO ---
                 formStatus.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                 formStatus.style.color = '#28a745'; // Cor de sucesso
                 contactForm.reset(); // Limpa o formulário
                 clearErrors(contactForm); // Limpa erros visuais

             } catch (error) {
                 console.error('Erro ao enviar formulário:', error);
                 formStatus.textContent = `Erro ao enviar: ${error.message || 'Tente novamente mais tarde.'}`;
                 formStatus.style.color = '#dc3545'; // Cor de erro
             }
            // --- FIM DO BLOCO DE ENVIO REAL/SIMULADO ---
        });
    }

    // --- Funções Auxiliares de Validação ---
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const value = input.value.trim();
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup ? formGroup.querySelector('.error-message') : null;

            if (!errorElement) return; // Pula se não encontrar onde mostrar erro

            // Reset
            input.removeAttribute('aria-invalid');
            errorElement.textContent = '';

            // Validação de Campo Vazio
            if (input.hasAttribute('required') && value === '') {
                isValid = false;
                showError(input, errorElement, 'Este campo é obrigatório.');
            }
            // Validação de Comprimento Mínimo
            else if (input.hasAttribute('minlength') && value.length < parseInt(input.getAttribute('minlength'), 10)) {
                 isValid = false;
                 showError(input, errorElement, `Deve ter no mínimo ${input.getAttribute('minlength')} caracteres.`);
            }
            // Validação de Email
            else if (input.type === 'email' && !isValidEmail(value)) {
                 isValid = false;
                 showError(input, errorElement, 'Por favor, insira um e-mail válido.');
            }
        });
        return isValid;
    }

    function showError(inputElement, errorElement, message) {
         inputElement.setAttribute('aria-invalid', 'true');
         if (errorElement) {
             errorElement.textContent = message;
         }
    }

    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    }

    function isValidEmail(email) {
        // Regex simples para validação de email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    // --- 5. Header Fixo com Estilo ao Rolar (Scrollspy Simples) ---
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const scrollThreshold = 50; // Distância em pixels para ativar o estilo
        let isThrottled = false;

        window.addEventListener('scroll', () => {
            if (!isThrottled) {
                window.requestAnimationFrame(() => {
                     if (window.scrollY > scrollThreshold) {
                        document.body.classList.add('scrolled');
                    } else {
                        document.body.classList.remove('scrolled');
                    }
                    isThrottled = false;
                });
                isThrottled = true;
            }
        });
    }


    // --- 6. Menu Mobile (Toggle) ---
    const menuToggleButton = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav'); // Assumindo que a nav principal tem esta classe

    if (menuToggleButton && mainNav) {
        menuToggleButton.addEventListener('click', () => {
            const isExpanded = menuToggleButton.getAttribute('aria-expanded') === 'true';
            menuToggleButton.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-open'); // Adiciona/remove classe para mostrar/esconder menu
            // Alternar ícone (opcional)
            const icon = menuToggleButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times'); // Ícone 'X' para fechar
            }
            // Adicionar/Remover classe no body pode ser útil para travar scroll
             document.body.classList.toggle('mobile-menu-open');
        });

        // Adicionar CSS para o menu mobile (exemplo):
        /*
        @media (max-width: 768px) {
            .main-nav {
                display: none; // Escondido por padrão
                position: absolute; top: 100%; left: 0; right: 0;
                background-color: var(--color-background);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                padding: var(--space-md);
                border-top: 1px solid var(--color-border);
                z-index: 99;
            }
            .main-nav.is-open { display: block; } // Mostra quando ativo
            .main-nav ul { flex-direction: column; gap: var(--space-sm); }
            .main-nav a { display: block; padding: var(--space-sm); text-align: center; }
            .main-nav a::after { display: none; } // Remove sublinhado animado mobile
            body.mobile-menu-open { overflow: hidden; } // Trava scroll do body
        }
        */
    }


    // --- 7. Atualizar Ano no Rodapé ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // Fim do DOMContentLoaded
