// Галерея для страницы "Наши работы"

document.addEventListener('DOMContentLoaded', function () {
    const galleries = {
        bathroom: ['img/gallery1.jpg', 'img/gallery1.png', 'img/unsplash1.jpg'],
        bedroom: ['img/gallery2.png', 'img/gallery3.png', 'img/gallery1.jpg'],
        kitchen: ['img/gallery3.png', 'img/gallery1.png', 'img/gallery2.png'],
        living: ['img/unsplash1.jpg', 'img/gallery2.png', 'img/gallery3.png'],
        kids: ['img/gallery1.png', 'img/gallery3.png', 'img/gallery1.jpg']
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

