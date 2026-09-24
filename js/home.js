"use strict";
// Progressive enhancement: project links, prices, reviews and FAQ work without JS.

// Use only the original logo image in the header and make it more prominent.
function normalizeHeaderLogo() {
  const brand = document.querySelector(".site-header .brand");
  if (!brand) return;

  brand.querySelector(":scope > span")?.remove();
  brand.style.gap = "0";

  const logo = brand.querySelector("img");
  if (!logo) return;

  logo.alt = "Antalya Stretch Ceiling";

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

// Use one navigation model across the site: main sections open dedicated pages.
const primaryNav = document.querySelector(".site-header nav");
if (primaryNav) {
  primaryNav.innerHTML = [
    ["/potolki.html", "Решения"],
    ["/rphotos.html", "Работы"],
    ["/ceny.html", "Цены"],
    ["/otzyvy.html", "Отзывы"],
    ["/company.html", "О нас"],
    ["/kontakty.html", "Контакты"],
  ]
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");
}

// Language switch for the Turkish version.
const headerRow = document.querySelector(".site-header .header-row");
if (headerRow && !headerRow.querySelector(":scope > a.text-link")) {
  const languageLink = document.createElement("a");
  languageLink.className = "text-link";
  languageLink.href = "/tr/";
  languageLink.hreflang = "tr";
  languageLink.textContent = "TR";
  headerRow.append(languageLink);
}

// Send high-intent solution clicks to dedicated commercial landing pages.
const solutionLinkMap = {
  "potolki.html#shadow-profile": "/tenevoj-potolok.html",
  "potolki.html#floating": "/paryashchiy-potolok.html",
  "potolki.html#light-lines": "/svetovye-linii.html",
  "potolki.html#track": "/trekovoe-osveshchenie.html",
};
document.querySelectorAll(".solution-card").forEach((card) => {
  const href = card.getAttribute("href");
  if (solutionLinkMap[href]) card.setAttribute("href", solutionLinkMap[href]);
});

// Preserve the visual line break while ensuring a literal word separator in rendered text.
const heroTitle = document.querySelector(".hero h1");
if (heroTitle) heroTitle.innerHTML = "Натяжные потолки <br />в Анталии";

// Replace a decorative technology strip with concrete trust signals.
const trustStrip = document.querySelector(".intro-strip .wrap");
if (trustStrip) {
  trustStrip.innerHTML = [
    "Полотна BAUF",
    "Гарантия 2 года",
    "Прозрачная смета",
    "Потолок + освещение",
  ]
    .map((item) => `<span>${item}</span>`)
    .join("");
}

// Enrich existing LocalBusiness data with verified opening hours and price range.
const businessSchema = document.querySelector('script[type="application/ld+json"]');
if (businessSchema) {
  try {
    const data = JSON.parse(businessSchema.textContent);
    if (data?.["@id"] === "https://antalya-potolok.com/#business") {
      data.priceRange = "30-60+ USD/m²";
      data.openingHoursSpecification = [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "16:00",
        },
      ];
      businessSchema.textContent = JSON.stringify(data);
    }
  } catch (error) {
    console.warn("Не удалось дополнить JSON-LD:", error);
  }
}

// Softer measurement wording: the visit fee is fully credited toward the order.
const terms = [...document.querySelectorAll(".terms p")];
const measurementTerm = terms.find((item) =>
  item.textContent.includes("Условия замера"),
);
if (measurementTerm) {
  measurementTerm.innerHTML =
    "<strong>Условия замера</strong><br />Выезд в Анталии — 1 000 TRY, полностью засчитываем в аванс по заказу. При внесении аванса на замере выезд бесплатный. За пределами города — дополнительно 1 000 TRY за каждые 50 км.";
}

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
