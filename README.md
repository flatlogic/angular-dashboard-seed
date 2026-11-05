# angular-dashboard-seed
Angular dashboard sample application with nodejs REST backend integration built using latest angular best practices. 

This seed is a sort of free version of a template that may be found [here](http://bootstrapbay.com/) or [here](http://themeforest.net/category/site-templates/admin-templates) with **working backend integration**. 
You may use it to bootstrap the development of your next web app. Ok, so basically, this project is a hack ;)

Check out the [Live Demo](http://angular-dashboard-seed.flatlogic.com). Use following credentials: <b>user1</b>/<b>user1pass</b>.

## Features
* AngularJS
* Angular UI Router
* Bootstrap3
* Nodejs backend inegration
* Sass styles
* Gulp build
* Stylish, clean, responsive layout
* Lots of utility css classes for rapid development (flatlogic css set)
* Authentication and authorization
* CRUD operations examples
* Browsersync for the ease of development
* Toastr notifications

## Setup

### Required tools
* [Node.js 22.13 or later and npm](https://nodejs.org)
* [Bower](http://bower.io)
* Chrome or Chromium for the browser unit tests (set `CHROME_BIN` if needed)

Gulp 5 and Dart Sass are installed locally by npm; Ruby Sass and node-sass are no longer required.

### Installation
```sh
git clone https://github.com/flatlogic/angular-dashboard-seed.git
cd angular-dashboard-seed
npm ci
npm run install:client
npm run build
npm start
```

Open [http://localhost:4300](http://localhost:4300) and log in with `user1` / `user1pass`.
For development with file watching, run `npx gulp serve` and open [http://localhost:3000](http://localhost:3000).

The server serves `dist/`. The November browser dependency followup regenerates those tracked production files from the verified build; rebuild after changing source or dependencies. `npm run install:client` explicitly installs the existing Bower packages; it no longer runs automatically during a server dependency installation. An API-only installation can use `npm ci --omit=dev`; serving the browser app still requires a separately built `dist/`.

### Verification

```sh
npm test                 # HTTP login/logout, session rotation, parser limits and error handling
npm run test:client      # AngularJS unit tests in ChromeHeadless
npm run build
npm run test:build       # Template-cache URLs and generated asset references
npm run test:e2e         # Built app login, navigation and logout in local Chrome
npm run lint            # ESLint checks for browser source files
npm audit               # Runtime and development dependencies
```

### Security dependency update (2026-10-29)

The backend uses Express 4.22.3, body-parser 1.20.9 and Passport 0.7.0. Logout waits for Passport's asynchronous callback and forwards session-store errors. HTTP regression tests verify that cookies from before login and before logout no longer grant access. Unused `express-validator` and `method-override` dependencies were removed, along with their vulnerable transitive packages.

Sources: [Express 4.22.3 release](https://github.com/expressjs/express/releases/tag/v4.22.3), [body-parser 1.20.9 security advisory](https://github.com/expressjs/body-parser/security/advisories/GHSA-27r3-jxmh-p828), [Passport migration notes](https://github.com/jaredhanson/passport/blob/master/CHANGELOG.md), [Gulp task composition](https://gulpjs.com/docs/en/api/series/), [gulp-sass compiler setup](https://github.com/dlmanning/gulp-sass#basic-usage).

Verified with Node.js 22.23.0 and npm 10.9.8: clean `npm ci`, Bower installation, Gulp build, ESLint, 4 HTTP tests, 2 browser unit tests, 8 build checks and a Playwright end-to-end test in local Chrome. Run `npm run build` before the build and end-to-end tests.

At verification time, the full `npm audit` reported **0 vulnerabilities**, including development dependencies. Gulp and its plugins were updated, JSCS/JSHint were replaced with ESLint, and the broken Protractor example was replaced with a real Playwright test. Angular dependency annotation now uses `ng-annotate-patched` directly, avoiding the vulnerable old Gulp wrapper. Gulp's `deploy` task uses `gh-pages`; running it builds and publishes `dist/` to the remote `gh-pages` branch.

The obsolete binary image optimizers were removed. The build copies image assets unchanged, without optimization; fonts and other binary assets are also preserved byte for byte. Optimize images separately before adding them to the application. The npm graph still contains deprecated AngularJS-era tooling; a clean audit describes known advisories at verification time and does not imply ongoing support for those packages.

This remains a demonstration application with hardcoded sample users, plaintext in-memory passwords, a public demo session secret and Express MemoryStore. Dependency updates do not make that authentication setup suitable for production. AngularJS 1.3 remains outside npm's audit coverage; the browser dependency followup below updates jQuery and patches Bootstrap 3. Dart Sass emits deprecation warnings for the existing Bootstrap/Sass sources.

## Project structure
Project structure based on [this yeoman generator](https://github.com/Swiip/generator-gulp-angular). If you have any questions about the build or project structure please check out their documentation.

## Support
For any additional information please refer to [Flatlogic homepage](http://flatlogic.com). 

## Community
- [Tweet about it](https://twitter.com/intent/tweet?text=Amazing%20dashboard%20built%20with%20NodeJS,%20Angular%20and%20Bootstrap!&url=https://github.com/flatlogic/angular-dashboard-seed&via=flatlogicinc) to support revolution in classic paid templates market.
- Follow [@flatlogicinc on Twitter](https://twitter.com/flatlogicinc).
- Subscribe to Flatlogic newsletter at [flatlogic.com](http://flatlogic.com/)
- Let's discuss: [![Join the chat at https://gitter.im/flatlogic/angular-dashboard-seed](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/flatlogic/angular-dashboard-seed)

## License

[MIT](https://github.com/flatlogic/angular-dashboard-seed/blob/master/LICENSE), hell yeah.

The November 2026 build correction explicitly includes dot directories in Gulp
filters. This is required when a checkout lives beneath `.codex`: a fresh build
must fingerprint/minify its assets, rewrite CSS font URLs, and copy binary fonts.
Build checks assert fingerprints, resolved CSS URLs, and source-identical bytes
instead of accepting stale files from the historical `dist` directory.
Scoped Minimatch 11 resolutions cover ESLint/config-array and nodemon's existing
named APIs; lint and watch/ignore regression checks verify compatibility. No
advisories are ignored. The browser dependency followup regenerates the tracked production `dist`
from the verified build and removes obsolete bundle hashes. Rebuild after
source changes before serving or testing the built application.

### Browser dependency followup (2026-11-05)

jQuery is pinned to 3.7.1, TouchSwipe to 1.6.19, and Bootstrap Sass to 3.4.3.
The last package embeds Bootstrap JavaScript 3.4.1, so installation and every
build apply the official Debian CVE-2024-6485 / CVE-2025-1647 backports.
[Patch provenance and exact source/patch checksums](build/bootstrap-patches/README.md)
are checked before zero-fuzz application; unknown inputs fail loudly. Both raw
and minified bundles are patched, without fabricating an upstream version.

The production browser checks exercise malicious loading text and tooltip DOM
clobbering against the actual fingerprinted vendor bundle, real Chrome touch
input through TouchSwipe, and login/profile/navigation/logout. The build checks
also reject modified patch inputs and verify idempotence. The tracked production `dist` is regenerated from this verified build, with
obsolete bundle hashes removed; rebuild after source changes.

The subsequent runtime update below replaces AngularJS 1.3 with 1.8.3 and
reviewed security backports. Bootstrap 3 and AngularJS remain end of life.


### AngularJS runtime update (2026-11-05)

AngularJS, ngResource, ngAnimate and browser mocks now use 1.8.3. The reviewed Debian/core/resource patches in [the backport manifest](build/angularjs-patches/README.md) apply at client installation and every build. Both source and minified output are verified, and the tracked production `dist/` is refreshed; old vulnerable bundle hashes are removed.

Own HTTP callbacks use `.then` with the original response/data contract and visible profile errors. The existing UI Bootstrap typeahead receives a bounded, checksummed promise-API adaptation. UI-Router uses the official npm-published 1.1.2 archive because the old Bower mirror stops at 1.0.30; the bundled core 6.1.2 includes the publisher's URL-matcher ReDoS fix. Its official state-events module preserves authentication guards and navigation events. `hashPrefix('')` preserves the existing `#/...` URLs. See [publisher release](https://github.com/angular-ui/ui-router/releases/tag/1.1.2) and [state-events migration](https://ui-router.github.io/guide/ng1/migrate-to-1_0#state-change-events).

Validation: clean strict `npm ci`, client installation, full npm audit 0, build, 4 HTTP tests, 10 build checks, 2 Chrome unit tests and 13 Chrome scenarios. The browser regression includes login/logout/protected routing, wrong-password feedback, real profile PUT/save/restore, modal open/close, typeahead, actual touch gestures, Bootstrap and Angular security policies, large-input checks and router regex parameters. Internet Explorer is outside the tested boundary; its remaining AngularJS issue is not claimed fixed. No deployment.
