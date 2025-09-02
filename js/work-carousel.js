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

        function startAuto() {
            return setInterval(() => {
                index = (index + 1) % total;
                showSlide(index);
            }, 3000);
        }

        let intervalId;
        const isDesktop = window.matchMedia('(min-width: 993px)').matches;

        if ('IntersectionObserver' in window && !isDesktop) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!intervalId) intervalId = startAuto();
                    } else {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(carousel);
        } else {
            intervalId = startAuto();
        }
    });
});
