"use strict";

// Keep the same primary navigation on all inner pages without duplicating markup changes.
const primaryNav = document.querySelector(".site-header nav");
if (primaryNav) {
  const currentPath = window.location.pathname;
  const items = [
    ["/potolki.html", "Решения"],
    ["/rphotos.html", "Работы"],
    ["/ceny.html", "Цены"],
    ["/otzyvy.html", "Отзывы"],
    ["/company.html", "О нас"],
    ["/kontakty.html", "Контакты"],
  ];
  primaryNav.innerHTML = items
    .map(([href, label]) => {
      const current = currentPath === href ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    })
    .join("");
}

// Give the long catalogue clear internal links to dedicated commercial pages.
const solutionPages = {
  "shadow-profile": ["/tenevoj-potolok.html", "Подробнее о теневом потолке ↗"],
  floating: ["/paryashchiy-potolok.html", "Подробнее о парящем потолке ↗"],
  "light-lines": ["/svetovye-linii.html", "Подробнее о световых линиях ↗"],
  track: ["/trekovoe-osveshchenie.html", "Подробнее о трековом освещении ↗"],
};
Object.entries(solutionPages).forEach(([id, [href, label]]) => {
  const card = document.getElementById(id);
  const content = card?.querySelector(".catalog-content");
  if (!content || content.querySelector(`[href="${href}"]`)) return;
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = href;
  link.textContent = label;
  content.append(link);
});

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
