// Функция инициализации общих компонентов
function initCommonComponents() {
    // Инициализация мобильного меню
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const menu = document.querySelector('.navbar-menu');
            menu.classList.toggle('show');
            this.classList.toggle('open');
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
    const openModalBtn = document.getElementById('openModal');
    const closeBtn = document.querySelector('.close');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
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
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initCommonComponents);
