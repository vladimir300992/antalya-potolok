"use strict";

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
    ru: { call: "Позвонить", estimate: "Рассчитать потолок ↗" },
    tr: { call: "Ara", estimate: "Ön fiyat ↗" },
    en: { call: "Call", estimate: "Get estimate ↗" },
  };
  const copy = labels[pageLanguage] || labels.ru;
  const cta = document.createElement("div");
  cta.className = "mobile-cta";
  cta.innerHTML = `<a href="tel:+905348287110">${copy.call}</a><a href="#calculatorSection">${copy.estimate}</a>`;
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

const filters = document.querySelector(".filters");
const projects = [...document.querySelectorAll("[data-room]")];
if (filters && projects.length) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filters
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    projects.forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.room !== button.dataset.filter;
    });
    const labels = {
      ru: "Показано проектов",
      tr: "Gösterilen proje",
      en: "Projects shown",
    };
    const status = document.querySelector(".project-status");
    if (status) {
      status.textContent = `${labels[pageLanguage] || labels.ru}: ${projects.filter((card) => !card.hidden).length}`;
    }
  });
}

// RU and TR homepages already contain reciprocal language links in HTML.
// Add English as the third language without duplicating it on /en/.
if (pageLanguage !== "en") {
  const headerRow = document.querySelector(".site-header .header-row");
  if (headerRow && !headerRow.querySelector('[hreflang="en"]')) {
    const englishLink = document.createElement("a");
    englishLink.className = "text-link language-switch";
    englishLink.href = "/en/";
    englishLink.hreflang = "en";
    englishLink.setAttribute("aria-label", "English version");
    englishLink.textContent = "EN";
    headerRow.append(englishLink);
  }
}

enhanceHeader();
ensureMobileCta();

// Animate native details; keyboard activation and no-JS fallback stay native.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.package-card').forEach((card) => {
  const summary = card.querySelector('summary');
  const panel = card.querySelector('.package-content');
  let animation;
  let expanded = card.open;
  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const height = card.open ? panel.getBoundingClientRect().height : 0;
    animation?.cancel();
    expanded = !expanded;
    if (reducedMotion.matches || !panel.animate) {
      card.open = expanded;
      return;
    }
    card.open = true;
    animation = panel.animate(
      [{ height: `${height}px`, opacity: height ? 1 : 0 },
       { height: expanded ? `${panel.scrollHeight}px` : '0px', opacity: expanded ? 1 : 0 }],
      { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
    animation.onfinish = () => { card.open = expanded; animation = null; };
  });
});

// The selected package carries through to the existing estimate form.
document.querySelectorAll('[data-package], [data-room-estimate]').forEach((link) => {
  link.addEventListener('click', () => {
    const form = document.getElementById('estimate-form');
    if (!form) return;
    const ceiling = form.elements.namedItem('ceiling');
    const room = form.elements.namedItem('spaceType');
    if (link.dataset.package) ceiling.value = link.dataset.package;
    if (link.dataset.roomEstimate) {
      room.value = link.dataset.roomEstimate;
      if (!ceiling.value) ceiling.value = 'standard';
    }
    form.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

// Owner-supplied total, rendered in HTML as well as in the animation.
const projectCounter = document.querySelector('[data-count]');
if (projectCounter && !reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    const total = Number(projectCounter.dataset.count);
    projectCounter.setAttribute('aria-label', String(total));
    const start = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - start) / 1000, 1);
      projectCounter.textContent = String(Math.round(total * (1 - (1 - progress) ** 3)));
      if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(frame);
      else projectCounter.textContent = String(total);
    };
    requestAnimationFrame(frame);
  }, { threshold: .5 });
  observer.observe(projectCounter);
}
