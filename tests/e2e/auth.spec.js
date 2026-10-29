'use strict';

const { test, expect } = require('@playwright/test');

test('demo user can log in, navigate, and log out of the built app', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your Web App' })).toBeVisible();

  await page.getByPlaceholder('Username').fill('user1');
  await page.getByPlaceholder('Password', { exact: true }).fill('user1pass');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL(/#\/app\/dashboard$/);
  await expect(page.getByText('posts total', { exact: true })).toBeVisible();

  await page.locator('#sidebar').getByRole('link', { name: /Profile$/ }).click();
  await expect(page).toHaveURL(/#\/app\/profile$/);
  await expect(page.locator('input[name="username"]')).toHaveValue('user1');

  await page.locator('#sidebar').getByRole('link', { name: /Dashboard$/ }).click();
  await expect(page).toHaveURL(/#\/app\/dashboard$/);
  await expect(page.getByText('posts total', { exact: true })).toBeVisible();

  await page.locator('.page-controls').getByRole('link', { name: 'Logout', exact: true }).click();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your Web App' })).toBeVisible();

  await page.goto('/#/app/dashboard');
  await expect(page).toHaveURL(/#\/login$/);
  expect(pageErrors).toEqual([]);
});
