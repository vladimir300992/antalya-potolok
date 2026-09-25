"use strict";

const pageLanguage = document.documentElement.lang || "ru";
const filters = document.querySelector(".filters");
const projects = [...document.querySelectorAll("[data-room]")];

if (filters && projects.length) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filters
      .querySelectorAll("button")
      .forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
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

// RU and TR homepages already contain the reciprocal switch in static HTML.
// Add English as the third visible language without duplicating it on /en/.
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
