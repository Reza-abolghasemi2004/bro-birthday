/** Shared motion. No background JavaScript loops; departing animations are cancelled. */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');

export function createParticles(container) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('i');
    dot.className = 'particle';
    dot.style.cssText = `left:${(i * 37 + 9) % 100}%;top:${(i * 23 + 13) % 100}%;--duration:${13 + i % 9}s;--delay:-${i * 1.7}s`;
    fragment.append(dot);
  }
  container.replaceChildren(fragment);
}

export async function fadeOut(elements) {
  if (reducedMotion()) return;
  const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-duration')) || 460;
  const animations = elements.map(element => element.animate(
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-10px)' }],
    { duration, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' },
  ));
  await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  animations.forEach(animation => animation.cancel());
}

export function clearSceneAnimations(element) {
  element.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
}

export function celebrate(container) {
  if (reducedMotion()) return () => {};
  const sparks = Array.from({ length: 18 }, (_, i) => {
    const spark = document.createElement('i');
    spark.className = 'celebration-spark';
    spark.setAttribute('aria-hidden', 'true');
    const angle = i / 18 * Math.PI * 2;
    spark.style.cssText = `--x:${Math.cos(angle) * (100 + i % 4 * 24)}px;--y:${Math.sin(angle) * (90 + i % 3 * 25)}px;animation-delay:${i % 3 * 30}ms`;
    container.append(spark);
    return spark;
  });
  return () => sparks.forEach(spark => spark.remove());
}
