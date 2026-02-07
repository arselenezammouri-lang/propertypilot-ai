import { test, expect } from '@playwright/test';

/**
 * E2E Test: Authentication Flow
 * 
 * Testa il flusso completo:
 * 1. Signup nuovo utente
 * 2. Login
 * 3. Verifica redirect a dashboard
 */
test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('should complete signup flow', async ({ page }) => {
    // Step 1: Click "Get Started" or "Sign Up"
    const signupButton = page.getByRole('button', { name: /get started|sign up|registrati/i });
    await signupButton.first().click();
    
    // Wait for signup form
    await page.waitForURL(/signup|register|registrazione/i);
    
    // Step 2: Fill signup form
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Step 3: Submit form
    const submitButton = page.getByRole('button', { name: /sign up|registrati|crea account/i });
    await submitButton.click();
    
    // Step 4: Wait for redirect to dashboard or confirmation
    await page.waitForURL(/dashboard|confirm|verifica/i, { timeout: 10000 });
    
    // Step 5: Verify we're logged in (check for user menu or dashboard content)
    const dashboardIndicator = page.locator('text=/dashboard|benvenuto|welcome/i').first();
    await expect(dashboardIndicator).toBeVisible({ timeout: 5000 });
  });

  test('should complete login flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form (assumendo che esista un test user)
    // NOTA: In produzione, creare un test user o usare variabili d'ambiente
    const testEmail = process.env.E2E_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.E2E_TEST_PASSWORD || 'TestPassword123!';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Submit login
    const loginButton = page.getByRole('button', { name: /login|accedi|sign in/i });
    await loginButton.click();
    
    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard/i, { timeout: 10000 });
    
    // Verify we're logged in
    const dashboardContent = page.locator('text=/dashboard|benvenuto|welcome/i').first();
    await expect(dashboardContent).toBeVisible({ timeout: 5000 });
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    const loginButton = page.getByRole('button', { name: /login|accedi|sign in/i });
    await loginButton.click();
    
    // Should show error message
    const errorMessage = page.locator('text=/error|invalid|credenziali|credentials/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // Should stay on login page
    await expect(page).toHaveURL(/login/i);
  });
});
