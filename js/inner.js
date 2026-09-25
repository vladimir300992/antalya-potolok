"use strict";

const currentPath = window.location.pathname;
const pageLanguage = document.documentElement.lang || "ru";

// Add English as the third visible language on the existing RU/TR pages.
const englishPairs = {
  "/potolki.html": "/en/stretch-ceilings.html",
  "/tr/gergi-tavan.html": "/en/stretch-ceilings.html",
  "/ceny.html": "/en/prices.html",
  "/tr/fiyatlar.html": "/en/prices.html",
  "/rphotos.html": "/en/projects.html",
  "/tr/projeler.html": "/en/projects.html",
  "/otzyvy.html": "/en/reviews.html",
  "/tr/yorumlar.html": "/en/reviews.html",
  "/company.html": "/en/about.html",
  "/tr/hakkimizda.html": "/en/about.html",
  "/kontakty.html": "/en/contact.html",
  "/tr/iletisim.html": "/en/contact.html",
  "/tenevoj-potolok.html": "/en/shadow-gap-ceiling.html",
  "/tr/golge-profil-gergi-tavan.html": "/en/shadow-gap-ceiling.html",
  "/paryashchiy-potolok.html": "/en/floating-led-ceiling.html",
  "/tr/ledli-gergi-tavan.html": "/en/floating-led-ceiling.html",
  "/svetovye-linii.html": "/en/linear-lighting.html",
  "/tr/isik-cizgileri.html": "/en/linear-lighting.html",
  "/trekovoe-osveshchenie.html": "/en/track-lighting.html",
  "/tr/ray-aydinlatma.html": "/en/track-lighting.html",
};

if (pageLanguage !== "en") {
  const englishTarget = englishPairs[currentPath];
  const headerRow = document.querySelector(".site-header .header-row");
  if (englishTarget && headerRow && !headerRow.querySelector('[hreflang="en"]')) {
    const englishLink = document.createElement("a");
    englishLink.className = "text-link language-switch";
    englishLink.href = englishTarget;
    englishLink.hreflang = "en";
    englishLink.setAttribute("aria-label", "English version");
    englishLink.textContent = "EN";
    headerRow.append(englishLink);
  }
}

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
    if (!image) return;
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
