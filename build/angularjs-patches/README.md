# AngularJS security backports

AngularJS core and ngResource use the official 1.8.3 distribution. No upstream version is fabricated. `build/patch-angularjs.cjs` verifies package identity, pristine source/minified/map SHA-256 and every patch SHA-256 before zero-fuzz application. All inputs are validated before writing; unknown edits fail loudly. Minified code and maps are regenerated, and repeated builds reverse/verify known patched inputs before applying again.

The unchanged MIT-licensed Debian patches come from angular.js `1.8.3-3`:
https://deb.debian.org/debian/pool/main/a/angular.js/angular.js_1.8.3-3.debian.tar.xz
The archive checksum is recorded in `manifest.json`; Debian copyright/license is retained.

Applied core fixes cover currency formatting (CVE-2022-25844), RegExp copying (CVE-2023-26116), URL inputs (CVE-2023-26118), srcset parsing and URI policy (CVE-2024-21490 / CVE-2024-8372 / CVE-2024-8373), and SVG image bindings (CVE-2025-0716). ngResource receives the Debian linear trailing-slash normalization fix (CVE-2023-26117). ngSanitize is not installed by this application.

The local whole-RegExp grouping fix (CVE-2026-11998) anchors both alternatives. The linear srcset compatibility scanner retains valid data-URL commas and sanitizes every URL, following https://html.spec.whatwg.org/multipage/images.html#parse-a-srcset-attribute instead of restoring the original backtracking regex. Source and patch hashes match the independently reviewed backports already used in the related Angular Material Dashboard. Primary advisory references: https://security-tracker.debian.org/tracker/CVE-2026-11998 and https://security-tracker.debian.org/tracker/CVE-2023-26117.

Real Chrome regressions exercise URL policies, SVG/source bindings, valid data srcset, large RegExp/URL/srcset/currency inputs, ngResource normalization and the existing UI Bootstrap typeahead. Build tests verify idempotence and reject modified source/minified files before writing. The current Chrome engine did not reproduce the original ngResource delay at the bounded test size; this fix uses the unchanged official Debian backport and positive API regression, without claiming a RED reproduction here.

AngularJS remains end of life. Internet Explorer is outside this tested support boundary; its textarea history-cache issue (CVE-2022-25869) remains unverified/unfixed. Current Chrome is the tested browser. Local reviewed backports do not provide ongoing upstream maintenance or a guarantee against future advisories.

# UI Bootstrap compatibility

`patch-ui-bootstrap.cjs` changes only the existing typeahead template HTTP callback from the removed `.success` API to `.then(response.data)`. The old component/directive APIs remain. Both source variants and their minified outputs are verified against `ui-bootstrap-inputs.json` and rebuilt with the original MIT license banner. Actual template lookup and option selection are covered in Chrome.
