import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly linkPassword: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-username');
    this.continueButton = page.getByTestId('login-button');
    this.linkPassword = page.getByRole('link', { name: 'Log in with a password' });
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log In', exact: true });
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await super.goto('/login', { waitUntil: 'networkidle' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();

    // After Continue, Spotify either redirects to the OTP page
    // (/login/otp?flow_ctx=...) or re-renders /login with an alert, e.g.
    // "Oops! Something went wrong". Race the two so we wait for the real
    // expected redirect and fail fast with a clear message if it's
    // rejected instead, rather than blindly clicking linkPassword.
    // An empty <div role="alert"> is present in the DOM as soon as the
    // page renders (before any real error text is set), so filter for
    // actual text content — otherwise the race resolves on that empty
    // placeholder instead of a genuine error. Spotify may also redirect
    // to a challenge.spotify.com reCAPTCHA page when it flags the
    // browser as automated; detect that too so it fails with a clear
    // message instead of timing out waiting for the OTP redirect.
    const otpRedirect = this.page.waitForURL(/\/login\/otp(\?|$)/);
    const errorVisible = this.errorMessage.filter({ hasText: /\S/ }).waitFor({ state: 'visible' });
    const challengeRedirect = this.page.waitForURL(/challenge\.spotify\.com/);

    const outcome = await Promise.race([
      otpRedirect.then(() => 'otp' as const),
      errorVisible.then(() => 'error' as const),
      challengeRedirect.then(() => 'challenge' as const),
    ]);

    // Promise.race doesn't cancel the losers; swallow their eventual
    // timeout rejections so they don't surface as unhandled rejections.
    otpRedirect.catch(() => {});
    errorVisible.catch(() => {});
    challengeRedirect.catch(() => {});

    if (outcome === 'error') {
      const message = await this.getErrorMessage();
      throw new Error(`Spotify rejected the login after clicking Continue: "${message}"`);
    }

    if (outcome === 'challenge') {
      throw new Error(
        `Spotify redirected to a reCAPTCHA challenge (${this.page.url()}) after clicking Continue — ` +
          'it flagged the automated browser and requires solving a CAPTCHA, which cannot be automated here.'
      );
    }

    await this.linkPassword.click();
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
