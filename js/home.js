"use strict";
// Progressive enhancement: project links, prices, reviews and FAQ work without JS.
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
    document.querySelector(".project-status").textContent =
      `Показано проектов: ${projects.filter((card) => !card.hidden).length}`;
  });
}
const form = document.getElementById("estimate-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = [
      ["district", "Район"],
      ["rooms", "Помещения"],
      ["dimensions", "Площадь / размеры"],
      ["ceiling", "Тип потолка"],
      ["details", "Детали и освещение"],
    ];
    const text = [
      "Здравствуйте! Хочу предварительный расчёт потолка.",
      ...fields.map(
        ([key, label]) =>
          `${label}: ${String(data.get(key) || "").trim() || "Уточним в переписке"}`,
      ),
    ].join("\n");
    window.location.assign(
      `https://wa.me/905348287110?text=${encodeURIComponent(text)}`,
    );
  });
}
