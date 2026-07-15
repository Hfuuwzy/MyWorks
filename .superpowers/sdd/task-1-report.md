# Task 1 Report: Test Harness And First RED Tests

## Files changed

- `package.json` — added Task 1 test scripts and dev dependencies from npm install.
- `package-lock.json` — updated by `npm install -D vitest @playwright/test`.
- `vitest.config.ts` — added unit-test harness config.
- `playwright.config.ts` — added e2e harness config.
- `tests/unit/navigation.test.ts` — added navigation RED unit tests.
- `tests/unit/articles.test.ts` — added article helper RED unit tests.
- `tests/unit/paths.test.ts` — added path helper RED unit tests.
- `tests/e2e/redesign.spec.ts` — added initial browser smoke RED test.
- `app/data/navigation.ts` — added minimal typed Task 1 RED placeholder seam.
- `app/utils/articles.ts` — added minimal typed Task 1 RED placeholder seam.
- `app/utils/paths.ts` — added minimal typed Task 1 RED placeholder seam.
- `.superpowers/sdd/task-1-report.md` — this report.

## Dependency install and audit

### Command: `npm install -D vitest @playwright/test`

- Exit code: 0
- Result excerpt:

```text
added 22 packages, and audited 1100 packages in 18s
found 0 vulnerabilities
```

### Command: `npm audit`

- Exit code: 0
- Result excerpt:

```text
found 0 vulnerabilities
```

## RED evidence

### Command: `npm run test:unit -- tests/unit/navigation.test.ts`

- Exit code: 1, expected RED.
- Failure reason: behavioral assertion; imports/config/type setup resolved.
- Excerpt:

```text
FAIL  tests/unit/navigation.test.ts > portal navigation data > keeps the spec route order and exposes eight home categories
AssertionError: expected [] to deeply equal [ 'home', 'blog', 'projects', …(7) ]
Test Files  1 failed (1)
Tests  1 failed | 1 passed (2)
```

### Command: `npm run test:unit -- tests/unit/articles.test.ts`

- Exit code: 1, expected RED.
- Failure reason: behavioral assertions for unsorted feed and empty split result; imports/config/type setup resolved.
- Excerpt:

```text
FAIL  tests/unit/articles.test.ts > article feed helpers > sorts by date descending without mutating the source array
AssertionError: expected [ '/blog/mysql-basics', …(2) ] to deeply equal [ '/blog/linux-commands', …(2) ]
FAIL  tests/unit/articles.test.ts > article feed helpers > splits a sorted feed into even primary and odd secondary columns
AssertionError: expected [] to deeply equal [ '/blog/linux-commands', …(1) ]
Test Files  1 failed (1)
Tests  2 failed (2)
```

### Command: `npm run test:unit -- tests/unit/paths.test.ts`

- Exit code: 1, expected RED.
- Failure reason: behavioral assertions for Japanese locale normalization and slug extraction; imports/config/type setup resolved.
- Excerpt:

```text
FAIL  tests/unit/paths.test.ts > locale-aware canonical content paths > strips the Japanese locale prefix before Nuxt Content lookup
AssertionError: expected '/ja/blog/mysql-basics' to be '/blog/mysql-basics'
FAIL  tests/unit/paths.test.ts > locale-aware canonical content paths > normalizes the Japanese homepage to the default canonical path
AssertionError: expected '/ja' to be '/'
FAIL  tests/unit/paths.test.ts > locale-aware canonical content paths > extracts a slug from a canonical blog path
AssertionError: expected '/blog/linux-commands' to be 'linux-commands'
Test Files  1 failed (1)
Tests  3 failed | 1 passed (4)
```

### Command: `npm run test:e2e -- tests/e2e/redesign.spec.ts`

- First run exit code: 1 due to missing Playwright Chromium executable.
- Missing-browser excerpt:

```text
Error: browserType.launch: Executable doesn't exist at C:\Users\Administrator\AppData\Local\ms-playwright\chromium_headless_shell-1228\chrome-headless-shell-win64\chrome-headless-shell.exe
Looks like Playwright was just installed or updated.
Please run the following command to download new browsers:
    npx playwright install
```

### Command: `npx playwright install chromium`

- Exit code: 0.
- Action: installed Chromium only after Playwright explicitly reported the browser was missing.
- Result excerpt:

```text
Chrome for Testing 149.0.7827.55 (playwright chromium v1228) downloaded
Chrome Headless Shell 149.0.7827.55 (playwright chromium-headless-shell v1228) downloaded
```

### Command: `npm run test:e2e -- tests/e2e/redesign.spec.ts`

- Exit code: 1, expected RED after Chromium install.
- Failure reason: behavioral/browser surface assertion; app launched and `right-nav-rail` is absent.
- Excerpt:

```text
Error: expect(locator).toBeVisible() failed
Locator: getByTestId('right-nav-rail')
Expected: visible
Timeout: 10000ms
Error: element(s) not found
Test Files: 1 failed
```

## TypeScript diagnostics

Requested diagnostics were run for every changed `.ts` file:

- `vitest.config.ts`
- `playwright.config.ts`
- `tests/unit/navigation.test.ts`
- `tests/unit/articles.test.ts`
- `tests/unit/paths.test.ts`
- `tests/e2e/redesign.spec.ts`
- `app/data/navigation.ts`
- `app/utils/articles.ts`
- `app/utils/paths.ts`

Result for each file:

```text
LSP server 'typescript' (.ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts) is NOT INSTALLED; user previously declined installation — proceed without LSP.
```

## Pure LOC review

- `vitest.config.ts`: 7 pure LOC.
- `playwright.config.ts`: 25 pure LOC.
- `tests/unit/navigation.test.ts`: 35 pure LOC.
- `tests/unit/articles.test.ts`: 38 pure LOC.
- `tests/unit/paths.test.ts`: 17 pure LOC.
- `tests/e2e/redesign.spec.ts`: 9 pure LOC.
- `app/data/navigation.ts`: 8 pure LOC.
- `app/utils/articles.ts`: 20 pure LOC.
- `app/utils/paths.ts`: 6 pure LOC.

No changed TypeScript file is over 200 pure LOC.

## Self-review against brief

- Installed only approved dev dependencies: `vitest` and `@playwright/test`.
- Used npm/package-lock, matching the existing project.
- Added exact Task 1 scripts: `test:unit`, `test:e2e`, and `test`.
- Added Vitest and Playwright config values from the brief.
- Added minimal typed placeholders so RED evidence is behavioral rather than module-resolution failure.
- Did not implement Task 2 navigation data, article sorting/splitting, or locale/path behavior.
- Did not modify Vue production surfaces, design tokens, assets, content, routes, or unrelated source files.
- Did not use `any`, `as any`, `as unknown`, suppression directives, or non-null assertions.
- No TypeScript file exceeded 200 pure LOC.

## Concerns

- TypeScript LSP diagnostics could not provide semantic diagnostics because the TypeScript LSP server is not installed and was previously declined in this environment.
- Playwright generated failure artifacts under `test-results/` during the expected RED e2e run.
