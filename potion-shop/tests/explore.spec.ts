/**
 * Exploratory bug-finding script for the deployed potion shop.
 * Outputs findings as test failures or console.log entries.
 * Run with: npx playwright test tests/explore.spec.ts --project=chromium --headed
 */
import { test, expect } from '@playwright/test';

const SITE = 'https://qe-at-cgi-fi.github.io/cet-with-ai/potion-shop/';

const bugs: string[] = [];
function note(id: string, msg: string) {
  bugs.push(`[${id}] ${msg}`);
  console.log(`BUG ${id}: ${msg}`);
}

test.afterAll(() => {
  console.log('\n========= BUGS FOUND =========');
  bugs.forEach(b => console.log(b));
  console.log(`==============================\nTotal: ${bugs.length}`);
});

test.afterAll(async ({ browser }) => {
  await browser.close();
});

// ─── PAGE LOAD & RESOURCES ────────────────────────────────────────────────────

test('Resources: collect 404s and console errors on page load', async ({ page }) => {
  const failed404: string[] = [];
  const consoleErrors: string[] = [];

  page.on('response', r => {
    if (r.status() === 404) failed404.push(`${r.status()} ${r.url()}`);
  });
  page.on('console', m => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  await page.goto(SITE, { waitUntil: 'networkidle' });

  if (failed404.length) note('R1', `404 resources: ${failed404.join(' | ')}`);
  if (consoleErrors.length) note('R2', `Console errors: ${consoleErrors.join(' | ')}`);
});

// ─── STATIC CONTENT ───────────────────────────────────────────────────────────

test('Content: opening hours consistent between header and footer', async ({ page }) => {
  await page.goto(SITE);
  const header = await page.locator('.hours').textContent();
  const footerP = page.locator('.site-footer p').filter({ hasText: /Open (dawn|dusk) to (dusk|dawn)/i });
  const footer = await footerP.textContent();
  if (header?.trim() !== footer?.trim())
    note('C1', `Hours mismatch — header: "${header?.trim()}" vs footer: "${footer?.trim()}"`);
});

test('Content: copyright year is current', async ({ page }) => {
  await page.goto(SITE);
  const text = await page.locator('.footer-bottom').textContent();
  if (!text?.includes('2026')) note('C2', `Copyright shows "${text?.match(/©[^.]+/)?.[0]?.trim()}" — should include 2026`);
});

test('Content: featured sale price matches 15% off 40', async ({ page }) => {
  await page.goto(SITE);
  const sale = await page.locator('.sale-price').textContent();
  const num = parseFloat(sale?.replace(/[^\d.]/g, '') ?? '0');
  if (Math.abs(num - 34) > 0.01) note('C3', `Featured sale price shows "${sale}" — expected 34 gold (15% off 40)`);
});

test('Content: ingredient label prices match data-price attributes', async ({ page }) => {
  await page.goto(SITE);
  const ingredients = await page.locator('input[name="ingredient"]').all();
  for (const cb of ingredients) {
    const dataPrice = await cb.getAttribute('data-price');
    const label = await cb.locator('..').locator('.ingredient-price').textContent();
    const displayedPrice = label?.match(/\d+/)?.[0];
    if (dataPrice !== displayedPrice)
      note('C4', `Ingredient "${await cb.getAttribute('value')}": label says "${label?.trim()}" but data-price="${dataPrice}"`);
  }
});

test('Content: size label multipliers match data-multiplier attributes', async ({ page }) => {
  await page.goto(SITE);
  const sizes = await page.locator('input[name="size"]').all();
  for (const r of sizes) {
    const dataMult = await r.getAttribute('data-multiplier');
    const detail = await r.locator('..').locator('.size-detail').textContent();
    const displayedMult = detail?.match(/([\d.]+)x/)?.[1];
    if (dataMult !== displayedMult)
      note('C5', `Size "${await r.getAttribute('value')}": label says "${displayedMult}x" but data-multiplier="${dataMult}"`);
  }
});

// ─── IMAGES & LINKS ───────────────────────────────────────────────────────────

test('Images: featured image loads (not broken)', async ({ page }) => {
  await page.goto(SITE, { waitUntil: 'networkidle' });
  const w = await page.locator('.featured-image').evaluate((img: HTMLImageElement) => img.naturalWidth);
  if (w === 0) note('I1', 'Featured image is broken (naturalWidth=0)');
});

test('Images: featured image has alt text', async ({ page }) => {
  await page.goto(SITE);
  const alt = await page.locator('.featured-image').getAttribute('alt');
  if (!alt) note('I2', 'Featured image has no alt attribute');
});

test('Links: no links point to obviously fake/dead domains', async ({ page }) => {
  await page.goto(SITE);
  const anchors = await page.locator('a[href]').all();
  for (const a of anchors) {
    const href = await a.getAttribute('href');
    if (href && href.includes('.fake')) {
      const text = await a.textContent();
      note('L1', `Link "${text?.trim()}" points to fake domain: ${href}`);
    }
  }
});

// ─── ACCESSIBILITY ────────────────────────────────────────────────────────────

test('A11y: quantity input is keyboard-reachable', async ({ page }) => {
  await page.goto(SITE);
  const ti = await page.locator('#quantity').getAttribute('tabindex');
  if (ti === '-1') note('A1', 'Quantity input has tabindex="-1" — not reachable by keyboard');
});

test('A11y: contact crystal field has a label', async ({ page }) => {
  await page.goto(SITE);
  const has = await page.evaluate(() => !!document.querySelector('label[for="contact-crystal"]'));
  if (!has) note('A2', 'Contact Crystal input has no <label for="contact-crystal">');
});

test('A11y: footer Shop Hours heading level matches siblings', async ({ page }) => {
  await page.goto(SITE);
  const tag = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('footer h4, footer h5'))
      .find(e => e.textContent?.trim() === 'Shop Hours');
    return el?.tagName.toLowerCase();
  });
  if (tag !== 'h4') note('A3', `"Shop Hours" uses <${tag}> — siblings use <h4>`);
});

