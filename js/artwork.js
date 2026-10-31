import { forexArtwork } from './forex-scene.js';

const star = (x, y, size = 7) => `<path d="M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}Z" class="art-star"/>`;
const defs = `<defs>
  <linearGradient id="number-gold" x1="120" y1="135" x2="430" y2="380" gradientUnits="userSpaceOnUse"><stop stop-color="#F2E3C2"/><stop offset=".45" stop-color="#D9B56D"/><stop offset="1" stop-color="#8B6D38"/></linearGradient>
  <radialGradient id="art-glow"><stop stop-color="#D9B56D" stop-opacity=".13"/><stop offset="1" stop-color="#D9B56D" stop-opacity="0"/></radialGradient>
  <linearGradient id="orbit-gold"><stop stop-color="#D9B56D" stop-opacity=".05"/><stop offset=".5" stop-color="#D9B56D" stop-opacity=".55"/><stop offset="1" stop-color="#D9B56D" stop-opacity=".05"/></linearGradient>
  <filter id="soft-light"><feGaussianBlur stdDeviation="12"/></filter>
</defs>`;
const wrap = body => `<svg class="artwork" viewBox="0 0 560 530" fill="none" xmlns="http://www.w3.org/2000/svg">${defs}${body}</svg>`;

function birthdayArtwork() {
  return wrap(`
    <circle cx="280" cy="255" r="240" fill="url(#art-glow)"/>
    <circle cx="280" cy="245" r="184" stroke="#D9B56D" stroke-opacity=".08"/>
    <circle cx="280" cy="245" r="211" stroke="#D9B56D" stroke-opacity=".06" stroke-dasharray="1 8"/>
    <path d="M280 19V46M280 446v25M40 245H65M495 245h25" stroke="#D9B56D" stroke-opacity=".2"/>
    <text x="268" y="357" text-anchor="middle" class="art-number-shadow">29</text>
    <ellipse class="orbit-breathe" cx="280" cy="250" rx="246" ry="90" transform="rotate(-33 280 250)" stroke="url(#orbit-gold)" stroke-width=".8"/>
    <text x="266" y="346" text-anchor="middle" class="art-number">29</text>
    <path d="M70 378C175 371 373 255 477 130" stroke="url(#orbit-gold)" stroke-width=".65"/>
    ${star(452, 135, 9)}${star(112, 330, 4)}${star(327, 56, 3)}
    <circle cx="87" cy="180" r="2" fill="#D9B56D" fill-opacity=".5"/>
    <circle cx="464" cy="318" r="1.5" fill="#D9B56D" fill-opacity=".5"/>
    <text x="280" y="38" text-anchor="middle" class="orbit-label">A NEW CHAPTER OF YOU</text>
  `) + `<div class="art-caption" dir="ltr"><p class="art-caption__title">TWENTY NINE</p><p class="art-caption__sub">A little older. A little wiser. Always you.</p></div>`;
}

function loveArtwork() {
  return wrap(`<defs><radialGradient id="rose-light"><stop stop-color="#d98fa5" stop-opacity=".22"/><stop offset="1" stop-color="#d98fa5" stop-opacity="0"/></radialGradient><linearGradient id="rose-ring"><stop stop-color="#d98fa5" stop-opacity=".05"/><stop offset=".5" stop-color="#d98fa5" stop-opacity=".55"/><stop offset="1" stop-color="#D9B56D" stop-opacity=".05"/></linearGradient></defs>
    <circle class="halo" cx="280" cy="250" r="180" fill="url(#rose-light)"/>
    <circle cx="280" cy="250" r="164" stroke="url(#rose-ring)" stroke-width=".8"/>
    <circle cx="280" cy="250" r="191" stroke="#d98fa5" stroke-opacity=".09"/>
    <ellipse cx="260" cy="250" rx="85" ry="125" transform="rotate(-25 260 250)" stroke="#d98fa5" stroke-opacity=".4"/>
    <ellipse cx="302" cy="250" rx="85" ry="125" transform="rotate(25 302 250)" stroke="#D9B56D" stroke-opacity=".45"/>
    <circle cx="280" cy="250" r="35" fill="#d98fa5" opacity=".1" filter="url(#soft-light)"/>
    ${star(280, 250, 10)}${star(406, 145, 4)}${star(143, 325, 3)}
    <text x="280" y="57" text-anchor="middle" class="orbit-label">SOMEONE TO CALL HOME</text>
  `) + '<p class="art-scene-label" dir="ltr">A quieter kind of happiness.</p>';
}

