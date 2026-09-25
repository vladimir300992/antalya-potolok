"use strict";
// A starting-rate calculation, not a quote or a fabricated budget range.
(() => {
  const form = document.getElementById("estimate-form");
  if (!form) return;
  const tr = document.documentElement.lang === "tr";
  const locale = tr ? "tr-TR" : "ru-RU";
  const result = document.getElementById("estimate-result");
  const field = (name) => form.elements.namedItem(name);
  const number = (value) => Number(value.replace(",", "."));
  function parseArea(value) {
    const text = String(value).trim().toLowerCase();
    // Only accept one total or one room. Never silently take the first of several areas.
    const total = text.match(
      /^(\d+(?:[.,]\d+)?)\s*(?:м²|м2|m²|m2|кв\.?\s*м\.?)?$/u,
    );
    if (total) return number(total[1]);
    const room = text.match(
      /^(\d+(?:[.,]\d+)?)\s*(?:м|m)?\s*[xх×]\s*(\d+(?:[.,]\d+)?)\s*(?:м|m)?$/u,
    );
    return room ? number(room[1]) * number(room[2]) : null;
  }
  function calculate() {
    const area = parseArea(field("dimensions").value);
    const rates = { standard: 30, shadow: 45, floating: 60 };
    let rate = rates[field("ceiling").value];
    if (!rate || !Number.isFinite(area) || area <= 0 || area > 10000)
      return null;
    if (field("spaceType").value === "mixed") return null;
    if (field("spaceType").value === "bathroom") rate = Math.max(rate, 50);
    return { area, rate, total: Math.ceil(area * rate) };
  }
  function message(estimate) {
    if (field("spaceType").value === "mixed")
      return tr
        ? "Banyo ve diğer odalar farklı başlangıç fiyatlarına sahiptir. Alanları ayrı yazın; bu toplam için tek rakam göstermiyoruz. Ayrıntılı ön fiyatı WhatsApp'ta hazırlayalım."
        : "Для ванных и других комнат действуют разные стартовые ставки. Укажите их площади отдельно в комментарии — подготовим предварительную смету в переписке. Единую сумму по общей площади не показываем.";
    if (!estimate)
      return tr
        ? "Tavan tipini seçin ve tek bir toplam alan (35 m²) veya bir odanın ölçüsünü (5×6 m) yazın. Birden fazla oda varsa alanları toplayın veya açıklamaya ayrı ayrı yazın."
        : "Выберите тип потолка и укажите одну общую площадь (35 м²) или размеры одной комнаты (5×6 м). Для нескольких комнат укажите сумму площадей либо перечислите размеры в комментарии.";
    const amount = estimate.total.toLocaleString(locale);
    const area = estimate.area.toLocaleString(locale, {
      maximumFractionDigits: 2,
    });
    return tr
      ? `Başlangıç fiyatına göre: ${amount} $ seviyesinden (${area} m² × ${estimate.rate} $/m²). Bu, nihai teklif veya bütçe aralığı değildir. Çevre, köşeler, nişler ve aydınlatma bu hesapta ayrıca fiyatlandırılmadı; toplamı artırabilir. Ayrıntılar ve keşif sonrası yazılı teklif hazırlanır.`
      : `По стартовой ставке: от ${amount} $ (${area} м² × ${estimate.rate} $/м²). Это не смета и не диапазон бюджета. Периметр, углы, ниши и освещение здесь отдельно не рассчитываются и могут увеличить итог. Состав и полную стоимость фиксируем в смете после уточнения деталей и замера.`;
  }
  function render() {
    result.textContent = message(calculate());
  }
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const labels = tr
      ? {
          district: "Bölge",
          rooms: "Mekanlar",
          spaceType: "Alan türü",
          dimensions: "Alan / ölçüler",
          ceiling: "Tavan tipi",
          perimeter: "Çevre, m",
          corners: "Köşe sayısı",
          niche: "Perde nişi, m",
          spots: "Spot sayısı",
          track: "Ray uzunluğu, m",
          lines: "Işık çizgileri, m",
          details: "Detaylar ve aydınlatma",
        }
      : {
          district: "Район",
          rooms: "Помещения",
          spaceType: "Категория помещений",
          dimensions: "Площадь / размеры",
          ceiling: "Тип потолка",
          perimeter: "Периметр, м",
          corners: "Количество углов",
          niche: "Длина ниши, м",
          spots: "Количество спотов",
          track: "Длина трека, м",
          lines: "Световые линии, м",
          details: "Детали и освещение",
        };
    const lines = [
      tr
        ? "Merhaba! Gergi tavan için ön fiyat almak istiyorum."
        : "Здравствуйте! Хочу предварительный расчёт потолка.",
    ];
    Object.entries(labels).forEach(([name, label]) => {
      const element = field(name);
      const value = (
        element.selectedOptions
          ? element.selectedOptions[0].textContent
          : element.value
      ).trim();
      if (value) lines.push(`${label}: ${value}`);
    });
    lines.push(message(calculate()));
    window.location.assign(
      `https://wa.me/905348287110?text=${encodeURIComponent(lines.join("\n"))}`,
    );
  });
})();
