(function () {
  const grid = document.getElementById('sketch-grid');
  const lightbox = document.getElementById('video-lightbox');
  const vlbVideo = document.getElementById('vlb-video');
  const vlbClose = document.getElementById('vlb-close');

  function openLightbox(card) {
    const src = card.dataset.src;
    const poster = card.dataset.poster;
    vlbVideo.poster = poster;
    vlbVideo.loop = card.dataset.loop === 'true';
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
    // Attempt play immediately (covers the common case), and again once the
    // browser signals it's actually ready — calling play() right after load()
    // can otherwise get silently interrupted on a busy first page load.
    vlbVideo.play().catch(() => {});
    vlbVideo.oncanplay = () => { vlbVideo.play().catch(() => {}); };
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

  // Deep link: ?play=<slug> auto-opens and plays that card.
  // Muted so autoplay isn't blocked by the browser on page load; viewer can unmute via controls.
  const playSlug = new URLSearchParams(location.search).get('play');
  if (playSlug) {
    const target = grid.querySelector('[data-slug="' + playSlug + '"]');
    if (target) {
      vlbVideo.muted = true;
      openLightbox(target);
    }
  }
})();
