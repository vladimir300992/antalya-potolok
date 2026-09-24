"use strict";

// Use only the original logo image in the header and make it more prominent.
function normalizeHeaderLogo() {
  const brand = document.querySelector(".site-header .brand");
  if (!brand) return;

  brand.querySelector(":scope > span")?.remove();
  brand.style.gap = "0";

  const logo = brand.querySelector("img");
  if (!logo) return;

  logo.alt = "Antalya Stretch Ceiling — Antalya gergi tavan";

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

document.title = document.title.replaceAll("Antalya Potolok", "Antalya Stretch Ceiling");
document.querySelectorAll('meta[content*="Antalya Potolok"]').forEach((meta) => {
  meta.content = meta.content.replaceAll("Antalya Potolok", "Antalya Stretch Ceiling");
});

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
    const status = document.querySelector(".project-status");
    if (status) {
      status.textContent = `Gösterilen proje: ${projects.filter((card) => !card.hidden).length}`;
    }
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
    const explicitArea = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2)/i);
    if (explicitArea) return Number(explicitArea[1].replace(",", "."));
    const plainNumber = text.match(/^(\d+(?:[.,]\d+)?)$/);
    if (plainNumber) return Number(plainNumber[1].replace(",", "."));
    const singleRoom = text.match(
      /^(\d+(?:[.,]\d+)?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*(?:m)?$/i,
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
    if (ceiling === "Gölge profilli") return 45;
    if (ceiling === "LED'li çevre aydınlatmalı") return 60;
    return 30;
  };

  const getEstimate = () => {
    const area = parseArea(dimensionsInput?.value);
    if (!area || area <= 0 || area > 10000) return null;
    const ceiling = ceilingSelect?.value || "Henüz karar vermedim";
    const rate = getRate(ceiling);
    return {
      area,
      rate,
      total: Math.round(area * rate),
      isBase: ceiling === "Henüz karar vermedim",
    };
  };

  const renderEstimate = () => {
    const estimate = getEstimate();
    estimateResult.hidden = false;
    if (!estimate) {
      estimateResult.textContent =
        "Minimum başlangıç tutarını görmek için toplam alanı m² olarak yazın. Örnek: 35 m².";
      return;
    }
    estimateResult.innerHTML = `<strong>Minimum başlangıç tutarı: ${estimate.total.toLocaleString("tr-TR")} $ seviyesinden</strong> (${estimate.area.toLocaleString("tr-TR")} m² × ${estimate.rate} $/m²). Bu yalnızca alan ve seçilen tavan tipine göre alt sınırdır. Çevre, köşeler, perde nişi, spot, avize, ray, ışık çizgileri ve özel detaylar ayrıca hesaplanır.`;
  };

  dimensionsInput?.addEventListener("input", renderEstimate);
  ceilingSelect?.addEventListener("change", renderEstimate);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const estimate = getEstimate();
    const fields = [
      ["district", "Bölge"],
      ["rooms", "Mekanlar"],
      ["dimensions", "Alan / ölçüler"],
      ["ceiling", "Tavan tipi"],
      ["details", "Detaylar ve aydınlatma"],
    ];
    const text = [
      "Merhaba! Gergi tavan için ön fiyat almak istiyorum.",
      ...fields.map(
        ([key, label]) =>
          `${label}: ${String(data.get(key) || "").trim() || "WhatsApp'ta netleştirelim"}`,
      ),
      ...(estimate
        ? [
            `Sitedeki minimum başlangıç tutarı: ${estimate.total} $ seviyesinden (${estimate.area} m² × ${estimate.rate} $/m²). Çevre, nişler ve aydınlatma bu tutara dahil değildir.`,
          ]
        : []),
    ].join("\n");
    window.location.assign(
      `https://wa.me/905348287110?text=${encodeURIComponent(text)}`,
    );
  });
}
