"use strict";
// Native horizontal scrolling remains available without JavaScript.
document.querySelectorAll(".work-section").forEach((section) => {
  const track = section.querySelector(".carousel-track");
  const controls = section.querySelector(".gallery-controls");
  if (!track || !controls) return;
  controls.hidden = false;
  const previous = controls.querySelector('[data-slide="-1"]');
  const next = controls.querySelector('[data-slide="1"]');
  function update() {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slide]");
    if (!button) return;
    const image = track.querySelector("img");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({
      left:
        Number(button.dataset.slide) *
        (image.getBoundingClientRect().width + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});
