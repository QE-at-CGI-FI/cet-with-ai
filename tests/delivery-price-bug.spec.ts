import { test, expect } from '@playwright/test';

test.describe('Delivery Price Bug Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the potion shop
    await page.goto('file://' + __dirname + '/../potion-shop/index.html');
  });

  test('delivery price is not included in total - Bug #3', async ({ page }) => {
    // Select a base potion to get a baseline total
    await page.locator('label:has(input[name="base-potion"][value="healing"])').click();
    
    // Wait for the order summary to update
    await page.waitForTimeout(100);
    
    // Get the initial total with Owl Post (5 gold delivery, default selected)
    const initialTotalText = await page.locator('.total-price').textContent();
    const initialTotal = parseFloat(initialTotalText?.replace(/[^\d.]/g, '') || '0');
    
    // Switch to Dragon Express (15 gold delivery, 10 gold more expensive)
    await page.locator('label:has(input[name="delivery"][value="dragon"])').click();
    
    // Wait for the order summary to update
    await page.waitForTimeout(100);
    
    // Get the new total - should be 10 gold higher due to delivery price difference
    const newTotalText = await page.locator('.total-price').textContent();
    const newTotal = parseFloat(newTotalText?.replace(/[^\d.]/g, '') || '0');
    
    // This test will FAIL because the bug exists
    // The total should increase by 10 gold (Dragon Express 15g - Owl Post 5g = 10g difference)
    // But due to the bug, delivery prices are never included in the total
    expect(newTotal).toBe(initialTotal + 10);
    
    // Additional verification: log the actual values to see the bug in action
    console.log(`Initial total with Owl Post (5g): ${initialTotal} gold`);
    console.log(`New total with Dragon Express (15g): ${newTotal} gold`);
    console.log(`Expected difference: 10 gold, Actual difference: ${newTotal - initialTotal} gold`);
  });

  test('switching back to cheaper delivery should reduce total', async ({ page }) => {
    // Select a base potion
    await page.locator('label:has(input[name="base-potion"][value="strength"])').click();
    
    // Start with Dragon Express (15 gold)
    await page.locator('label:has(input[name="delivery"][value="dragon"])').click();
    await page.waitForTimeout(100);
    
    const expensiveDeliveryTotal = parseFloat((await page.locator('.total-price').textContent())?.replace(/[^\d.]/g, '') || '0');
    
    // Switch to Owl Post (5 gold, 10 gold cheaper)
    await page.locator('label:has(input[name="delivery"][value="owl"])').click();
    await page.waitForTimeout(100);
    
    const cheaperDeliveryTotal = parseFloat((await page.locator('.total-price').textContent())?.replace(/[^\d.]/g, '') || '0');
    
    // This should also fail due to the same bug
    // The total should decrease by 10 gold when switching to cheaper delivery
    expect(cheaperDeliveryTotal).toBe(expensiveDeliveryTotal - 10);
    
    console.log(`Total with Dragon Express (15g): ${expensiveDeliveryTotal} gold`);
    console.log(`Total with Owl Post (5g): ${cheaperDeliveryTotal} gold`);
    console.log(`Expected difference: -10 gold, Actual difference: ${cheaperDeliveryTotal - expensiveDeliveryTotal} gold`);
  });

  test('verify delivery prices are displayed correctly but not calculated', async ({ page }) => {
    // Verify that the delivery options show the correct prices in the UI
    const owlPostPrice = await page.locator('input[name="delivery"][value="owl"]').getAttribute('data-price');
    const dragonExpressPrice = await page.locator('input[name="delivery"][value="dragon"]').getAttribute('data-price');
    
    expect(owlPostPrice).toBe('5');
    expect(dragonExpressPrice).toBe('15');
    
    // Select a potion and verify the UI labels match the data-price attributes
    await page.locator('label:has(input[name="base-potion"][value="healing"])').click();
    
    const owlPostLabel = await page.locator('input[name="delivery"][value="owl"] + .delivery-content .delivery-detail').textContent();
    const dragonExpressLabel = await page.locator('input[name="delivery"][value="dragon"] + .delivery-content .delivery-detail').textContent();
    
    expect(owlPostLabel).toContain('5 gold');
    expect(dragonExpressLabel).toContain('15 gold');
    
    // The prices are correctly displayed in the UI, but the bug is in the calculation logic
    console.log('UI correctly shows delivery prices, but calculation logic ignores them');
  });
});