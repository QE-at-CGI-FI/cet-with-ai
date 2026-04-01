import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PotionShopPage extends BasePage {
  // Base potion locators
  readonly healingPotionOption: Locator;
  readonly strengthPotionOption: Locator;
  readonly wisdomPotionOption: Locator;
  readonly invisibilityPotionOption: Locator;
  
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
    this.invisibilityPotionOption = this.page.locator('label:has(input[name="base-potion"][value="invisibility"])');
    
    this.owlPostDelivery = this.page.locator('label:has(input[name="delivery"][value="owl"])');
    this.dragonExpressDelivery = this.page.locator('label:has(input[name="delivery"][value="dragon"])');
    
    this.totalPrice = this.page.locator('.total-price');
  }

  async navigateToPotionShop() {
    const potionShopUrl = 'file://' + __dirname + '/../../potion-shop/index.html';
    await super.navigateTo(potionShopUrl);
  }

  async selectBasePotionByValue(value: 'healing' | 'strength' | 'wisdom' | 'invisibility') {
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

  async selectInvisibilityPotion() {
    await this.invisibilityPotionOption.click();
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

  // Quantity controls
  async clickQuantityIncrease() {
    await this.page.locator('.qty-btn', { hasText: '+' }).click();
  }

  async clickQuantityDecrease() {
    await this.page.locator('.qty-btn', { hasText: '−' }).click();
  }

  async getQuantityValue(): Promise<number> {
    const val = await this.page.locator('#quantity').inputValue();
    return parseInt(val);
  }

  // Featured potion
  async clickAddFeaturedToOrder() {
    await this.page.locator('.btn-featured').click();
  }

  async getFeaturedButtonText(): Promise<string | null> {
    return await this.page.locator('.btn-featured').textContent();
  }

  async isFeaturedButtonDisabled(): Promise<boolean> {
    return await this.page.locator('.btn-featured').isDisabled();
  }

  // Order form
  async fillOrderForm(name: string, castle: string, kingdom: string) {
    await this.page.fill('#customer-name', name);
    await this.page.fill('#castle-name', castle);
    await this.page.fill('#kingdom', kingdom);
  }

  async submitOrder() {
    await this.page.locator('.btn-brew').click();
  }

  // Confirmation modal
  async isModalVisible(): Promise<boolean> {
    return await this.page.locator('#confirmation-modal').evaluate(
      el => el.classList.contains('active')
    );
  }

  async getOrderNumber(): Promise<string | null> {
    return await this.page.locator('#order-number').textContent();
  }

  async getDeliveryEstimate(): Promise<string | null> {
    return await this.page.locator('#delivery-estimate').textContent();
  }

  async closeModalViaXButton() {
    await this.page.locator('.modal-close').click();
  }

  async closeModalViaContinueShopping() {
    await this.page.locator('.modal-content .btn-primary').click();
  }

  async closeModalViaEscape() {
    await this.page.keyboard.press('Escape');
  }

  async closeModalViaOutsideClick() {
    await this.page.locator('#confirmation-modal').click({ position: { x: 5, y: 5 } });
  }
}