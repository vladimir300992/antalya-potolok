// Галерея для страницы "Наши работы"

document.addEventListener('DOMContentLoaded', function () {
    const galleries = {
        bathroom: ['img/bathroom1.png', 'img/bathroom2.png', 'img/bathroom3.png','img/bathroom4.png','img/bathroom5.png'],
        bedroom: ['img/bedroom1.png', 'img/bedroom2.png', 'img/bedroom3.png','img/bedroom4.png','img/bedroom5.png'],
        kitchen: ['img/kitchen1.png', 'img/kitchen2.png', 'img/kitchen3.png','img/kitchen4.png','img/kitchen5.png'],
        living: ['img/living1.png', 'img/living2.png', 'img/living3.png', 'img/living4.png', 'img/living5.png'],
        kids: ['img/kids1.png', 'img/kids2.png', 'img/kids3.png','img/kids4.png','img/kids4.png']
    };

    const modal = document.getElementById('galleryModal');
    const content = modal ? modal.querySelector('.gallery-content') : null;
    const prevBtn = modal ? modal.querySelector('.gallery-prev') : null;
    const nextBtn = modal ? modal.querySelector('.gallery-next') : null;
    const closeBtn = modal ? modal.querySelector('.gallery-close') : null;

    if (!modal || !content) {
        return;
    }

    let currentImages = [];
    let currentIndex = 0;

    function showImage(index) {
        const src = currentImages[index];
        content.innerHTML = `<img src="${src}" alt="Галерея">`;
    }

    document.querySelectorAll('.room-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            currentImages = galleries[category] || [];
            if (currentImages.length === 0) return;
            currentIndex = 0;
            showImage(currentIndex);
            modal.classList.add('show');
        });
    });

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex);
    }

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

