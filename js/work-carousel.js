// Автокарусель для страницы "Наши работы"

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = track ? track.children : [];
        if (!track || slides.length === 0) return;

        let index = 0;
        const total = slides.length;

        function showSlide(i) {
            track.style.transform = `translateX(-${i * 100}%)`;
        }

        let intervalId;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    intervalId = setInterval(() => {
                        index = (index + 1) % total;
                        showSlide(index);
                    }, 3000);
                } else {
                    clearInterval(intervalId);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(carousel);
    });
});
