"use strict";
// A starting-rate calculation, not a quote or a fabricated budget range.
(() => {
  const form = document.getElementById("estimate-form");
  if (!form) return;

  const lang = document.documentElement.lang || "ru";
  const locale = lang === "tr" ? "tr-TR" : lang === "en" ? "en-US" : "ru-RU";
  const result = document.getElementById("estimate-result");
  const field = (name) => form.elements.namedItem(name);
  const number = (value) => Number(value.replace(",", "."));

  function parseArea(value) {
    const text = String(value).trim().toLowerCase();
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
    if (!field("spaceType").value || !rate || !Number.isFinite(area) || area <= 0 || area > 10000) return null;
    if (field("spaceType").value === "mixed") return null;
    if (field("spaceType").value === "bathroom") rate = Math.max(rate, 50);
    return { area, rate, total: Math.ceil(area * rate) };
  }

  function message(estimate) {
    if (field("spaceType").value === "mixed") {
      if (lang === "tr")
        return "Banyo ve diğer odalar farklı başlangıç fiyatlarına sahiptir. Alanları ayrı yazın; bu toplam için tek rakam göstermiyoruz. Ayrıntılı ön fiyatı WhatsApp'ta hazırlayalım.";
      if (lang === "en")
        return "Bathrooms and other rooms use different starting rates. List their areas separately in the comments; we do not show one combined number for a mixed total. We can prepare the detailed preliminary estimate in WhatsApp.";
      return "Для ванных и других комнат действуют разные стартовые ставки. Укажите их площади отдельно в комментарии — подготовим предварительную смету в переписке. Единую сумму по общей площади не показываем.";
    }

    if (!estimate) {
      if (lang === "tr")
        return "Tavan tipini seçin ve tek bir toplam alan (35 m²) veya bir odanın ölçüsünü (5×6 m) yazın. Birden fazla oda varsa alanları toplayın veya açıklamaya ayrı ayrı yazın.";
      if (lang === "en")
        return "Select a room category and ceiling type, then enter one total area (35 m²) or the dimensions of one room (5×6 m). For several rooms, enter the total area or list each room's dimensions in the comments.";
      return "Выберите тип потолка и укажите одну общую площадь (35 м²) или размеры одной комнаты (5×6 м). Для нескольких комнат укажите сумму площадей либо перечислите размеры в комментарии.";
    }

    const amount = estimate.total.toLocaleString(locale);
    const area = estimate.area.toLocaleString(locale, { maximumFractionDigits: 2 });
    if (lang === "tr")
      return `Başlangıç fiyatına göre: ${amount} $ seviyesinden (${area} m² × ${estimate.rate} $/m²). Bu, nihai teklif veya bütçe aralığı değildir. Çevre, köşeler, nişler ve aydınlatma bu hesapta ayrıca fiyatlandırılmadı; toplamı artırabilir. Ayrıntılar ve keşif sonrası yazılı teklif hazırlanır.`;
    if (lang === "en")
      return `At the starting rate: from $${amount} (${area} m² × $${estimate.rate}/m²). All dollar prices are in USD. This is not a final quote or budget range. Perimeter, corners, curtain recesses and lighting have not been priced separately here and may increase the total. We confirm the full scope and price in a written quote after discussing the details and measuring the space.`;
    return `По стартовой ставке: от ${amount} $ (${area} м² × ${estimate.rate} $/м²). Это не смета и не диапазон бюджета. Периметр, углы, ниши и освещение здесь отдельно не рассчитываются и могут увеличить итог. Состав и полную стоимость фиксируем в смете после уточнения деталей и замера.`;
  }

  function track(goal) {
    if (typeof window.ym === "function") window.ym(104430694, "reachGoal", goal, { language: lang });
  }
  let started = false;
  let resultTracked = false;
  function render(event) {
    const estimate = calculate();
    result.textContent = message(estimate);
    if (!event) return;
    if (!started) { track("estimate_start"); started = true; }
    if (estimate && !resultTracked) { track("estimate_result"); resultTracked = true; }
  }

  const params = new URLSearchParams(window.location.search);
  const packageType = params.get("ceiling");
  const service = params.get("service");
  if (["standard", "shadow", "floating"].includes(packageType)) field("ceiling").value = packageType;
  if (["shadow", "floating"].includes(service)) field("ceiling").value = service;
  const serviceLabels = {
    ru: { lines: "Интересуют световые линии.", track: "Интересует трековое освещение." },
    en: { lines: "I am interested in linear lighting.", track: "I am interested in track lighting." },
    tr: { lines: "Işık çizgileri ile ilgileniyorum.", track: "Ray aydınlatma ile ilgileniyorum." },
  };
  if (serviceLabels[lang]?.[service] && !field("details").value) field("details").value = serviceLabels[lang][service];
  render();

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const labelsByLanguage = {
      ru: {
        district: "Район", rooms: "Помещения", spaceType: "Категория помещений",
        dimensions: "Площадь / размеры", ceiling: "Тип потолка", perimeter: "Периметр, м",
        corners: "Количество углов", niche: "Длина ниши, м", spots: "Количество спотов",
        track: "Длина трека, м", lines: "Световые линии, м", details: "Детали и освещение",
      },
      tr: {
        district: "Bölge", rooms: "Mekanlar", spaceType: "Alan türü",
        dimensions: "Alan / ölçüler", ceiling: "Tavan tipi", perimeter: "Çevre, m",
        corners: "Köşe sayısı", niche: "Perde nişi, m", spots: "Spot sayısı",
        track: "Ray uzunluğu, m", lines: "Işık çizgileri, m", details: "Detaylar ve aydınlatma",
      },
      en: {
        district: "District / area", rooms: "Rooms", spaceType: "Room category",
        dimensions: "Area / dimensions", ceiling: "Ceiling type", perimeter: "Perimeter, m",
        corners: "Number of corners", niche: "Curtain niche, m", spots: "Spotlights",
        track: "Track length, m", lines: "Linear lighting, m", details: "Details and lighting",
      },
    };
    const labels = labelsByLanguage[lang] || labelsByLanguage.ru;
    const greetings = {
      ru: "Здравствуйте! Хочу предварительный расчёт потолка.",
      tr: "Merhaba! Gergi tavan için ön fiyat almak istiyorum.",
      en: "Hello! I would like a preliminary stretch ceiling estimate.",
    };
    const lines = [greetings[lang] || greetings.ru];

    Object.entries(labels).forEach(([name, label]) => {
      const element = field(name);
      const value = (element.selectedOptions ? element.selectedOptions[0].textContent : element.value).trim();
      if (value) lines.push(`${label}: ${value}`);
    });
    lines.push(message(calculate()));
    track("whatsapp_estimate");
    window.location.assign(
      `https://wa.me/905348287110?text=${encodeURIComponent(lines.join("\n"))}`,
    );
  });
})();
