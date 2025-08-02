document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const menu = document.querySelector('.navbar-menu');
            menu.classList.toggle('show');
            this.classList.toggle('open');
        });
    }

    // Обработчик кнопки расчета в калькуляторе
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePrice);
    }

    // Обработчик модального окна
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

    // Плавная прокрутка к калькулятору
    const scrollToCalculatorBtn = document.getElementById('scrollToCalculator');
    if (scrollToCalculatorBtn) {
        scrollToCalculatorBtn.addEventListener('click', function() {
            const calculatorSection = document.getElementById('calculatorSection');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Добавляем анимацию подсветки
                calculatorSection.classList.remove('highlight-animation');
                void calculatorSection.offsetWidth;
                calculatorSection.classList.add('highlight-animation');
            }
        });
    }
});

function calculatePrice() {
    // Получаем значения
    const perimeter = parseFloat(document.getElementById('perimeter').value) || 0;
    const area = parseFloat(document.getElementById('area').value) || 0;
    const lights = parseInt(document.getElementById('lights').value) || 0;
    const profileType = document.querySelector('input[name="profile"]:checked').value;

    // Расчет стоимости
    let price = perimeter * 7.4 + area * 18 + lights * 10;

    // Надбавка за теневой профиль
    if (profileType === 'shadow') {
        price += 20 + (perimeter * 1.6);
    }

    // Округление до 10
    price = Math.round(price / 10) * 10;

    // Расчет скидки
    const discount = Math.round(price * 0.1);
    const finalPrice = price - discount;

    // Отображаем результат с анимацией
    const result = document.getElementById('calcResult');
    result.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 18px;">Стоимость по заданным параметрам:</div>
        <div class="price-container">
            <div class="old-price-wrapper">
                <span class="old-price">${price} $</span>
            </div>
            <div class="discount-badge">Ваша скидка 10%!</div>
            <div class="new-price">Итого: ${finalPrice} $</div>
        </div>
    `;
    result.style.display = 'block';

    // Сбрасываем анимации для повторного расчета
    const animatedElements = result.querySelectorAll('.old-price, .discount-badge, .new-price');
    animatedElements.forEach(el => {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = null;
    });

    // Показываем форму для контактов
    document.getElementById('clientForm').style.display = 'block';
}

function sendToGoogleSheets() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const perimeter = document.getElementById('perimeter').value;
    const area = document.getElementById('area').value;
    const lights = document.getElementById('lights').value;
    const canvasType = document.querySelector('input[name="canvas"]:checked').value;
    const profileType = document.querySelector('input[name="profile"]:checked').value;

    // Получаем рассчитанные значения
    const resultText = document.getElementById('calcResult').innerText;

    // URL вашего Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyJzWQg56r4y5e3MH6DWRfdlOvNjdE5BvUqOn2DnOintOCbx1goMcOMdYiYgMEHPPj73A/exec';

    // Отправляем данные
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            perimeter: perimeter,
            area: area,
            lights: lights,
            canvasType: canvasType,
            profileType: profileType,
            calculation: resultText,
            timestamp: new Date().toLocaleString()
        })
    })
    .then(() => {
        alert('Спасибо! Мы скоро с вами свяжемся.');
        document.getElementById('calcForm').reset();
        document.getElementById('calcResult').style.display = 'none';
        document.getElementById('clientForm').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка. Пожалуйста, позвоните нам напрямую.');
    });
}
