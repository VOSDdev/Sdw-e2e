import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

// Login page data-testid attributes are not yet deployed.
// These tests are ready and will pass once testids are added to the login component.
test.describe('Authentication @auth', () => {
  test.fixme('Login page elements are visible', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.googleButton).toBeVisible();
    await expect(login.registerLink).toBeVisible();
    await expect(login.forgotLink).toBeVisible();
  });

  test.fixme('Login with empty fields shows validation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.submitButton.click();
    expect(page.url()).toContain('/login');
  });

  test.fixme('Login with invalid credentials shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('invalid@email.com', 'wrongpassword');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test.fixme('Register link navigates to registration', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.registerLink.click();
    await page.waitForURL('**/register**', { timeout: 5000 });
    expect(page.url()).toContain('register');
  });

  test.fixme('Forgot password link navigates correctly', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.forgotLink.click();
    await page.waitForURL('**/forgot**', { timeout: 5000 });
  });

  test.fixme('Show password toggle works', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.passwordInput.fill('testpass');

    await expect(login.passwordInput).toHaveAttribute('type', 'password');

    await login.showPasswordButton.click();
    await expect(login.passwordInput).toHaveAttribute('type', 'text');
  });
});