function brothersArtwork() {
  return wrap(`
    <circle cx="280" cy="255" r="220" fill="url(#art-glow)"/>
    <path d="M90 400L470 120M130 430L510 150" stroke="#D9B56D" stroke-opacity=".05"/>
    <path class="draw-line brother-path" pathLength="1" d="M75 365C185 390 140 151 253 200S348 290 451 113" stroke="#D9B56D" stroke-opacity=".16" stroke-width="16" filter="url(#soft-light)"/>
    <path class="draw-line brother-path" pathLength="1" d="M75 365C185 390 140 151 253 200S348 290 451 113" stroke="#D9B56D" stroke-width="1.5"/>
    <path class="draw-line brother-path" pathLength="1" d="M85 155C150 96 179 353 281 281S368 289 470 123" stroke="#F2E3C2" stroke-width="1.5" style="animation-delay:.2s"/>
    <circle cx="75" cy="365" r="4" fill="#D9B56D"/><circle cx="85" cy="155" r="4" fill="#F2E3C2"/>
    ${star(451, 113, 6)}${star(470, 123, 4)}
    <text x="60" y="399" class="orbit-label">YOU</text><text x="57" y="130" class="orbit-label">ME</text>
    <text x="280" y="456" text-anchor="middle" class="orbit-label">DIFFERENT PATHS. THE SAME SIDE.</text>
  `) + '<p class="art-scene-label" dir="ltr">Always, through it all.</p>';
}

function familyArtwork() {
  return wrap(`
    <circle cx="280" cy="270" r="220" fill="url(#art-glow)"/>
    <path d="M140 372V228a140 140 0 0 1 280 0v144" stroke="#D9B56D" stroke-opacity=".12"/>
    <path d="M160 372V233a120 120 0 0 1 240 0v139" stroke="#D9B56D" stroke-opacity=".24"/>
    <path d="M180 372V238a100 100 0 0 1 200 0v134" stroke="#D9B56D" stroke-opacity=".5"/>
    <path d="M200 372V242a80 80 0 0 1 160 0v130" stroke="#D9B56D" stroke-opacity=".18"/>
    <ellipse cx="280" cy="346" rx="79" ry="14" fill="#D9B56D" opacity=".12" filter="url(#soft-light)"/>
    <path d="M116 373h328" stroke="#D9B56D" stroke-opacity=".3"/>
    <path d="M280 221v60m-30-30h60" stroke="#D9B56D" stroke-opacity=".15"/>
    ${star(280, 251, 9)}
    <text x="280" y="426" text-anchor="middle" class="orbit-label">THE THINGS THAT TRULY MATTER</text>
  `) + '<p class="art-scene-label" dir="ltr">Home is all of us, together.</p>';
}

function smileArtwork() {
  return wrap(`
    <circle cx="280" cy="255" r="225" fill="url(#art-glow)"/>
    <circle cx="280" cy="245" r="180" stroke="#D9B56D" stroke-opacity=".16"/>
    <circle cx="280" cy="245" r="200" stroke="#D9B56D" stroke-opacity=".06" stroke-dasharray="1 8"/>
    <text x="275" y="296" text-anchor="middle" class="art-number" style="font-size:220px;opacity:.8">29</text>
    <path class="draw-line" pathLength="1" d="M173 320Q280 407 387 320" stroke="#D9B56D" stroke-width="1.5"/>
    ${star(425, 133, 8)}${star(139, 340, 5)}${star(219, 73, 3)}
    <text x="280" y="42" text-anchor="middle" class="orbit-label">NEVER LOSE YOUR SMILE</text>
  `) + '<p class="art-scene-label" dir="ltr">Good things are on their way.</p>';
}

export function renderArtwork(type) {
  switch (type) {
    case 'forex': return forexArtwork();
    case 'love': return loveArtwork();
    case 'brothers': return brothersArtwork();
    case 'family': return familyArtwork();
    case 'smile': return smileArtwork();
    default: return birthdayArtwork();
  }
}
