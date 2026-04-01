import { test, expect } from '@playwright/test';
import { PotionShopPage } from './pages';

test.describe('changeQuantity', () => {
  let potionShop: PotionShopPage;

  test.beforeEach(async ({ page }) => {
    potionShop = new PotionShopPage(page);
    await potionShop.navigateToPotionShop();
    await potionShop.selectHealingPotion();
    await potionShop.waitForOrderUpdate();
  });

  test('+ button increases quantity by 1', async () => {
    await potionShop.clickQuantityIncrease();
    expect(await potionShop.getQuantityValue()).toBe(2);
  });

  test('− button decreases quantity by 1', async () => {
    await potionShop.clickQuantityIncrease();
    await potionShop.clickQuantityDecrease();
    expect(await potionShop.getQuantityValue()).toBe(1);
  });

  test('quantity cannot go below 1', async () => {
    await potionShop.clickQuantityDecrease();
    expect(await potionShop.getQuantityValue()).toBe(1);
  });

  test('quantity change updates the total price', async () => {
    const initialTotal = await potionShop.getTotalPrice();
    await potionShop.clickQuantityIncrease();
    await potionShop.waitForOrderUpdate();
    const newTotal = await potionShop.getTotalPrice();
    // Healing potion is 25 gold, so doubling quantity adds 25 gold
    expect(newTotal).toBe(initialTotal + 25);
  });
});

test.describe('addFeaturedToOrder', () => {
  let potionShop: PotionShopPage;

  test.beforeEach(async ({ page }) => {
    potionShop = new PotionShopPage(page);
    await potionShop.navigateToPotionShop();
  });

  test('adds 36 gold to the order total', async () => {
    const initialTotal = await potionShop.getTotalPrice();
    await potionShop.clickAddFeaturedToOrder();
    await potionShop.waitForOrderUpdate();
    const newTotal = await potionShop.getTotalPrice();
    expect(newTotal).toBe(initialTotal + 36);
  });

  test('button shows "✓ Added!" and is disabled after click', async () => {
    await potionShop.clickAddFeaturedToOrder();
    expect(await potionShop.getFeaturedButtonText()).toContain('Added');
    expect(await potionShop.isFeaturedButtonDisabled()).toBe(true);
  });
});

test.describe('handleFormSubmit', () => {
  let potionShop: PotionShopPage;

  test.beforeEach(async ({ page }) => {
    potionShop = new PotionShopPage(page);
    await potionShop.navigateToPotionShop();
    await potionShop.selectHealingPotion();
    await potionShop.fillOrderForm('Gandalf the Grey', 'Hogwarts Castle', 'The Northern Reaches');
  });

  test('shows confirmation modal after submit', async () => {
    await potionShop.submitOrder();
    expect(await potionShop.isModalVisible()).toBe(true);
  });

  test('order number is in EB-XXXXX format', async () => {
    await potionShop.submitOrder();
    const orderNumber = await potionShop.getOrderNumber();
    expect(orderNumber).toMatch(/^EB-\d{5}$/);
  });

  test('Owl Post delivery shows 3-5 days estimate', async () => {
    await potionShop.submitOrder();
    expect(await potionShop.getDeliveryEstimate()).toBe('3-5 days');
  });

  test('Dragon Express delivery shows Tomorrow estimate', async () => {
    await potionShop.selectDragonExpressDelivery();
    await potionShop.submitOrder();
    expect(await potionShop.getDeliveryEstimate()).toBe('Tomorrow');
  });
});

test.describe('closeModal', () => {
  let potionShop: PotionShopPage;

  test.beforeEach(async ({ page }) => {
    potionShop = new PotionShopPage(page);
    await potionShop.navigateToPotionShop();
    await potionShop.selectHealingPotion();
    await potionShop.fillOrderForm('Gandalf the Grey', 'Hogwarts Castle', 'The Northern Reaches');
    await potionShop.submitOrder();
  });

  test('X button closes the modal', async () => {
    await potionShop.closeModalViaXButton();
    expect(await potionShop.isModalVisible()).toBe(false);
  });

  test('Continue Shopping button closes the modal', async () => {
    await potionShop.closeModalViaContinueShopping();
    expect(await potionShop.isModalVisible()).toBe(false);
  });

  test('Escape key closes the modal', async () => {
    await potionShop.closeModalViaEscape();
    expect(await potionShop.isModalVisible()).toBe(false);
  });

  test('clicking outside the modal closes it', async () => {
    await potionShop.closeModalViaOutsideClick();
    expect(await potionShop.isModalVisible()).toBe(false);
  });
});
