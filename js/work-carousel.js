// Автокарусель для страницы "Наши работы" с отображением предыдущего и следующего изображения

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track ? track.children : []);
        if (!track || slides.length === 0) return;

        let index = 0;
        const total = slides.length;

        function update() {
            const width = carousel.clientWidth;
            const activeWidth = width * 0.5;
            const sideWidth = width * 0.2;
            const activeLeft = (width - activeWidth) / 2;
            const nextLeft = width - sideWidth;
            const offRight = width + sideWidth;
            const offLeft = -sideWidth;

            const prev = (index - 1 + total) % total;
            const next = (index + 1) % total;
            const prevPrev = (index - 2 + total) % total;

            slides.forEach((slide, i) => {
                slide.style.position = 'absolute';
                slide.style.top = '50%';
                slide.style.left = '0';
                slide.style.height = '100%';
                slide.style.objectFit = 'cover';
                slide.style.transition = 'transform 0.5s ease, width 0.5s ease';

                if (i === index) {
                    slide.style.width = `${activeWidth}px`;
                    slide.style.transform = `translate(${activeLeft}px, -50%)`;
                    slide.style.zIndex = 2;
                } else if (i === prev) {
                    slide.style.width = `${sideWidth}px`;
                    slide.style.transform = `translate(0px, -50%)`;
                    slide.style.zIndex = 1;
                } else if (i === next) {
                    slide.style.width = `${sideWidth}px`;
                    slide.style.transform = `translate(${nextLeft}px, -50%)`;
                    slide.style.zIndex = 1;
                } else if (i === prevPrev) {
                    slide.style.width = `${sideWidth}px`;
                    slide.style.transform = `translate(${offLeft}px, -50%)`;
                    slide.style.zIndex = 0;
                } else {
                    slide.style.width = `${sideWidth}px`;
                    slide.style.transform = `translate(${offRight}px, -50%)`;
                    slide.style.zIndex = 0;
                }
            });
        }

        function startAuto() {
            return setInterval(() => {
                index = (index + 1) % total;
                update();
            }, 3000);
        }

        let intervalId;
        update();

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

        window.addEventListener('resize', update);
    });
});

