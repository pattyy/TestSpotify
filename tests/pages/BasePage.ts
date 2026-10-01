import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string, options?: Parameters<Page['goto']>[1]): Promise<void> {
    await this.page.goto(path, options);
  }
}
