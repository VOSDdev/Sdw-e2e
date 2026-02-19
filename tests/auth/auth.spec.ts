import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Authentication @auth', () => {
  test('Login page elements are visible', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.googleButton).toBeVisible();
    await expect(login.registerLink).toBeVisible();
    await expect(login.forgotLink).toBeVisible();
  });

  test('Submit button is disabled when fields are empty', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await expect(login.submitButton).toBeDisabled();
  });

  test('Submit button enables when fields are filled', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.emailInput.fill('test@example.com');
    await login.passwordInput.fill('somepassword');
    await expect(login.submitButton).toBeEnabled();
  });

  test('Login with invalid credentials stays on page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('invalid@email.com', 'wrongpassword');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/signin');
  });

  test('Register link navigates to signup', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.registerLink.click();
    await page.waitForURL('**/signup**', { timeout: 5000 });
    expect(page.url()).toContain('/signup');
  });

  test('Forgot password link navigates correctly', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.forgotLink.click();
    await page.waitForURL('**/forgot**', { timeout: 5000 });
  });

  test('Show password toggle works', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.passwordInput.fill('testpass');

    await expect(login.passwordInput).toHaveAttribute('type', 'password');
    await login.showPasswordButton.click();
    await expect(login.passwordInput).toHaveAttribute('type', 'text');
  });
});
