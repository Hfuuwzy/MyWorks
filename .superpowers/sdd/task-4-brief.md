## Task 4: Drawer Search, Locale, And Theme Controls

**Files:**

- Modify: `app/components/layout/RightNavDrawer.vue`
- Modify: `app/components/ui/SearchBar.vue`
- Modify: `app/components/ui/ThemeToggle.vue`
- Create: `app/components/ui/LocaleSwitch.vue`
- Modify: `i18n/locales/zh.json`
- Modify: `i18n/locales/ja.json`

**Interfaces:**

- Consumes `SearchBar`, `ThemeToggle`, i18n composables, and drawer bottom tool group.
- Produces single-instance search, locale, and theme controls.

- [ ] **Step 1: RED browser test for single drawer tools**

Append to `tests/e2e/redesign.spec.ts`:

```ts
test('renders search locale and theme controls only inside the expanded drawer', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('drawer-search-input')).toHaveCount(0)
  await expect(page.getByTestId('locale-switch')).toHaveCount(0)
  await expect(page.getByTestId('theme-toggle')).toHaveCount(0)

  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('drawer-search-toggle').click()

  await expect(page.getByTestId('drawer-search-input')).toHaveCount(1)
  await expect(page.getByTestId('locale-switch')).toHaveCount(1)
  await expect(page.getByTestId('theme-toggle')).toHaveCount(1)
  await expect(page.getByTestId('drawer-tools').getByTestId('drawer-search-input')).toBeVisible()
})
```

Expected RED: controls absent or duplicated.

- [ ] **Step 2: RED browser test for search result paths**

Append:

```ts
test('search finds existing posts and links through the current locale', async ({ page }) => {
  await page.goto('/ja')
  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('drawer-search-toggle').click()
  await page.getByTestId('drawer-search-input').fill('Linux')

  await expect(page.getByTestId('search-result-linux-commands')).toBeVisible()
  await expect(page.getByTestId('search-result-linux-commands')).toHaveAttribute('href', '/ja/blog/linux-commands')
})
```

Expected RED: search result missing or wrong unlocalized href.

- [ ] **Step 3: RED browser test for theme behavior**

Append:

```ts
test('theme toggle preserves the existing dark-mode behavior', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('theme-toggle').click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.evaluate(() => window.localStorage.getItem('theme'))).resolves.toBe('dark')
})
```

Expected RED: theme toggle missing from drawer.

- [ ] **Step 4: Update `SearchBar.vue`**

Required changes:

- Add `compact` and `inputId` props.
- Preserve current `handleSearch`, `hideResults`, and `handleResultClick` behavior.
- Use `useLocalePath()` so result hrefs match current locale.
- Use drawer-friendly paper styling.
- Add `data-testid` values listed in this plan.
- Keep `@mousedown.prevent="handleResultClick"` for result clicks.

- [ ] **Step 5: Update `ThemeToggle.vue`**

Required changes:

- Preserve localStorage and `prefers-color-scheme`.
- Add text label.
- Add `data-testid="theme-toggle"`.
- Use SVG, no emoji.
- Keep the `.dark` class on `document.documentElement`.

- [ ] **Step 6: Create `LocaleSwitch.vue`**

Required behavior:

- Render inside drawer tools only.
- Current locale is indicated with vermilion/ink state.
- Uses `useSwitchLocalePath()` to preserve current route.
- Test ID `locale-switch`.

- [ ] **Step 7: Render drawer tools**

Modify `RightNavDrawer.vue`:

- Add bottom tool group `data-testid="drawer-tools"`.
- Add search toggle `data-testid="drawer-search-toggle"`.
- Search input is hidden until search panel is opened.
- Search panel uses `data-testid="drawer-search-panel"`.
- Add `UiLocaleSwitch`.
- Add `UiThemeToggle`.

- [ ] **Step 8: Verify drawer tools**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
5 passed
```

