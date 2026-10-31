import { scenes, chapters } from './scenes.js';
import { renderArtwork } from './artwork.js';
import { fadeOut, clearSceneAnimations } from './animations.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const littleStar = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1Q8 8 15 8Q8 8 8 15Q8 8 1 8Q8 8 8 1Z" stroke="currentColor" stroke-width=".7"/></svg>';
const number = value => String(value).padStart(2, '0');

export function createNavigation({ content, art, list, announcer, onLeave = () => {} }) {
  let current = 0;
  let transitioning = false;
  const visited = new Set();
  const sceneFromHash = () => scenes.findIndex(scene => `#${scene.id}` === location.hash);
  const chapterButtons = chapters.map((scene, i) => {
    const item = document.createElement('li');
    item.innerHTML = `<button class="chapter-button" type="button" data-chapter="${i + 1}" aria-label="فصل ${i + 1}: ${scene.label}"><span class="chapter-number" dir="ltr">${number(i + 1)}</span><span class="chapter-names">${scene.short}<small lang="en" dir="ltr">${scene.english}</small></span></button>`;
    list.append(item);
    return item.firstElementChild;
  });

  function render() {
    const scene = scenes[current];
    const openingDelay = current === 0 ? 500 : 0;
    const isChapter = current > 0 && current < scenes.length - 1;
    document.body.dataset.scene = scene.id;
    const progress = document.getElementById('reading-progress');
    const completed = Math.min(current, chapters.length);
    progress.setAttribute('aria-valuemax', String(chapters.length));
    progress.setAttribute('aria-valuenow', String(completed));
    progress.setAttribute('aria-valuetext', `${completed} از ${chapters.length} فصل`);
    progress.style.setProperty('--progress', completed / chapters.length);
    document.body.style.setProperty('--accent', `var(--${scene.accent})`);
    document.body.style.setProperty('--glow-rgb', scene.glow);
    const heading = isChapter ? `CHAPTER ${number(current)} — ${scene.english.toUpperCase()}` : scene.english;
    content.innerHTML = `
      <div class="eyebrow reveal" dir="ltr" style="--delay:80ms"><span>${heading}</span>${isChapter ? `<span class="chapter-count">${number(current)} / ${number(chapters.length)}</span>` : ''}</div>
      ${scene.pretitle ? `<p class="scene-pretitle reveal" style="--delay:${180 + openingDelay}ms">${scene.pretitle}</p>` : ''}
      <h1 id="scene-title" class="scene-title reveal" tabindex="-1" style="--delay:${280 + openingDelay * 1.4}ms">${scene.title}</h1>
      <div class="story-copy reveal" style="--delay:${440 + openingDelay * 1.8}ms">${scene.paragraphs.map((p, i) => `<p class="reveal" style="--delay:${470 + openingDelay * 1.8 + i * 100}ms">${p}</p>`).join('')}</div>
      ${scene.aside ? `<div class="reveal" style="--delay:${650 + openingDelay * 2}ms"><div class="scene-rule"></div><p class="scene-aside">${littleStar}${scene.aside}</p></div>` : ''}
      ${scene.closing ? `<p class="final-note reveal" style="--delay:700ms">${scene.closing}</p>` : ''}
      <div class="scene-actions reveal" style="--delay:${800 + openingDelay * 2.3}ms">
        ${current === scenes.length - 1
          ? `<button class="button button--primary" data-action="restart" type="button">از اول بخونیم ${arrow}</button><button class="button button--outline" data-action="smile" type="button"><span>یه بار دیگه لبخند بزن <bdi dir="ltr">:)</bdi></span></button>`
          : `<button class="button button--primary" data-action="next" type="button">${scene.next || 'آرزوی بعدی'}${arrow}</button>${current > 0 ? '<button class="button button--text" data-action="previous" type="button"><span aria-hidden="true">→</span> قبلی</button>' : '<span class="action-caption">شش آرزو. یک پیوند همیشگی.</span>'}`}
      </div>`;
    art.innerHTML = scene.art ? renderArtwork(scene.art) : '';
    chapterButtons.forEach((button, i) => {
      const active = current === i + 1 || (current === scenes.length - 1 && i === chapters.length - 1);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.classList.toggle('is-visited', visited.has(i + 1));
    });
    document.title = `${scene.label} — BROTHER 29`;
  }

  async function goTo(target, { focus = true } = {}) {
    if (transitioning || target < 0 || target >= scenes.length || target === current) return false;
    transitioning = true;
    document.getElementById('story').setAttribute('aria-busy', 'true');
    try {
      onLeave();
      await fadeOut([content, art]);
      clearSceneAnimations(content);
      clearSceneAnimations(art);
      current = target;
      if (current === 0) visited.clear();
      else visited.add(current);
      render();
      history.replaceState(null, '', `#${scenes[current].id}`);
      announcer.textContent = current > 0 && current <= chapters.length
        ? `فصل ${current} از ${chapters.length}، ${scenes[current].label}` : scenes[current].label;
      if (focus) {
        content.querySelector('h1').focus({ preventScroll: true });
        // Return to the beginning of a long chapter without locking natural scrolling.
        const main = document.getElementById('story');
        if (main.getBoundingClientRect().top < -100) window.scrollTo({ top: Math.max(0, main.offsetTop - 20), behavior: 'instant' });
      }
      return true;
    } finally {
      transitioning = false;
      document.getElementById('story').removeAttribute('aria-busy');
    }
  }

  const initialScene = sceneFromHash();
  if (initialScene > 0) { current = initialScene; visited.add(current); }
  render();
  return {
    goTo,
    fromHash: () => goTo(sceneFromHash()),
    next: () => goTo(current + 1),
    previous: () => goTo(current - 1),
    restart: () => goTo(0),
    get current() { return current; },
  };
}
