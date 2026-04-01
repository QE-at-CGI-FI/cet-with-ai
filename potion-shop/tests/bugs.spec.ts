import { test, expect } from '@playwright/test';
import path from 'path';

const pageUrl = `file://${path.join(__dirname, '..', 'index.html')}`;

async function fillDeliveryFields(page: any) {
  await page.fill('#customer-name', 'Gandalf the Grey');
  await page.fill('#castle-name', 'Rivendell');
  await page.fill('#kingdom', 'Middle Earth');
}

async function selectPotion(page: any, value: string) {
  await page.locator(`input[name="base-potion"][value="${value}"]`).check({ force: true });
}

async function selectSize(page: any, value: string) {
  await page.locator(`input[name="size"][value="${value}"]`).check({ force: true });
}

async function selectIngredient(page: any, value: string) {
  await page.locator(`input[name="ingredient"][value="${value}"]`).check({ force: true });
}

async function selectDelivery(page: any, value: string) {
  await page.locator(`input[name="delivery"][value="${value}"]`).check({ force: true });
}

test.describe('Bug 1: Order submits without a potion selected', () => {
  test('modal should not appear when no potion is selected', async ({ page }) => {
    await page.goto(pageUrl);
    await fillDeliveryFields(page);
    await page.click('button[type="submit"]');
    await expect(page.locator('#confirmation-modal')).not.toHaveClass(/active/);
    await expect(page.locator('#summary-potion .item-name')).toHaveText('No potion selected');
  });
});

test.describe('Bug 2: Form reset does not reset builder state', () => {
  test('builder visual state should reset after form submission', async ({ page }) => {
    await page.goto(pageUrl);
    await selectPotion(page, 'healing');
    await selectSize(page, 'flask');
    await selectIngredient(page, 'dragon-scale');
    await fillDeliveryFields(page);
    await page.click('button[type="submit"]');
    await page.click('button:has-text("Continue Shopping")');

    await expect(page.locator('input[name="base-potion"][value="healing"]')).not.toBeChecked();
    await expect(page.locator('input[name="size"][value="flask"]')).not.toBeChecked();
    await expect(page.locator('input[name="size"][value="vial"]')).toBeChecked();
    await expect(page.locator('input[name="ingredient"][value="dragon-scale"]')).not.toBeChecked();
    await expect(page.locator('input[name="potency"][value="standard"]')).toBeChecked();
    await expect(page.locator('#summary-potion .item-name')).toHaveText('No potion selected');
  });
});

test.describe('Bug 3: Delivery price not included in total (regression)', () => {
  test('switching delivery method should change the total', async ({ page }) => {
    await page.goto(pageUrl);
    // Initial: owl (5 gold) + brewing fee (3 gold) = 8 gold
    await expect(page.locator('#summary-total .total-price')).toHaveText('8.00 gold');
    await selectDelivery(page, 'dragon');
    // Dragon express (15 gold) + brewing fee (3 gold) = 18 gold
    await expect(page.locator('#summary-total .total-price')).toHaveText('18.00 gold');
  });
});

test.describe('Bug 4: Flask size multiplier regression', () => {
  test('flask should apply 1.35x multiplier', async ({ page }) => {
    await page.goto(pageUrl);
    await selectPotion(page, 'healing'); // 25 gold
    await selectSize(page, 'flask');
    // 25 * 1.35 = 33.75, + 3 brewing + 5 delivery = 41.75
    await expect(page.locator('#summary-total .total-price')).toHaveText('41.75 gold');
  });
});

test.describe('Bug 5: Bottle label regression', () => {
  test('bottle should apply 2.5x multiplier', async ({ page }) => {
    await page.goto(pageUrl);
    await selectPotion(page, 'healing'); // 25 gold
    await selectSize(page, 'bottle');
    // 25 * 2.5 = 62.5, + 3 brewing + 5 delivery = 70.5
    await expect(page.locator('#summary-total .total-price')).toHaveText('70.50 gold');
  });
});

test.describe('Bug 6: Phoenix Feather price regression', () => {
  test('Phoenix Feather should charge 18 gold', async ({ page }) => {
    await page.goto(pageUrl);
    await selectIngredient(page, 'phoenix-feather');
    await expect(page.locator('#summary-ingredients .item-price')).toHaveText('18 gold');
  });
});

test.describe('Bug 7: Starlight Dew price regression', () => {
  test('Starlight Dew should charge 10 gold', async ({ page }) => {
    await page.goto(pageUrl);
    await selectIngredient(page, 'starlight-dew');
    await expect(page.locator('#summary-ingredients .item-price')).toHaveText('10 gold');
  });
});

