(function () {
  const PAGE_COUNT = 30;
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  let current = 0;

  function pad(n) { return String(n).padStart(2, '0'); }

  for (let i = 1; i <= PAGE_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'thumb';
    el.dataset.index = i - 1;
    el.innerHTML =
      '<img loading="lazy" src="thumbs/page-' + pad(i) + '.jpg" alt="Portfolio page ' + i + '">' +
      '<span class="page-num">' + i + ' / ' + PAGE_COUNT + '</span>';
    el.addEventListener('click', () => openLightbox(i - 1));
    gallery.appendChild(el);
  }

  function openLightbox(index) {
    current = index;
    updateImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateImage() {
    const n = current + 1;
    lbImage.src = 'images/page-' + pad(n) + '.jpg';
    lbImage.alt = 'Portfolio page ' + n;
    lbCounter.textContent = n + ' / ' + PAGE_COUNT;
  }

  function showPrev() {
    current = (current - 1 + PAGE_COUNT) % PAGE_COUNT;
    updateImage();
  }

  function showNext() {
    current = (current + 1) % PAGE_COUNT;
    updateImage();
  }

  // Hero slideshow
  const slideStage = document.querySelector('.slideshow-stage');
  const slideImage = document.getElementById('slideshow-image');
  const slidePrev = document.getElementById('slide-prev');
  const slideNext = document.getElementById('slide-next');
  const slideDots = document.getElementById('slide-dots');
  const SLIDE_INTERVAL = 4500;
  let slideIndex = 0;
  let slideTimer = null;

  for (let i = 0; i < PAGE_COUNT; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
      restartSlideTimer();
    });
    slideDots.appendChild(dot);
  }

  function updateSlide() {
    const n = slideIndex + 1;
    slideImage.src = 'images/page-' + pad(n) + '.jpg';
    slideImage.alt = 'Portfolio page ' + n;
    [...slideDots.children].forEach((d, i) => d.classList.toggle('active', i === slideIndex));
  }

  function goToSlide(i) {
    slideIndex = (i + PAGE_COUNT) % PAGE_COUNT;
    updateSlide();
  }

  function startSlideTimer() {
    slideTimer = setInterval(() => goToSlide(slideIndex + 1), SLIDE_INTERVAL);
  }

  function restartSlideTimer() {
    clearInterval(slideTimer);
    startSlideTimer();
  }

  slidePrev.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(slideIndex - 1); restartSlideTimer(); });
  slideNext.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(slideIndex + 1); restartSlideTimer(); });
  slideStage.addEventListener('click', () => openLightbox(slideIndex));
  slideStage.addEventListener('mouseenter', () => clearInterval(slideTimer));
  slideStage.addEventListener('mouseleave', startSlideTimer);

  startSlideTimer();

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // basic touch swipe
  let touchStartX = null;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  lightbox.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? showPrev() : showNext();
    }
    touchStartX = null;
  });
})();
