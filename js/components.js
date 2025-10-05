const TELEGRAM_CONFIG = window.TELEGRAM_CONFIG || {
    token: '1403690168:AAHqRNU27X5THfsdASyZHMHdWwHX9d5SZcs',
    chatId: '335094318'
};

window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;

const TELEGRAM_FIELD_LABELS = {
    name: 'Имя',
    phone: 'Телефон',
    message: 'Комментарий'
};

// Функция инициализации общих компонентов
function initCommonComponents() {
    // Инициализация мобильного меню
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.navbar-menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('show');
            this.classList.toggle('open');
        });

        // Закрываем меню при выборе пункта
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('show');
                menuToggle.classList.remove('open');
            });
        });
    }

    // Установка активного пункта меню
    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop();
        const menuItems = document.querySelectorAll('.navbar-menu a');

        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.parentElement.classList.add('active');
                item.removeAttribute('href');
                item.setAttribute('aria-current', 'page');
            }
        });
    }

    setActiveMenuItem();

    // Плавная прокрутка к калькулятору
    const scrollBtn = document.getElementById('scrollToCalculator');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const calculatorSection = document.getElementById('calculatorSection');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Анимация подсветки
                calculatorSection.classList.remove('highlight-animation');
                void calculatorSection.offsetWidth;
                calculatorSection.classList.add('highlight-animation');
            }
        });
    }

    // Инициализация модального окна
    const modal = document.getElementById('modal');
    const openModalButtons = document.querySelectorAll('[data-open-modal]');
    const closeBtn = document.querySelector('.close');

    if (modal && openModalButtons.length > 0) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Форматирование телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');
        });
    }

    initTelegramForms();
}

// Обновляем функцию инициализации мобильного меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('show');
            this.classList.toggle('open');
        });

        // Закрываем меню при клике на пункт
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('show');
                menuToggle.classList.remove('open');
            });
        });

        // Закрываем меню при изменении ориентации
        window.addEventListener('orientationchange', () => {
            menu.classList.remove('show');
            menuToggle.classList.remove('open');
        });
    }
}

async function sendTelegramLead(form) {
    const { token, chatId } = window.TELEGRAM_CONFIG || {};

    if (!token || !chatId) {
        throw new Error('Не настроены параметры Telegram.');
    }

    const formData = new FormData(form);
    const entries = [];

    formData.forEach((value, key) => {
        const stringValue = String(value).trim();
        if (!stringValue) {
            return;
        }

        const fieldElement = form.querySelector(`[name="${key}"]`);
        const label = fieldElement?.dataset.label || TELEGRAM_FIELD_LABELS[key] || key;
        entries.push(`• ${label}: ${stringValue}`);
    });

    const source = form.dataset.formSource || 'Форма заявки';
    const pageTitle = document.title || 'Страница сайта';
    const pageUrl = window.location.href;

    const messageParts = [
        '🔔 Новая заявка с сайта',
        `Источник: ${source}`,
        `Страница: ${pageTitle}`,
        `URL: ${pageUrl}`
    ];

    if (entries.length) {
        messageParts.push('', 'Данные клиента:', ...entries);
    }

    messageParts.push('', `Отправлено: ${new Date().toLocaleString()}`);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: messageParts.join('\n')
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();

    if (!result.ok) {
        throw new Error(result.description || 'Ошибка Telegram API');
    }
}

function initTelegramForms() {
    const forms = document.querySelectorAll('form[data-telegram-form]');

    if (!forms.length) {
        return;
    }

    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = form.querySelector('[type="submit"]');
            const originalText = submitButton?.textContent;

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = submitButton.dataset.loadingText || 'Отправляем...';
            }

            try {
                await sendTelegramLead(form);
                form.reset();

                const modal = form.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }

                alert('Спасибо! Мы скоро с вами свяжемся.');
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                alert('Произошла ошибка. Пожалуйста, позвоните нам напрямую.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText || 'Отправить';
                }
            }
        });
    });
}
