"use strict";
// A native dialog keeps the enlarged photos in their room's complete series.
(() => {
  const galleries = [...document.querySelectorAll('[data-room-gallery]')];
  if (!galleries.length) return;
  const lang = document.documentElement.lang || 'ru';
  const copy = {
    ru: { title: 'Фотографии наших работ', close: 'Закрыть', previous: 'Предыдущее фото', next: 'Следующее фото', of: 'из' },
    en: { title: 'Project photos', close: 'Close', previous: 'Previous photo', next: 'Next photo', of: 'of' },
    tr: { title: 'Uygulama fotoğrafları', close: 'Kapat', previous: 'Önceki fotoğraf', next: 'Sonraki fotoğraf', of: '/' },
  }[lang];
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-label', copy.title);
  dialog.innerHTML = `<div class="photo-viewer-toolbar"><p class="photo-viewer-count" aria-live="polite"></p><button type="button" data-close autofocus>${copy.close} ×</button></div><img class="photo-viewer-image" alt=""><p class="photo-viewer-caption"></p><div class="photo-viewer-nav"><button type="button" data-previous aria-label="${copy.previous}">←</button><button type="button" data-next aria-label="${copy.next}">→</button></div>`;
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const count = dialog.querySelector('.photo-viewer-count');
  const caption = dialog.querySelector('.photo-viewer-caption');
  let photos = [], position = 0, opener = null;
  function render() {
    const selected = photos[position].querySelector('img');
    image.src = photos[position].href;
    image.alt = selected.alt;
    count.textContent = `${position + 1} ${copy.of} ${photos.length}`;
    caption.textContent = selected.alt;
  }
  function move(delta) { position = (position + delta + photos.length) % photos.length; render(); }
  galleries.forEach(gallery => gallery.addEventListener('click', event => {
    const link = event.target.closest('.gallery-photo');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    photos = [...gallery.querySelectorAll('.gallery-photo')];
    position = photos.indexOf(link); opener = link;
    render(); dialog.showModal();
    document.documentElement.classList.add('photo-viewer-open');
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-previous]').addEventListener('click', () => move(-1));
  dialog.querySelector('[data-next]').addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('photo-viewer-open');
    opener?.focus({ preventScroll: true });
  });
})();
