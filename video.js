(function () {
  document.querySelectorAll('video').forEach(function (v) {
    // Hide the native download button in the controls bar.
    v.setAttribute('controlsList', 'nodownload noremoteplayback');
    v.setAttribute('disablePictureInPicture', '');
    // Block "Save video as..." from the right-click menu.
    v.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
})();
