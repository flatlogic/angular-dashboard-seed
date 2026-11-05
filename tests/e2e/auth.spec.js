'use strict';

const { test, expect } = require('@playwright/test');

test('demo user can log in, navigate, and log out of the built app', async ({ page }) => {
  const pageErrors = [];
  const rejectedTransitions = [];
  page.on('console', message => { if (/Possibly unhandled rejection|\[\$injector/.test(message.text())) rejectedTransitions.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your Web App' })).toBeVisible();

  await page.getByPlaceholder('Username').fill('user1');
  await page.getByPlaceholder('Password', { exact: true }).fill('user1pass');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL(/#\/app\/dashboard$/);
  await expect(page.getByText('posts total', { exact: true })).toBeVisible();
  await page.evaluate(() => angular.element(document.querySelector('[data-ng-app]')).injector().get('$modal').open({ template: '<button ng-click="$close()">Close compatibility modal</button>' }));
  await page.getByRole('button', { name: 'Close compatibility modal', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close compatibility modal', exact: true })).toHaveCount(0);


  await page.locator('#sidebar').getByRole('link', { name: /Profile$/ }).click();
  await expect(page).toHaveURL(/#\/app\/profile$/);
  await expect(page.locator('input[name="username"]')).toHaveValue('user1');
  const email = page.locator('input[name="email"]');
  const oldEmail = await email.inputValue();
  await page.locator('input[name="password"]').fill('wrong-password');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Wrong password');
  await page.locator('input[name="password"]').fill('user1pass');
  await email.fill('security-check@example.test');
  const updated = page.waitForResponse(response => new URL(response.url()).pathname.startsWith('/api/profile') && response.request().method() === 'PUT');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  expect((await updated).status()).toBe(200);
  await expect(page.getByText('Profile changes saved', { exact: true }).first()).toBeVisible();
  await email.fill(oldEmail);
  await page.locator('input[name="password"]').fill('user1pass');
  const restored = page.waitForResponse(response => new URL(response.url()).pathname.startsWith('/api/profile') && response.request().method() === 'PUT');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  expect((await restored).status()).toBe(200);


  await page.locator('#sidebar').getByRole('link', { name: /Dashboard$/ }).click();
  await expect(page).toHaveURL(/#\/app\/dashboard$/);
  await expect(page.getByText('posts total', { exact: true })).toBeVisible();

  await page.locator('.page-controls').getByRole('link', { name: 'Logout', exact: true }).click();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your Web App' })).toBeVisible();

  await page.goto('/#/app/dashboard');
  await expect(page).toHaveURL(/#\/login$/);
  expect(pageErrors).toEqual([]);
  expect(rejectedTransitions).toEqual([]);
});
