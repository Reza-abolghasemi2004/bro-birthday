import { celebrate, reducedMotion } from './animations.js';

/** One delegated listener. All temporary celebration work is disposed on chapter exit. */
export function createInteractions() {
  let toastTimer;
  let sparkTimer;
  let clearSparks = () => {};
  const toast = document.getElementById('smile-message');
  const motionButton = document.getElementById('motion-toggle');

  function cleanup() {
    window.clearTimeout(toastTimer);
    window.clearTimeout(sparkTimer);
    clearSparks();
    clearSparks = () => {};
    toast.classList.remove('is-visible');
    toast.textContent = '';
  }

  function smile() {
    cleanup();
    toast.textContent = 'این یکی رو دیگه از ته دل بزن، داداش!';
    toast.classList.add('is-visible');
    clearSparks = celebrate(document.getElementById('story'));
    sparkTimer = window.setTimeout(clearSparks, 2100);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 5000);
  }

  function setMotion(paused) {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'فعال‌کردن حرکت‌های تزئینی' : 'توقف حرکت‌های تزئینی');
    motionButton.querySelector('span').textContent = paused ? 'حرکت‌ها متوقفن' : 'کمی آرام‌تر';
    motionButton.querySelector('svg').innerHTML = paused
      ? '<path d="m9 5 10 7-10 7V5Z" stroke="currentColor" stroke-width="1.3"/>'
      : '<path d="M8 6v12M16 6v12" stroke="currentColor" stroke-width="1.5"/>';
  }

  function bind(navigation) {
    try { setMotion(localStorage.getItem('brother29-pause') === 'true'); } catch { setMotion(false); }
    motionButton.addEventListener('click', () => {
      const paused = !document.body.classList.contains('motion-paused');
      setMotion(paused);
      try { localStorage.setItem('brother29-pause', String(paused)); } catch { /* Storage is optional. */ }
      if (reducedMotion()) clearSparks();
    });
    document.addEventListener('click', event => {
      if (event.target.closest('.brand')) event.preventDefault();
      if (document.getElementById('story').hasAttribute('aria-busy')) return;
      const chapter = event.target.closest('[data-chapter]');
      if (chapter) { navigation.goTo(Number(chapter.dataset.chapter)); return; }
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action === 'next') navigation.next();
      if (action === 'previous') navigation.previous();
      if (action === 'restart') navigation.restart();
      if (action === 'smile') smile();
      if (event.target.closest('.brand')) { event.preventDefault(); navigation.restart(); }
    });
    document.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
      if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      // RTL: move forward to the left, backward to the right.
      if (event.key === 'ArrowLeft') { event.preventDefault(); navigation.next(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); navigation.previous(); }
    });
    window.addEventListener('hashchange', navigation.fromHash);
    window.addEventListener('pagehide', cleanup);
  }
  return { bind, cleanup };
}