test('A11y: star rating visible against background', async ({ page }) => {
  await page.goto(SITE);
  const els = await page.locator('.review-stars').all();
  for (const el of els) {
    const color = await el.evaluate((e: HTMLElement) => getComputedStyle(e).color);
    const bg = await page.locator('.review-card').first().evaluate((e: HTMLElement) => getComputedStyle(e).backgroundColor);
    // rgb(245,245,220) is beige — nearly invisible on white/light bg
    if (color === 'rgb(245, 245, 220)') note('A4', `Star rating uses near-invisible beige color ${color} (background: ${bg})`);
  }
});

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

test('Calc: initial total = brewing fee (3) + delivery (5) = 8', async ({ page }) => {
  await page.goto(SITE);
  const total = await page.locator('#summary-total .total-price').textContent();
  if (total?.trim() !== '8.00 gold') note('Calc1', `Initial total is "${total}" — expected "8.00 gold"`);
});

test('Calc: switching delivery updates total', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('input[name="delivery"][value="dragon"]').check({ force: true });
  const total = await page.locator('#summary-total .total-price').textContent();
  if (total?.trim() !== '18.00 gold') note('Calc2', `After Dragon Express total is "${total}" — expected "18.00 gold"`);
});

test('Calc: potion price × size multiplier is correct', async ({ page }) => {
  await page.goto(SITE);
  // Healing (25) × flask (1.35) = 33.75 + 3 + 5 = 41.75
  await page.locator('input[name="base-potion"][value="healing"]').check({ force: true });
  await page.locator('input[name="size"][value="flask"]').check({ force: true });
  const total = await page.locator('#summary-total .total-price').textContent();
  const num = parseFloat(total?.replace(' gold', '') ?? '0');
  if (Math.abs(num - 41.75) > 0.01) note('Calc3', `Healing+Flask total is "${total}" — expected 41.75 gold`);
});

test('Calc: potion price × potency multiplier is correct', async ({ page }) => {
  await page.goto(SITE);
  // Healing (25) × enhanced (1.25) = 31.25 + 3 + 5 = 39.25
  await page.locator('input[name="base-potion"][value="healing"]').check({ force: true });
  await page.locator('input[name="potency"][value="enhanced"]').check({ force: true });
  const total = await page.locator('#summary-total .total-price').textContent();
  const num = parseFloat(total?.replace(' gold', '') ?? '0');
  if (Math.abs(num - 39.25) > 0.01) note('Calc4', `Healing+Enhanced total is "${total}" — expected 39.25 gold`);
});

