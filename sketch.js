(function () {
  const grid = document.getElementById('sketch-grid');
  const lightbox = document.getElementById('video-lightbox');
  const vlbVideo = document.getElementById('vlb-video');
  const vlbClose = document.getElementById('vlb-close');

  function openLightbox(card) {
    const src = card.dataset.src;
    const poster = card.dataset.poster;
    vlbVideo.poster = poster;
    let source = vlbVideo.querySelector('source');
    if (!source) {
      source = document.createElement('source');
      vlbVideo.appendChild(source);
    }
    source.src = src;
    source.type = 'video/mp4';
    vlbVideo.load();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    vlbVideo.play().catch(() => {});
  }

  function closeLightbox() {
    vlbVideo.pause();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  grid.querySelectorAll('.sketch-card').forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
  });

  vlbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
  });
})();
