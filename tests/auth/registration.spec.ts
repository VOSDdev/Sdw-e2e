import { test, expect } from '@playwright/test';

// Registration page data-testid attributes are not yet deployed.
// These tests are ready and will pass once testids are added to the registration component.
test.describe('Registration @auth', () => {
  test.fixme('Registration form elements visible', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByTestId('registration-form')).toBeVisible();
    await expect(page.getByTestId('registration-email-input')).toBeVisible();
    await expect(page.getByTestId('registration-password-input')).toBeVisible();
    await expect(page.getByTestId('registration-confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('registration-submit-button')).toBeVisible();
    await expect(page.getByTestId('registration-google-button')).toBeVisible();
    await expect(page.getByTestId('registration-login-link')).toBeVisible();
  });

  test.fixme('Login link navigates to login page', async ({ page }) => {
    await page.goto('/register');
    await page.getByTestId('registration-login-link').click();
    await page.waitForURL('**/login**', { timeout: 5000 });
  });

  test.fixme('Password mismatch shows error', async ({ page }) => {
    await page.goto('/register');
    await page.getByTestId('registration-email-input').fill('test@test.com');
    await page.getByTestId('registration-password-input').fill('Password123!');
    await page.getByTestId('registration-confirm-password-input').fill('DifferentPass!');

    await page.getByTestId('registration-submit-button').click();
    await expect(page.getByTestId('registration-passwords-mismatch-text')).toBeVisible({ timeout: 3000 });
  });
});
