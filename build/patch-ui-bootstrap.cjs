const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { minify } = require('terser');
const inputs = require('./ui-bootstrap-inputs.json');
const before = '$http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){';
const after = '$http.get(tplUrl, {cache: $templateCache}).then(function(response){\n           var tplContent = response.data;';
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

async function patchUiBootstrap() {
  const writes = [];
  for (const [name, hashes] of Object.entries(inputs)) {
    const file = path.join('bower_components/angular-bootstrap', name + '.js');
    const source = await fs.readFile(file, 'utf8');
    const original = source.replace(after, before);
    if (digest(original) !== hashes['.js'] || original.split(before).length !== 2) {
      throw new Error('Unreviewed UI Bootstrap source: ' + file);
    }
    const patched = original.replace(before, after);
    const minified = (await minify(patched, { format: { comments: /^!|@license|@preserve|angular-ui-bootstrap/ } })).code;
    const minifiedFile = path.join('bower_components/angular-bootstrap', name + '.min.js');
    const current = await fs.readFile(minifiedFile, 'utf8');
    if (current !== minified && digest(current) !== hashes['.min.js']) {
      throw new Error('Unreviewed UI Bootstrap minified source: ' + minifiedFile);
    }
    writes.push({ file, value: patched }, { file: minifiedFile, value: minified });
  }
  for (const { file, value } of writes) await fs.writeFile(file, value);
}
module.exports = { patchUiBootstrap };
if (require.main === module) patchUiBootstrap().catch(error => { console.error(error); process.exitCode = 1; });
