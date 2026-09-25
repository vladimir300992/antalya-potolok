"use strict";

const currentPath = window.location.pathname;
const pageLanguage = document.documentElement.lang || "ru";

function loadVisualFixes() {
  if (document.querySelector('link[href="/css/visual-fixes.css"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/visual-fixes.css";
  document.head.append(link);
}

function ensureMobileCta() {
  if (document.querySelector(".mobile-cta")) return;
  const labels = {
    ru: { call: "Позвонить", estimate: "Рассчитать потолок ↗", href: "/#calculatorSection" },
    tr: { call: "Ara", estimate: "Ön fiyat ↗", href: "/tr/#calculatorSection" },
    en: { call: "Call", estimate: "Get estimate ↗", href: "/en/#calculatorSection" },
  };
  const copy = labels[pageLanguage] || labels.ru;
  const cta = document.createElement("div");
  cta.className = "mobile-cta";
  cta.innerHTML = `<a href="tel:+905348287110">${copy.call}</a><a href="${copy.href}">${copy.estimate}</a>`;
  document.body.append(cta);
}

function enhanceHeader() {
  const header = document.querySelector(".site-header");
  const headerRow = header?.querySelector(".header-row");
  const nav = header?.querySelector("nav");
  if (!header || !headerRow || !nav) return;

  const existingSwitches = [...headerRow.querySelectorAll(":scope > .language-switch")];
  const alternatives = new Map(
    existingSwitches.map((link) => [link.getAttribute("hreflang"), link]),
  );
  const firstSwitch = existingSwitches[0];
  if (firstSwitch) {
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("aria-label", "Language");
    headerRow.insertBefore(switcher, firstSwitch);
    ["ru", "tr", "en"].forEach((code) => {
      if (code === pageLanguage) {
        const current = document.createElement("span");
        current.className = "language-current";
        current.setAttribute("aria-current", "true");
        current.textContent = code.toUpperCase();
        switcher.append(current);
        return;
      }
      const link = alternatives.get(code);
      if (link) switcher.append(link);
    });
  }

  if (!nav.id) nav.id = "primary-navigation";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "menu-toggle";
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-expanded", "false");
  const labels = {
    ru: "Открыть меню",
    tr: "Menüyü aç",
    en: "Open menu",
  };
  toggle.setAttribute("aria-label", labels[pageLanguage] || labels.ru);
  toggle.innerHTML = "<span></span><span></span><span></span>";
  headerRow.append(toggle);

  const closeMenu = () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = !header.classList.contains("menu-open");
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1150) closeMenu();
  });
}

loadVisualFixes();

// Add English as the third visible language on existing RU/TR pages.
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

enhanceHeader();
ensureMobileCta();

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
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
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
