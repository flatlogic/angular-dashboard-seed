'use strict'

const { test, expect } = require('@playwright/test')

test.use({ hasTouch: true })

test('touch gestures open and close the production sidebar', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByPlaceholder('Username').fill('user1')
  await page.getByPlaceholder('Password', { exact: true }).fill('user1pass')
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page).toHaveURL(/#\/app\/dashboard$/)
  await expect(page.getByText('posts total', { exact: true })).toBeVisible()
  const input = await page.context().newCDPSession(page)
  for (const [start, end, shown] of [
    [500, 700, true],
    [700, 500, false]
  ]) {
    await input.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: start, y: 250 }]
    })
    await input.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: end, y: 250 }]
    })
    await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    if (shown) {
      await expect(page.locator('body')).toHaveClass(/nav-shown/)
    } else {
      await expect(page.locator('body')).not.toHaveClass(/nav-shown/)
    }
  }
  await input.detach()
  expect(errors).toEqual([])
})
