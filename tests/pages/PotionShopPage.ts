import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PotionShopPage extends BasePage {
  // Base potion locators
  readonly healingPotionOption: Locator;
  readonly strengthPotionOption: Locator;
  readonly wisdomPotionOption: Locator;
  readonly speedPotionOption: Locator;
  
  // Delivery option locators
  readonly owlPostDelivery: Locator;
  readonly dragonExpressDelivery: Locator;
  
  // Price and total locators
  readonly totalPrice: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize locators after super constructor sets this.page
    this.healingPotionOption = this.page.locator('label:has(input[name="base-potion"][value="healing"])');
    this.strengthPotionOption = this.page.locator('label:has(input[name="base-potion"][value="strength"])');
    this.wisdomPotionOption = this.page.locator('label:has(input[name="base-potion"][value="wisdom"])');
    this.speedPotionOption = this.page.locator('label:has(input[name="base-potion"][value="speed"])');
    
    this.owlPostDelivery = this.page.locator('label:has(input[name="delivery"][value="owl"])');
    this.dragonExpressDelivery = this.page.locator('label:has(input[name="delivery"][value="dragon"])');
    
    this.totalPrice = this.page.locator('.total-price');
  }

  async navigateToPotionShop() {
    const potionShopUrl = 'file://' + __dirname + '/../../potion-shop/index.html';
    await super.navigateTo(potionShopUrl);
  }

  async selectBasePotionByValue(value: 'healing' | 'strength' | 'wisdom' | 'speed') {
    const locator = this.page.locator(`label:has(input[name="base-potion"][value="${value}"])`);
    await locator.click();
  }

  async selectHealingPotion() {
    await this.healingPotionOption.click();
  }

  async selectStrengthPotion() {
    await this.strengthPotionOption.click();
  }

  async selectWisdomPotion() {
    await this.wisdomPotionOption.click();
  }

  async selectSpeedPotion() {
    await this.speedPotionOption.click();
  }

  async selectOwlPostDelivery() {
    await this.owlPostDelivery.click();
  }

  async selectDragonExpressDelivery() {
    await this.dragonExpressDelivery.click();
  }

  async selectDeliveryByValue(value: 'owl' | 'dragon') {
    const locator = this.page.locator(`label:has(input[name="delivery"][value="${value}"])`);
    await locator.click();
  }

  async waitForOrderUpdate(waitTime: number = 100) {
    await this.page.waitForTimeout(waitTime);
  }

  async getTotalPrice(): Promise<number> {
    const totalText = await this.totalPrice.textContent();
    return parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
  }

  async getTotalPriceText(): Promise<string | null> {
    return await this.totalPrice.textContent();
  }

  async getDeliveryPrice(deliveryType: 'owl' | 'dragon'): Promise<string | null> {
    const priceAttribute = await this.page
      .locator(`input[name="delivery"][value="${deliveryType}"]`)
      .getAttribute('data-price');
    return priceAttribute;
  }

  async getDeliveryLabelText(deliveryType: 'owl' | 'dragon'): Promise<string | null> {
    const labelText = await this.page
      .locator(`input[name="delivery"][value="${deliveryType}"] + .delivery-content .delivery-detail`)
      .textContent();
    return labelText;
  }

  async verifyDeliveryPricesInUI() {
    const owlPostPrice = await this.getDeliveryPrice('owl');
    const dragonExpressPrice = await this.getDeliveryPrice('dragon');
    
    expect(owlPostPrice).toBe('5');
    expect(dragonExpressPrice).toBe('15');

    const owlPostLabel = await this.getDeliveryLabelText('owl');
    const dragonExpressLabel = await this.getDeliveryLabelText('dragon');
    
    expect(owlPostLabel).toContain('5 gold');
    expect(dragonExpressLabel).toContain('15 gold');
  }

  async logPriceComparison(description: string, price1: number, price2: number, expectedDifference: number) {
    console.log(`${description}:`);
    console.log(`  Price 1: ${price1} gold`);
    console.log(`  Price 2: ${price2} gold`);
    console.log(`  Expected difference: ${expectedDifference} gold`);
    console.log(`  Actual difference: ${price2 - price1} gold`);
  }

  async expectTotalPriceDifference(currentTotal: number, previousTotal: number, expectedDifference: number) {
    expect(currentTotal).toBe(previousTotal + expectedDifference);
  }
}