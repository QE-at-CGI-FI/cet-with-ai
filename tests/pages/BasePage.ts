import { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string | null> {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async takeScreenshot(options?: { name?: string; fullPage?: boolean }) {
    const screenshotOptions = {
      fullPage: options?.fullPage ?? false,
      ...options
    };
    return await this.page.screenshot(screenshotOptions);
  }
}