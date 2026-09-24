"use strict";

const currentPath = window.location.pathname;
const isTurkish = currentPath.startsWith("/tr/");

// Use only the original logo image in the header and make it more prominent.
function normalizeHeaderLogo() {
  const brand = document.querySelector(".site-header .brand");
  if (!brand) return;

  brand.querySelector(":scope > span")?.remove();
  brand.style.gap = "0";

  const logo = brand.querySelector("img");
  if (!logo) return;

  logo.alt = isTurkish
    ? "Antalya Stretch Ceiling — Antalya gergi tavan"
    : "Antalya Stretch Ceiling — натяжные потолки в Анталии";

  const applyLogoSize = () => {
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    logo.style.width = "auto";
    logo.style.height = mobile ? "58px" : "84px";
    logo.style.maxWidth = mobile ? "160px" : "220px";
    logo.style.objectFit = "contain";
  };

  applyLogoSize();
  window.addEventListener("resize", applyLogoSize, { passive: true });
}

normalizeHeaderLogo();

// Keep the public brand name consistent in rendered metadata.
document.title = document.title.replaceAll("Antalya Potolok", "Antalya Stretch Ceiling");
document.querySelectorAll('meta[content*="Antalya Potolok"]').forEach((meta) => {
  meta.content = meta.content.replaceAll("Antalya Potolok", "Antalya Stretch Ceiling");
});

// Keep one navigation model inside each language version.
const primaryNav = document.querySelector(".site-header nav");
if (primaryNav) {
  const items = isTurkish
    ? [
        ["/tr/gergi-tavan.html", "Çözümler"],
        ["/tr/projeler.html", "Projeler"],
        ["/tr/fiyatlar.html", "Fiyatlar"],
        ["/tr/yorumlar.html", "Yorumlar"],
        ["/tr/hakkimizda.html", "Hakkımızda"],
        ["/tr/iletisim.html", "İletişim"],
      ]
    : [
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

// Add the matching language version when the page does not already contain a switch.
const languagePairs = {
  "/potolki.html": "/tr/gergi-tavan.html",
  "/rphotos.html": "/tr/projeler.html",
  "/ceny.html": "/tr/fiyatlar.html",
  "/otzyvy.html": "/tr/yorumlar.html",
  "/company.html": "/tr/hakkimizda.html",
  "/kontakty.html": "/tr/iletisim.html",
  "/tenevoj-potolok.html": "/tr/golge-profil-gergi-tavan.html",
  "/paryashchiy-potolok.html": "/tr/ledli-gergi-tavan.html",
  "/svetovye-linii.html": "/tr/isik-cizgileri.html",
  "/trekovoe-osveshchenie.html": "/tr/ray-aydinlatma.html",
  "/tr/gergi-tavan.html": "/potolki.html",
  "/tr/projeler.html": "/rphotos.html",
  "/tr/fiyatlar.html": "/ceny.html",
  "/tr/yorumlar.html": "/otzyvy.html",
  "/tr/hakkimizda.html": "/company.html",
  "/tr/iletisim.html": "/kontakty.html",
  "/tr/golge-profil-gergi-tavan.html": "/tenevoj-potolok.html",
  "/tr/ledli-gergi-tavan.html": "/paryashchiy-potolok.html",
  "/tr/isik-cizgileri.html": "/svetovye-linii.html",
  "/tr/ray-aydinlatma.html": "/trekovoe-osveshchenie.html",
};
const headerRow = document.querySelector(".site-header .header-row");
if (headerRow && !headerRow.querySelector(":scope > a.text-link")) {
  const switchLink = document.createElement("a");
  switchLink.className = "text-link";
  switchLink.href = languagePairs[currentPath] || (isTurkish ? "/" : "/tr/");
  switchLink.hreflang = isTurkish ? "ru" : "tr";
  switchLink.textContent = isTurkish ? "RU" : "TR";
  headerRow.append(switchLink);
}

// Give the Russian catalogue clear internal links to dedicated commercial pages.
if (!isTurkish) {
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
