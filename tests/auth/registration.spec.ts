import { test, expect } from '@playwright/test';
import { URLS } from '../../fixtures/test-data';

test.describe('Registration @auth', () => {
  test('Registration form elements visible', async ({ page }) => {
    await page.goto(URLS.register);

    await expect(page.getByTestId('registration-form')).toBeVisible();
    await expect(page.getByTestId('registration-email-input')).toBeVisible();
    await expect(page.getByTestId('registration-password-input')).toBeVisible();
    await expect(page.getByTestId('registration-confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('registration-submit-button')).toBeVisible();
    await expect(page.getByTestId('registration-google-button')).toBeVisible();
    await expect(page.getByTestId('registration-login-link')).toBeVisible();
  });

  test('Submit button is disabled when fields are empty', async ({ page }) => {
    await page.goto(URLS.register);
    await expect(page.getByTestId('registration-submit-button')).toBeDisabled();
  });

  test('Login link navigates to signin page', async ({ page }) => {
    await page.goto(URLS.register);
    await page.getByTestId('registration-login-link').locator('a').click();
    await page.waitForURL('**/signin**', { timeout: 5000 });
  });

  test('Password mismatch shows error', async ({ page }) => {
    await page.goto(URLS.register);
    await page.getByTestId('registration-email-input').fill('test@test.com');
    await page.getByTestId('registration-password-input').fill('Password123!');
    await page.getByTestId('registration-confirm-password-input').fill('DifferentPass!');
    // Submit may be disabled due to mismatch, check for error text
    await expect(page.getByTestId('registration-passwords-mismatch-text')).toBeVisible({ timeout: 3000 });
  });
});
