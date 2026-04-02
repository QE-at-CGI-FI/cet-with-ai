import { test, expect } from '@playwright/test';
import { PotionShopPage } from './pages';

test.describe('Baseline total', () => {
  test('default total is 8 gold (3 brewing fee + 5 owl post, no potion)', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    expect(await shop.getTotalPrice()).toBe(8);
  });
});

test.describe('Base potion prices', () => {
  const potions = [
    { name: 'Healing Draught',    value: 'healing',     price: 25 },
    { name: 'Elixir of Strength', value: 'strength',    price: 30 },
    { name: 'Potion of Wisdom',   value: 'wisdom',      price: 35 },
    { name: 'Invisibility Brew',  value: 'invisibility', price: 45 },
  ] as const;

  for (const potion of potions) {
    test(`${potion.name} adds ${potion.price} gold (+ 3 brewing + 5 delivery = ${potion.price + 8})`, async ({ page }) => {
      const shop = new PotionShopPage(page);
      await shop.navigateToPotionShop();
      await shop.selectBasePotionByValue(potion.value);
      await shop.waitForOrderUpdate();
      expect(await shop.getTotalPrice()).toBe(potion.price + 8);
    });
  }
});

test.describe('Size multipliers', () => {
  // Healing Draught = 25g base
  test('vial (1x): total = 25 * 1 + 8 = 33', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    // vial is default — no extra click needed
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBe(33);
  });

  test('flask (1.35x): total = 25 * 1.35 + 8 = 41.75', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await page.locator('label:has(input[name="size"][value="flask"])').click();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBeCloseTo(41.75, 2);
  });

  test('bottle (2.5x): total = 25 * 2.5 + 8 = 70.5', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await page.locator('label:has(input[name="size"][value="bottle"])').click();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBeCloseTo(70.5, 2);
  });
});

test.describe('Potency multipliers', () => {
  // Healing Draught = 25g base, vial (1x)
  test('standard (1x): total = 25 * 1 + 8 = 33', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBe(33);
  });

  test('enhanced (1.25x): total = 25 * 1.25 + 8 = 39.25', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await page.locator('label:has(input[name="potency"][value="enhanced"])').click();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBeCloseTo(39.25, 2);
  });

  test('maximum (1.75x): total = 25 * 1.75 + 8 = 51.75', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await page.locator('label:has(input[name="potency"][value="maximum"])').click();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBeCloseTo(51.75, 2);
  });
});

test.describe('Ingredient prices', () => {
  const ingredients = [
    { value: 'dragon-scale',    price: 15 },
    { value: 'moonstone',       price: 8  },
    { value: 'phoenix-feather', price: 18 },
    { value: 'enchanted-honey', price: 5  },
    { value: 'shadow-essence',  price: 12 },
    { value: 'starlight-dew',   price: 10 },
  ] as const;

  for (const ing of ingredients) {
    test(`${ing.value} adds ${ing.price} gold to total`, async ({ page }) => {
      const shop = new PotionShopPage(page);
      await shop.navigateToPotionShop();
      const before = await shop.getTotalPrice();
      await page.locator(`input[name="ingredient"][value="${ing.value}"]`).check();
      await shop.waitForOrderUpdate();
      const after = await shop.getTotalPrice();
      expect(after - before).toBe(ing.price);
    });
  }

  test('multiple ingredients accumulate correctly', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    const before = await shop.getTotalPrice();
    // dragon-scale (15) + moonstone (8) = 23
    await page.locator('input[name="ingredient"][value="dragon-scale"]').check();
    await page.locator('input[name="ingredient"][value="moonstone"]').check();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice() - before).toBe(23);
  });

  test('unchecking an ingredient removes its price', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await page.locator('input[name="ingredient"][value="dragon-scale"]').check();
    await shop.waitForOrderUpdate();
    const withIngredient = await shop.getTotalPrice();
    await page.locator('input[name="ingredient"][value="dragon-scale"]').uncheck();
    await shop.waitForOrderUpdate();
    expect(await shop.getTotalPrice()).toBe(withIngredient - 15);
  });
});

test.describe('Quantity multiplication', () => {
  test('quantity 3 multiplies potion subtotal (not fees)', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion(); // 25g
    await shop.waitForOrderUpdate();
    // Set quantity to 3
    await shop.clickQuantityIncrease();
    await shop.clickQuantityIncrease();
    await shop.waitForOrderUpdate();
    // 25 * 3 + 3 brewing + 5 delivery = 83
    expect(await shop.getTotalPrice()).toBe(83);
  });

  test('ingredients are multiplied by quantity', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion(); // 25g
    await page.locator('input[name="ingredient"][value="dragon-scale"]').check(); // 15g
    await shop.waitForOrderUpdate();
    const singleQtyTotal = await shop.getTotalPrice(); // 25 + 15 + 8 = 48
    await shop.clickQuantityIncrease(); // qty = 2
    await shop.waitForOrderUpdate();
    // (25 + 15) * 2 + 8 = 88
    expect(await shop.getTotalPrice()).toBe(singleQtyTotal + 40);
  });
});

test.describe('Combined calculation', () => {
  test('size + potency + ingredients + quantity + delivery all combine correctly', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();

    // Healing (25g) * flask (1.35) * enhanced (1.25) = 42.1875 per unit
    // + dragon-scale (15g) = 57.1875 per unit
    // * qty 2 = 114.375
    // + 3 brewing + 15 dragon express = 132.375
    await shop.selectHealingPotion();
    await page.locator('label:has(input[name="size"][value="flask"])').click();
    await page.locator('label:has(input[name="potency"][value="enhanced"])').click();
    await page.locator('input[name="ingredient"][value="dragon-scale"]').check();
    await shop.clickQuantityIncrease(); // qty = 2
    await shop.selectDragonExpressDelivery();
    await shop.waitForOrderUpdate();

    expect(await shop.getTotalPrice()).toBeCloseTo(132.375, 2);
  });
});

test.describe('Form state reset after submission', () => {
  test('order summary resets to baseline after form submit', async ({ page }) => {
    const shop = new PotionShopPage(page);
    await shop.navigateToPotionShop();
    await shop.selectHealingPotion();
    await shop.fillOrderForm('Gandalf', 'Hogwarts', 'The North');
    await shop.submitOrder();
    await shop.closeModalViaXButton();

    const totalAfterReset = await shop.getTotalPrice();
    expect(totalAfterReset).toBe(8); // back to baseline: 3 brewing + 5 owl post
  });
});