test('Calc: ingredients are added to total', async ({ page }) => {
  await page.goto(SITE);
  // Dragon Scale (+15) + base delivery(5) + brewing(3) = 23
  await page.locator('input[name="ingredient"][value="dragon-scale"]').check({ force: true });
  const total = await page.locator('#summary-total .total-price').textContent();
  const num = parseFloat(total?.replace(' gold', '') ?? '0');
  if (Math.abs(num - 23) > 0.01) note('Calc5', `With Dragon Scale total is "${total}" — expected 23.00 gold`);
});

test('Calc: ingredients scale with quantity', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('input[name="base-potion"][value="healing"]').check({ force: true });
  await page.locator('input[name="ingredient"][value="dragon-scale"]').check({ force: true });
  await page.locator('#quantity').fill('3');
  await page.locator('#quantity').dispatchEvent('input');
  // (25+15)*3 = 120 subtotal
  const sub = await page.locator('#summary-subtotal .item-price').textContent();
  const num = parseFloat(sub?.replace(' gold', '') ?? '0');
  if (Math.abs(num - 120) > 0.01) note('Calc6', `Subtotal with qty=3 is "${sub}" — expected 120.00 gold (ingredients should multiply by quantity)`);
});

test('Calc: featured potion charges correct discounted price', async ({ page }) => {
  await page.goto(SITE);
  const before = parseFloat((await page.locator('#summary-total .total-price').textContent())!.replace(' gold', ''));
  await page.click('.btn-featured');
  const after = parseFloat((await page.locator('#summary-total .total-price').textContent())!.replace(' gold', ''));
  const diff = after - before;
  if (Math.abs(diff - 34) > 0.01) note('Calc7', `Featured potion adds ${diff.toFixed(2)} gold — expected 34 (15% off 40)`);
});

// ─── FORM VALIDATION & SUBMIT BEHAVIOUR ──────────────────────────────────────

test('Form: submitting without a potion should be blocked', async ({ page }) => {
  await page.goto(SITE);
  await page.fill('#customer-name', 'Tester');
  await page.fill('#castle-name', 'Castle');
  await page.fill('#kingdom', 'Realm');
  await page.click('button[type="submit"]');
  const active = await page.locator('#confirmation-modal').evaluate(el => el.classList.contains('active'));
  if (active) note('F1', 'Order confirmed without any potion selected — modal appeared with "No potion selected" in summary');
});

test('Form: builder resets visually after successful submission', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('input[name="base-potion"][value="healing"]').check({ force: true });
  await page.locator('input[name="size"][value="flask"]').check({ force: true });
  await page.fill('#customer-name', 'Tester');
  await page.fill('#castle-name', 'Castle');
  await page.fill('#kingdom', 'Realm');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Continue Shopping")');
  const healingChecked = await page.locator('input[name="base-potion"][value="healing"]').isChecked();
  const flaskChecked = await page.locator('input[name="size"][value="flask"]').isChecked();
  if (healingChecked) note('F2', 'After submit, healing potion radio is still visually selected');
  if (flaskChecked) note('F2', 'After submit, flask size radio is still visually selected');
});

test('Form: quantity > 99 is rejected', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('#quantity').fill('100');
  await page.locator('#quantity').dispatchEvent('input');
  const qty = await page.locator('#summary-quantity .item-name').textContent();
  if (qty?.includes('100')) note('F3', `Quantity 100 accepted — summary shows "${qty}" (max should be 99)`);
});

test('Form: quantity 0 treated as 1', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('#quantity').fill('0');
  await page.locator('#quantity').dispatchEvent('input');
  const qty = await page.locator('#summary-quantity .item-name').textContent();
  if (qty?.includes(': 0')) note('F4', `Quantity 0 accepted — summary shows "${qty}"`);
});

test('Form: decimal quantity is handled gracefully', async ({ page }) => {
  await page.goto(SITE);
  await page.locator('#quantity').fill('2.5');
  await page.locator('#quantity').dispatchEvent('input');
  const qty = await page.locator('#summary-quantity .item-name').textContent();
  // Should show 2 or give feedback — not silently show 2 without indication
  const inputVal = await page.locator('#quantity').inputValue();
  if (inputVal.includes('.')) note('F5', `Decimal quantity "${inputVal}" accepted without validation feedback`);
});
