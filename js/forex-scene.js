/** Deterministic, decorative market art. No prices, feed, random layout, or timers. */
export function forexArtwork() {
  const candles = [
    [80,307,38,1], [105,288,24,1], [130,300,28,0], [155,280,35,1],
    [180,256,38,1], [205,273,24,0], [230,248,43,1], [255,228,33,1],
    [280,245,25,0], [305,220,40,1], [330,198,38,1], [355,210,27,0],
    [380,181,43,1], [405,159,33,1], [430,172,24,0], [455,136,47,1],
  ];
  const grid = [140,200,260,320,380].map(y => `<path d="M55 ${y}H500" stroke="#32c997" stroke-opacity=".09" stroke-dasharray="3 7"/>`).join('');
  const bars = candles.map(([x, y, h, up], i) => {
    const color = up ? '#32C997' : '#D98F95';
    return `<g class="candle" style="--delay:${200 + i * 85}ms"><path d="M${x} ${y - 12}v${h + 26}" stroke="${color}" stroke-width="1"/><rect x="${x - 5}" y="${y}" width="10" height="${h}" rx="1" fill="${color}" fill-opacity=".65"/></g>`;
  }).join('');
  return `<svg class="artwork" viewBox="0 0 560 530" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="market-glow"><stop stop-color="#32C997" stop-opacity=".09"/><stop offset="1" stop-color="#32C997" stop-opacity="0"/></radialGradient><filter id="market-blur"><feGaussianBlur stdDeviation="2"/></filter><linearGradient id="market-line" x1="50" y1="360" x2="480" y2="130" gradientUnits="userSpaceOnUse"><stop stop-color="#32C997" stop-opacity=".05"/><stop offset="1" stop-color="#32C997" stop-opacity=".7"/></linearGradient></defs>
    <circle cx="280" cy="250" r="230" fill="url(#market-glow)"/>
    <circle cx="280" cy="250" r="215" stroke="#32c997" stroke-opacity=".09"/>
    <g class="floating-symbol distant" filter="url(#market-blur)" opacity=".22"><text x="85" y="125" class="forex-label" font-size="45">$</text><text x="367" y="393" class="forex-label">GBP / USD</text></g>
    <g>${grid}</g>
    <path d="M55 385H500M55 110V385" stroke="#32c997" stroke-opacity=".18"/>
    <path class="draw-line" pathLength="1" d="M62 360L110 338L156 327L204 301L252 285L300 270L348 236L396 210L444 181L485 138" stroke="url(#market-line)" stroke-width="1"/>
    <g>${bars}</g>
    <g class="floating-symbol"><text x="76" y="96" class="forex-label">EUR / USD</text><circle cx="191" cy="92" r="2" fill="#32c997"/><text x="400" y="111" class="forex-label" opacity=".5">+ + +</text></g>
    <text x="65" y="412" class="orbit-label" fill="#6d8c83">PATIENCE. DISCIPLINE. GROWTH.</text>
    <path d="M485 124v14m-7-7h14" stroke="#F2E3C2" stroke-width="1"/>
  </svg><p class="forex-disclaimer">نمودار صرفاً تزئینی است؛ نه اطلاعات واقعی بازار.</p>`;
}
