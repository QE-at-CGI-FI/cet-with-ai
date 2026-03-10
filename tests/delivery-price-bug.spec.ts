import { test, expect } from '@playwright/test';
import { PotionShopPage } from './pages';

test.describe('Delivery Price Bug Tests', () => {
  let potionShop: PotionShopPage;

  test.beforeEach(async ({ page }) => {
    potionShop = new PotionShopPage(page);
    await potionShop.navigateToPotionShop();
  });

  test('delivery price is not included in total - Bug #3', async ({ page }) => {
    // Select a base potion to get a baseline total
    await potionShop.selectHealingPotion();
    
    // Wait for the order summary to update
    await potionShop.waitForOrderUpdate();
    
    // Get the initial total with Owl Post (5 gold delivery, default selected)
    const initialTotal = await potionShop.getTotalPrice();
    
    // Switch to Dragon Express (15 gold delivery, 10 gold more expensive)
    await potionShop.selectDragonExpressDelivery();
    
    // Wait for the order summary to update
    await potionShop.waitForOrderUpdate();
    
    // Get the new total - should be 10 gold higher due to delivery price difference
    const newTotal = await potionShop.getTotalPrice();
    
    // This test will FAIL because the bug exists
    // The total should increase by 10 gold (Dragon Express 15g - Owl Post 5g = 10g difference)
    // But due to the bug, delivery prices are never included in the total
    await potionShop.expectTotalPriceDifference(newTotal, initialTotal, 10);
    
    // Additional verification: log the actual values to see the bug in action
    await potionShop.logPriceComparison(
      'Delivery price change comparison',
      initialTotal,
      newTotal,
      10
    );
  });

  test('switching back to cheaper delivery should reduce total', async ({ page }) => {
    // Select a base potion
    await potionShop.selectStrengthPotion();
    
    // Start with Dragon Express (15 gold)
    await potionShop.selectDragonExpressDelivery();
    await potionShop.waitForOrderUpdate();
    
    const expensiveDeliveryTotal = await potionShop.getTotalPrice();
    
    // Switch to Owl Post (5 gold, 10 gold cheaper)
    await potionShop.selectOwlPostDelivery();
    await potionShop.waitForOrderUpdate();
    
    const cheaperDeliveryTotal = await potionShop.getTotalPrice();
    
    // This should also fail due to the same bug
    // The total should decrease by 10 gold when switching to cheaper delivery
    await potionShop.expectTotalPriceDifference(cheaperDeliveryTotal, expensiveDeliveryTotal, -10);
    
    await potionShop.logPriceComparison(
      'Cheaper delivery switch comparison',
      expensiveDeliveryTotal,
      cheaperDeliveryTotal,
      -10
    );
  });

  test('verify delivery prices are displayed correctly but not calculated', async ({ page }) => {
    // Verify that the delivery options show the correct prices in the UI
    await potionShop.verifyDeliveryPricesInUI();
    
    // Select a potion to activate the order summary
    await potionShop.selectHealingPotion();
    
    // The prices are correctly displayed in the UI, but the bug is in the calculation logic
    console.log('UI correctly shows delivery prices, but calculation logic ignores them');
  });
});