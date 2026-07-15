## Task 3: Right Fixed Rail And Accessible Drawer

**Files:**

- Modify: `app/layouts/default.vue`
- Create: `app/components/layout/RightNavRail.vue`
- Create: `app/components/layout/RightNavDrawer.vue`
- Create: `app/components/icons/PaperIcons.vue`

**Interfaces:**

- Consumes `portalNavItems` from `app/data/navigation.ts`.
- Produces the global shell and drawer behavior used by every route.

- [ ] **Step 1: RED browser drawer behavior test**

Append to `tests/e2e/redesign.spec.ts`:

```ts
test('opens and closes the right drawer with keyboard, overlay, and Escape', async ({ page }) => {
  await page.goto('/')

  const menuButton = page.getByTestId('right-nav-menu-button')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

  await menuButton.press('Enter')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('right-nav-drawer')).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await menuButton.click()
  await page.getByTestId('right-nav-overlay').click({ position: { x: 10, y: 10 } })
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
})
```

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected RED:

```text
failed because right-nav-menu-button is missing
```

- [ ] **Step 2: Implement shell state in default layout**

Modify `app/layouts/default.vue`:

- Root wrapper test ID: `site-shell`.
- Main test ID: `site-main`.
- Remove `LayoutSidebar` and `LayoutHeader`.
- Use `LayoutRightNavRail` and `LayoutRightNavDrawer`.
- Keep `LayoutFooter` and `UiScrollToTop`.
- Use `const navOpen = ref(false)`.
- Close drawer after route changes with `watch(() => route.fullPath, () => { navOpen.value = false })`.

- [ ] **Step 3: Implement `RightNavRail.vue`**

Required behavior:

- `position: fixed; inset-block: 0; inset-inline-end: 0`.
- Width uses CSS var with responsive breakpoints.
- Button hit area at least `44px`.
- Three-line SVG changes to close SVG when open.
- Uses vertical brand text, not a logo image.
- No search/theme/locale controls in rail.

- [ ] **Step 4: Implement `RightNavDrawer.vue`**

Required behavior:

- Renders overlay and drawer only once in DOM.
- Uses `portalNavItems` order.
- Uses `useLocalePath()` for every route link.
- Active item is indicated with vermilion stamp dot and ink emphasis.
- Focus trap:
  - On open, store `document.activeElement`.
  - Focus first drawer nav link.
  - On Tab at last focusable, wrap to first.
  - On Shift+Tab at first focusable, wrap to last.
  - On close, restore previous focused button if still connected.
- Body lock:
  - Set `document.body.style.overflow = 'hidden'` while open.
  - Restore prior body overflow value on close and unmount.
- Escape closes.
- Overlay click closes.
- Reduced motion uses near-zero transition through CSS media query.

- [ ] **Step 5: Verify drawer browser test**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected for tests added so far:

```text
2 passed
```

