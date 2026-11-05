'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { patchBootstrap } = require('../../build/patch-bootstrap.cjs')

test('Bootstrap security backports are idempotent and reject modified inputs', async (context) => {
  const dir = fs.mkdtempSync(path.join(process.cwd(), '.bootstrap-patch-'))
  context.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const files = [
    'package.json',
    'assets/javascripts/bootstrap.js',
    'assets/javascripts/bootstrap.min.js',
    'assets/javascripts/bootstrap/button.js',
    'assets/javascripts/bootstrap/tooltip.js'
  ]
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.copyFileSync(path.join('bower_components/bootstrap-sass', file), path.join(dir, file))
  }
  const before = files.map((file) => fs.readFileSync(path.join(dir, file)))
  await patchBootstrap(dir)
  files.forEach((file, index) =>
    assert.deepEqual(fs.readFileSync(path.join(dir, file)), before[index])
  )
  fs.appendFileSync(path.join(dir, files[3]), '\n// unexpected source\n')
  await assert.rejects(patchBootstrap(dir), /input mismatch|unexpected changes/)
})
