'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4300',
    channel: 'chrome',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:4300',
    env: { PORT: '4300' }
  }
});
