# Bootstrap 3 security backports

The `bootstrap-sass` 3.4.3 package embeds Bootstrap JavaScript 3.4.1. The npm
package version alone does not establish that this JavaScript is patched.
These unchanged MIT-licensed Debian backports address its two remaining active
advisories while preserving the Bootstrap 3 API and styles:

- `0003-CVE-2024-6485.patch`: escape `data-loading-text` before inserting it.
- `CVE-2025-1647.patch`: use DOMParser and a validated fallback for sanitization,
  preventing a clobbered document implementation from bypassing it.

Source: Debian twitter-bootstrap3 `3.4.1+dfsg-7`, downloaded from
https://deb.debian.org/debian/pool/main/t/twitter-bootstrap3/ . Archive, patch and
pristine upstream source SHA256 values plus the upstream Git commit are recorded
in `manifest.json`. Debian copyright/license information is retained here.

`node build/patch-bootstrap.cjs` verifies the exact package versions and source
hashes, applies with zero fuzz, and regenerates both bundle forms. Known patched
inputs are reversed and verified for idempotence; unexpected changes fail loudly.
Writes happen only when bytes change, so the Bower watcher cannot loop on them.
No version is fabricated, and no advisory is ignored or dismissed.

The browser payload tests first failed against pristine 3.4.1 and then pass
against distributed patched code. They cover executable loading text, sanitizer
DOM clobbering, retained safe formatting and ordinary reset behaviour.

Official status: https://security-tracker.debian.org/tracker/CVE-2024-6485 and
https://security-tracker.debian.org/tracker/CVE-2025-1647 . GitHub advisories still
refer to the original upstream version because no public upstream release was
published; the local backport is explicit rather than a claim of version-level
remediation.
