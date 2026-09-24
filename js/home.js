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
  const dimensionsInput = form.querySelector('[name="dimensions"]');
  const ceilingSelect = form.querySelector('[name="ceiling"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const estimateResult = document.createElement("p");
  estimateResult.className = "price-note";
  estimateResult.setAttribute("aria-live", "polite");
  estimateResult.hidden = true;
  submitButton?.insertAdjacentElement("beforebegin", estimateResult);

  const parseArea = (value) => {
    const text = String(value || "").trim().toLowerCase();
    if (!text) return null;

    const explicitArea = text.match(
      /(\d+(?:[.,]\d+)?)\s*(?:м²|м2|m²|m2|кв\.?\s*м)/i,
    );
    if (explicitArea) return Number(explicitArea[1].replace(",", "."));

    const plainNumber = text.match(/^(\d+(?:[.,]\d+)?)$/);
    if (plainNumber) return Number(plainNumber[1].replace(",", "."));

    const singleRoom = text.match(
      /^(\d+(?:[.,]\d+)?)\s*(?:x|х|×)\s*(\d+(?:[.,]\d+)?)\s*(?:м)?$/i,
    );
    if (singleRoom) {
      return (
        Number(singleRoom[1].replace(",", ".")) *
        Number(singleRoom[2].replace(",", "."))
      );
    }

    return null;
  };

  const getRate = (ceiling) => {
    if (ceiling === "Теневой") return 45;
    if (ceiling === "Парящий с LED-подсветкой") return 60;
    return 30;
  };

  const getEstimate = () => {
    const area = parseArea(dimensionsInput?.value);
    if (!area || area <= 0 || area > 10000) return null;
    const ceiling = ceilingSelect?.value || "Пока не определился";
    const rate = getRate(ceiling);
    return {
      area,
      rate,
      total: Math.round(area * rate),
      isBase: ceiling === "Пока не определился",
    };
  };

  const renderEstimate = () => {
    const estimate = getEstimate();
    if (!estimate) {
      estimateResult.hidden = false;
      estimateResult.textContent =
        "Укажите общую площадь в м² (например, 35 м²), чтобы увидеть стартовый ориентир.";
      return;
    }

    estimateResult.hidden = false;
    estimateResult.innerHTML = estimate.isBase
      ? `<strong>Стартовый ориентир: от ${estimate.total.toLocaleString("ru-RU")} $</strong> для базовой комплектации (${estimate.area.toLocaleString("ru-RU")} м² × ${estimate.rate} $/м²). Тип потолка, периметр, ниши и освещение уточняются отдельно.`
      : `<strong>Стартовый ориентир: от ${estimate.total.toLocaleString("ru-RU")} $</strong> (${estimate.area.toLocaleString("ru-RU")} м² × ${estimate.rate} $/м²). Это не итоговая смета: периметр, ниши, освещение и сложные узлы считаются отдельно.`;
  };

  dimensionsInput?.addEventListener("input", renderEstimate);
  ceilingSelect?.addEventListener("change", renderEstimate);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const estimate = getEstimate();
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
      ...(estimate
        ? [
            `Стартовый ориентир на сайте: от ${estimate.total} $ (${estimate.area} м² × ${estimate.rate} $/м²), не итоговая смета.`,
          ]
        : []),
    ].join("\n");
    window.location.assign(
      `https://wa.me/905348287110?text=${encodeURIComponent(text)}`,
    );
  });
}
