const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const { applyPatch, parsePatch, reversePatch } = require('diff')
const { minify } = require('terser')
const manifest = require('./bootstrap-patches/manifest.json')
const banner =
  '/*! Bootstrap 3.4.1 with Debian CVE-2024-6485 and CVE-2025-1647 backports; see build/bootstrap-patches. */\n'

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

function verify(text, expected, label) {
  if (sha256(text) !== expected) {
    throw new Error(
      'Bootstrap patch input mismatch: ' +
        label +
        '. Reinstall the pinned package and review its source before changing checksums.'
    )
  }
}

async function writeChanged(filename, before, after) {
  if (before !== after) {
    await fs.writeFile(filename, after)
  }
}

async function patchBootstrap(directory = 'bower_components/bootstrap-sass') {
  const metadata = JSON.parse(await fs.readFile(path.join(directory, 'package.json'), 'utf8'))
  const expectedPackage = manifest.package
  const expectedVersion = manifest.version
  if (metadata.name !== expectedPackage || metadata.version !== expectedVersion) {
    throw new Error(
      'Bootstrap patches require the reviewed ' + expectedPackage + ' ' + expectedVersion
    )
  }
  const entries = []
  for (const plugin of manifest.plugins) {
    const patchText = await fs.readFile(
      path.join(__dirname, 'bootstrap-patches', plugin.patch),
      'utf8'
    )
    verify(patchText, plugin.patchSha256, plugin.patch)
    const [patch] = parsePatch(patchText)
    const pluginDirectory = 'assets/javascripts/bootstrap'
    const filename = path.join(directory, pluginDirectory, plugin.name + '.js')
    const current = await fs.readFile(filename, 'utf8')
    let original = current
    if (sha256(current) !== plugin.sourceSha256) {
      original = applyPatch(current, reversePatch(patch), { fuzzFactor: 0 })
      if (original === false) {
        throw new Error('Bootstrap plugin has unexpected changes: ' + plugin.name)
      }
    }
    verify(original, plugin.sourceSha256, plugin.name)
    const patched = applyPatch(original, patch, { fuzzFactor: 0 })
    if (patched === false) {
      throw new Error('Debian patch could not be applied exactly: ' + plugin.patch)
    }
    entries.push({ filename, current, original, patched })
  }

  const bundleFile = path.join(directory, 'assets/javascripts/bootstrap.js')
  const currentBundle = await fs.readFile(bundleFile, 'utf8')
  let originalBundle = currentBundle
  if (originalBundle.startsWith(banner)) {
    originalBundle = originalBundle.slice(banner.length)
    for (const entry of entries) {
      originalBundle = originalBundle.replace(entry.patched, entry.original)
    }
  }
  verify(originalBundle, manifest.bundleSha256, 'bootstrap.js')
  let patchedBundle = originalBundle
  for (const entry of entries) {
    patchedBundle = patchedBundle.replace(entry.original, entry.patched)
  }
  patchedBundle = banner + patchedBundle
  const minified = (await minify(patchedBundle, { format: { comments: /^!|@license|@preserve/ } }))
    .code
  const minifiedFile = bundleFile.replace(/\.js$/, '.min.js')
  const currentMinified = await fs.readFile(minifiedFile, 'utf8')
  if (currentMinified !== minified) {
    verify(currentMinified, manifest.minifiedSha256, 'bootstrap.min.js')
  }

  for (const entry of entries) {
    await writeChanged(entry.filename, entry.current, entry.patched)
  }
  await writeChanged(bundleFile, currentBundle, patchedBundle)
  await writeChanged(minifiedFile, currentMinified, minified)
}

async function patchInstalledBootstrap() {
  await patchBootstrap()
}

module.exports = { patchBootstrap, patchInstalledBootstrap }

if (require.main === module) {
  patchInstalledBootstrap().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
