(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () {
    (m[i].a = m[i].a || []).push(arguments)
  };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) {
      return;
    }
  }
  k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=104430694', 'ym');

ym(104430694, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  accurateTrackBounce: true,
  trackLinks: true
});


// Conversion events contain no form contents or other personal information.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || typeof window.ym !== "function") return;
  const href = link.getAttribute("href");
  const goal = href.startsWith("tel:") ? "phone_click"
    : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? "whatsapp_click" : null;
  if (goal) window.ym(104430694, "reachGoal", goal, { language: document.documentElement.lang || "ru" });
});
