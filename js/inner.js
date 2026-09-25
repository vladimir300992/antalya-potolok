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

function addPortfolioPhoto(sectionId, src, alt, width, height) {
  const track = document.querySelector(`#${sectionId} .carousel-track`);
  if (!track || track.querySelector(`img[src="${src}"]`)) return;
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = width;
  image.height = height;
  track.append(image);
}

function addSuppliedPortfolioPhotos() {
  const projectPages = ["/rphotos.html", "/tr/projeler.html", "/en/projects.html"];
  if (!projectPages.includes(currentPath)) return;

  const livingId = pageLanguage === "tr" ? "salon" : "living";
  const bedroomId = pageLanguage === "tr" ? "yatak-odasi" : "bedroom";
  const alt = {
    ru: {
      lines: "Световая линия и трековое освещение на натяжном потолке",
      track: "Трековое освещение в интерьере с натяжным потолком",
      shadow: "Теневой натяжной потолок с подвесным светильником",
    },
    tr: {
      lines: "Gergi tavanda ışık çizgisi ve ray aydınlatma",
      track: "Gergi tavanlı iç mekanda ray aydınlatma",
      shadow: "Sarkıt aydınlatmalı gölge profilli gergi tavan",
    },
    en: {
      lines: "Linear light and track lighting integrated into a stretch ceiling",
      track: "Track lighting in an interior with a stretch ceiling",
      shadow: "Shadow-gap stretch ceiling with pendant light",
    },
  }[pageLanguage] || null;
  if (!alt) return;

  addPortfolioPhoto(livingId, "/img/projects/light-lines-track.webp", alt.lines, 653, 720);
  addPortfolioPhoto(livingId, "/img/projects/track-lighting-kitchen.webp", alt.track, 600, 400);
  addPortfolioPhoto(bedroomId, "/img/projects/shadow-ceiling-chandelier.webp", alt.shadow, 720, 540);
}

function replaceServicePhoto() {
  const groups = {
    shadow: [
      "/tenevoj-potolok.html",
      "/tr/golge-profil-gergi-tavan.html",
      "/en/shadow-gap-ceiling.html",
    ],
    lines: [
      "/svetovye-linii.html",
      "/tr/isik-cizgileri.html",
      "/en/linear-lighting.html",
    ],
    track: [
      "/trekovoe-osveshchenie.html",
      "/tr/ray-aydinlatma.html",
      "/en/track-lighting.html",
    ],
  };
  const type = Object.keys(groups).find((key) => groups[key].includes(currentPath));
  if (!type) return;
  const image = document.querySelector(".service-photo img");
  if (!image) return;

  const copy = {
    ru: {
      shadow: ["/img/projects/shadow-gap-detail.webp", "Реальный теневой зазор натяжного потолка у стены"],
      lines: ["/img/projects/linear-light-shadow.webp", "Реальная световая линия в натяжном потолке с теневым примыканием"],
      track: ["/img/projects/track-lighting-kitchen.webp", "Реальное трековое освещение с натяжным потолком в интерьере"],
    },
    tr: {
      shadow: ["/img/projects/shadow-gap-detail.webp", "Duvar kenarında gerçek gölge profilli gergi tavan detayı"],
      lines: ["/img/projects/linear-light-shadow.webp", "Gölge profilli gergi tavanda gerçek ışık çizgisi uygulaması"],
      track: ["/img/projects/track-lighting-kitchen.webp", "İç mekanda gerçek gergi tavan ve ray aydınlatma uygulaması"],
    },
    en: {
      shadow: ["/img/projects/shadow-gap-detail.webp", "Real shadow-gap stretch ceiling detail at the wall"],
      lines: ["/img/projects/linear-light-shadow.webp", "Real linear light installation in a shadow-gap stretch ceiling"],
      track: ["/img/projects/track-lighting-kitchen.webp", "Real track lighting installation with a stretch ceiling"],
    },
  }[pageLanguage] || null;
  if (!copy) return;
  const [src, alt] = copy[type];
  image.src = src;
  image.alt = alt;
  image.removeAttribute("srcset");
  image.decoding = "async";

  if (type === "shadow") {
    image.width = 900;
    image.height = 1200;
  } else if (type === "lines") {
    image.width = 768;
    image.height = 960;
  } else {
    image.width = 600;
    image.height = 400;
  }
}

loadVisualFixes();

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
addSuppliedPortfolioPhotos();
replaceServicePhoto();

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
      left: Number(button.dataset.slide) * (image.getBoundingClientRect().width + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  });
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});