test.describe('Bug 8: Featured potion charged at 36 instead of 34 gold', () => {
  test('featured potion should add 34 gold (15% off 40)', async ({ page }) => {
    await page.goto(pageUrl);
    const initialText = await page.locator('#summary-total .total-price').textContent();
    const initialTotal = parseFloat(initialText!.replace(' gold', ''));

    await page.click('.btn-featured');

    const newText = await page.locator('#summary-total .total-price').textContent();
    const newTotal = parseFloat(newText!.replace(' gold', ''));

    expect(newTotal - initialTotal).toBeCloseTo(34, 1);
  });
});

test.describe('Bug 9: Quantity edge cases', () => {
  test('quantity above 99 should be capped at 99', async ({ page }) => {
    await page.goto(pageUrl);
    await page.locator('#quantity').fill('100');
    await page.locator('#quantity').dispatchEvent('input');
    await expect(page.locator('#summary-quantity .item-name')).toHaveText('Quantity: 99');
  });

  test('quantity of 0 should default to 1', async ({ page }) => {
    await page.goto(pageUrl);
    await page.locator('#quantity').fill('0');
    await page.locator('#quantity').dispatchEvent('input');
    await expect(page.locator('#summary-quantity .item-name')).toHaveText('Quantity: 1');
  });
});

test.describe('Bug 10: Ingredients not multiplied by quantity', () => {
  test('ingredient costs should scale with quantity', async ({ page }) => {
    await page.goto(pageUrl);
    await selectPotion(page, 'healing'); // 25 gold
    await selectIngredient(page, 'dragon-scale'); // +15 gold
    await page.locator('#quantity').fill('3');
    await page.locator('#quantity').dispatchEvent('input');
    // subtotal = (25 + 15) * 3 = 120
    await expect(page.locator('#summary-subtotal .item-price')).toHaveText('120.00 gold');
  });
});

test.describe('Bug 11: Featured product image broken', () => {
  test('featured image should load without error', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    const naturalWidth = await page.locator('.featured-image').evaluate(
      (img: HTMLImageElement) => img.naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  });
});

test.describe('Bug 12: Opening hours contradiction', () => {
  test('header and footer should show the same opening hours', async ({ page }) => {
    await page.goto(pageUrl);
    const headerHours = await page.locator('.hours').textContent();
    const footerHours = await page.locator('.site-footer').locator('p').filter({
      hasText: /Open (dawn|dusk) to (dusk|dawn)/
    }).textContent();
    expect(headerHours?.trim()).toBe(footerHours?.trim());
  });
});

test.describe('Bug 13: Review stars nearly invisible', () => {
  test('light-stars should not use near-invisible beige color', async ({ page }) => {
    await page.goto(pageUrl);
    const color = await page.locator('.review-stars.light-stars').evaluate(
      (el: HTMLElement) => getComputedStyle(el).color
    );
    // #f5f5dc is rgb(245, 245, 220) — nearly invisible on white
    expect(color).not.toBe('rgb(245, 245, 220)');
  });
});

test.describe('Bug 14: Copyright year outdated', () => {
  test('footer copyright should show 2026', async ({ page }) => {
    await page.goto(pageUrl);
    await expect(page.locator('.footer-bottom')).toContainText('2026');
  });
});

test.describe('Bug 15: Footer heading level inconsistency', () => {
  test('Shop Hours heading should use h4 like sibling sections', async ({ page }) => {
    await page.goto(pageUrl);
    const tagName = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('footer h4, footer h5'))
        .find(e => e.textContent?.trim() === 'Shop Hours');
      return el?.tagName.toLowerCase();
    });
    expect(tagName).toBe('h4');
  });
});

test.describe('Bug 16: Quantity input not keyboard-reachable', () => {
  test('quantity input should not have tabindex=-1', async ({ page }) => {
    await page.goto(pageUrl);
    const tabIndex = await page.locator('#quantity').getAttribute('tabindex');
    expect(tabIndex).not.toBe('-1');
  });
});

test.describe('Bug 17: Contact Crystal field has no label', () => {
  test('contact crystal input should have an associated label', async ({ page }) => {
    await page.goto(pageUrl);
    const hasLabel = await page.evaluate(() =>
      !!document.querySelector('label[for="contact-crystal"]')
    );
    expect(hasLabel).toBe(true);
  });
});

test.describe('Bug 18: Featured image has no alt text', () => {
  test('featured image should have a non-empty alt attribute', async ({ page }) => {
    await page.goto(pageUrl);
    const alt = await page.locator('.featured-image').getAttribute('alt');
    expect(alt).toBeTruthy();
  });
});

test.describe('Bug 19: Wandergram footer link is dead', () => {
  test('Wandergram link should not point to wandergram.fake', async ({ page }) => {
    await page.goto(pageUrl);
    const href = await page.locator('a:has-text("Wandergram")').getAttribute('href');
    expect(href).not.toContain('wandergram.fake');
  });
});

test.afterAll(async ({ browser }) => {
  await browser.close();
});
