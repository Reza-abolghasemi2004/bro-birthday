import { test, expect } from '@playwright/test';

async function scene(page, id) {
  await expect(page.locator('body')).toHaveAttribute('data-scene', id);
  await expect(page.locator('#story')).not.toHaveAttribute('aria-busy');
}
async function go(page, chapter) {
  await page.locator(`[data-chapter="${chapter}"]`).click();
  await expect(page.locator(`[data-chapter="${chapter}"]`)).toHaveAttribute('aria-current', 'step');
}

test('complete letter: six chapters, final smile, cleanup and restart', async ({ page }) => {
  const errors = [];
  const failedRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failedRequests.push(response.url()); });
  await page.goto('/');
  await scene(page, 'opening');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('۲۹ سالگی مبارک،');
  await page.getByRole('button', { name: 'شروع کنیم؟' }).click();
  const ids = ['blessings', 'forex', 'love', 'brothers', 'family', 'smile'];
  for (let i = 0; i < ids.length; i++) {
    await scene(page, ids[i]);
    await expect(page.locator(`[data-chapter="${i + 1}"]`)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('.chapter-count')).toHaveText(`0${i + 1} / 06`);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await expect(page.locator('.story-copy')).not.toBeEmpty();
    if (ids[i] === 'forex') {
      await expect(page.locator('.candle')).toHaveCount(16);
      await expect(page.locator('.forex-disclaimer')).toContainText('صرفاً تزئینی');
    }
    if (ids[i] === 'brothers') {
      await expect(page.locator('.brother-path')).toHaveCount(3);
      await expect(page.locator('.bond-quote')).toHaveText('من و تو همیشه برادریم.');
    }
    if (ids[i] === 'family') await expect(page.locator('.story-copy strong')).toHaveCount(3);
    await page.locator('[data-action="next"]').click();
  }
  await scene(page, 'final');
  await expect(page.locator('.final-note')).toHaveText('لبخند یادت نره، داداش!');
  await expect(page.locator('#scene-art')).toBeEmpty();
  await page.getByRole('button', { name: 'یه بار دیگه لبخند بزن :)' }).click();
  await expect(page.locator('#smile-message')).toHaveText('این یکی رو دیگه از ته دل بزن، داداش!');
  await page.getByRole('button', { name: 'از اول بخونیم' }).click();
  await scene(page, 'opening');
  await expect(page.locator('.celebration-spark')).toHaveCount(0);
  await expect(page.locator('#smile-message')).toBeEmpty();
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('previous button and RTL arrow keys; focus and direct chapter navigation', async ({ page }) => {
  await page.goto('/');
  await go(page, 3);
  await scene(page, 'love');
  await page.locator('[data-action="previous"]').click();
  await scene(page, 'forex');
  await expect(page.locator('#scene-title')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await scene(page, 'love');
  await page.keyboard.press('ArrowRight');
  await scene(page, 'forex');
  await page.locator('.brand').click();
  await scene(page, 'opening');
  await page.keyboard.press('ArrowRight');
  await scene(page, 'opening');
});

test('rapid navigation is serialized and cannot leave stale scene effects', async ({ page }) => {
  await page.goto('/#forex');
  await scene(page, 'forex');
  await page.evaluate(() => {
    document.querySelector('[data-chapter="4"]').click();
    for (let i = 0; i < 12; i++) {
      document.querySelector('[data-action="next"]').click();
      document.querySelector('[data-chapter="6"]').click();
    }
  });
  await scene(page, 'brothers');
  await expect(page.locator('.candle')).toHaveCount(0);
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
  await page.locator('[data-action="next"]').click();
  await scene(page, 'family');
});

test('reduced motion, persistent pause preference and finite decorative DOM', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#forex');
  const duration = await page.locator('.candle').first().evaluate(el => getComputedStyle(el).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(.01);
  await expect(page.locator('.particle')).toHaveCount(18);
  await page.locator('#motion-toggle').click();
  await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/motion-paused/);
  await go(page, 6);
  await page.locator('[data-action="next"]').click();
  await scene(page, 'final');
  await page.locator('[data-action="smile"]').click();
  await expect(page.locator('.celebration-spark')).toHaveCount(0);
  await expect(page.locator('#smile-message')).toHaveClass(/is-visible/);
});

test('no external resources; chapters work after network loss', async ({ page, context }) => {
  const external = [];
  page.on('request', req => { if (!req.url().startsWith('http://127.0.0.1:3000') && !req.url().startsWith('data:')) external.push(req.url()); });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await context.setOffline(true);
  await go(page, 2);
  await scene(page, 'forex');
  await go(page, 5);
  await scene(page, 'family');
  expect(external).toEqual([]);
  await expect(page.locator('.story-copy')).toContainText('پدر و مادر');
});

test('all chapters fit horizontally at small mobile and desktop widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    for (let chapter = 1; chapter <= 6; chapter++) {
      await go(page, chapter);
      const size = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        text: document.querySelector('.story__content').getBoundingClientRect().toJSON(),
      }));
      expect(size.document, `chapter ${chapter} at ${width}`).toBeLessThanOrEqual(width);
      expect(size.body).toBeLessThanOrEqual(width);
      expect(size.text.left).toBeGreaterThanOrEqual(0);
      expect(size.text.right).toBeLessThanOrEqual(width);
    }
  }
});

test('WCAG A/AA accessibility scan for every frame', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (let frame = 0; frame <= 7; frame++) {
    if (frame > 0 && frame < 7) await go(page, frame);
    if (frame === 7) {
      await page.locator('[data-action="next"]').click();
      await scene(page, 'final');
    }
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(scan.violations, `frame ${frame}: ${JSON.stringify(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([]);
  }
});

test('same-document hash links keep URL and displayed chapter in sync', async ({ page }) => {
  await page.goto('/#forex');
  await scene(page, 'forex');
  await page.evaluate(() => { location.hash = 'brothers'; });
  await scene(page, 'brothers');
  await page.evaluate(() => { location.hash = 'final'; });
  await scene(page, 'final');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('تولدت مبارک،');
});
