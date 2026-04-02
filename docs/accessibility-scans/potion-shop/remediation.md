# Accessibility Remediation Guide: The Enchanted Brew Shop

All fixes are copy-paste ready. Estimated total effort: ~2 hours.

---

## Fix 1: Submit Button — Accessible Name Mismatch (WCAG 2.5.3)

**Priority: 1 | Effort: 0.25h | Confidence: 0.99**

**Why it fails:** The button's `aria-label="Submit"` overrides the visible text "🔮 Brew My Order" for screen readers. WCAG 2.5.3 (Label in Name) requires the accessible name to *contain* the visible text. Screen readers announce "Submit" while sighted users see "Brew My Order" — two completely different experiences.

**Context:** `section.customer-info > form#order-form > div.form-actions > button.btn` (index.html:292)

```html
<!-- BEFORE (broken) -->
<button type="submit" class="btn btn-primary btn-brew" aria-label="Submit">
    🔮 Brew My Order
</button>

<!-- AFTER: Remove aria-label entirely — the visible text is descriptive enough -->
<button type="submit" class="btn btn-primary btn-brew">
    🔮 Brew My Order
</button>
```

**Rationale:** The button text "Brew My Order" is self-describing in the shop context. The emoji 🔮 is decorative. Removing `aria-label` lets screen readers read the button text directly, satisfying both 4.1.2 (name, role, value) and 2.5.3 (label in name). If you want to suppress the emoji from screen readers: `<span aria-hidden="true">🔮</span> Brew My Order`.

---

## Fix 2: Quantity Input — Missing Label (WCAG 4.1.2, A Level)

**Priority: 2 | Effort: 0.5h | Confidence: 0.99**

**Why it fails:** `<input type="number" id="quantity">` has no `<label>` and no `aria-label`. The nearby `<h3>Quantity</h3>` is a section heading, not a label — axe-core, pa11y, and Lighthouse all confirmed this violation. Screen readers cannot announce what this number field is for.

**Context:** `section.potion-builder > div.builder-section > div.quantity-selector > input#quantity` (index.html:184)

```html
<!-- BEFORE (broken) -->
<h3>Quantity</h3>
<div class="quantity-selector">
    <button class="qty-btn" onclick="changeQuantity(-1)">−</button>
    <input type="number" id="quantity" value="1" min="1" max="99">
    <button class="qty-btn" onclick="changeQuantity(1)">+</button>
</div>

<!-- AFTER: Add explicit label + improve ± buttons -->
<h3 id="quantity-heading">Quantity</h3>
<div class="quantity-selector" role="group" aria-labelledby="quantity-heading">
    <button class="qty-btn" onclick="changeQuantity(-1)"
            aria-label="Decrease quantity" type="button">−</button>
    <label for="quantity" class="visually-hidden">Number of potions</label>
    <input type="number" id="quantity" value="1" min="1" max="99"
           aria-describedby="quantity-heading">
    <button class="qty-btn" onclick="changeQuantity(1)"
            aria-label="Increase quantity" type="button">+</button>
</div>
```

**Add this CSS** (once, globally):
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Rationale:**
- `<label for="quantity">` associates the label with the input (satisfies 4.1.2)
- `visually-hidden` keeps the label off-screen so it doesn't disrupt the visual layout
- `aria-describedby="quantity-heading"` provides additional context via the "Quantity" heading
- `role="group"` + `aria-labelledby` groups the entire stepper semantically
- `aria-label` on ± buttons: "−" and "+" symbols are ambiguous; "Decrease/Increase quantity" is unambiguous
- `type="button"` prevents accidental form submission on Enter

---

## Fix 3: Discount Badge — Color Contrast (WCAG 1.4.3)

**Priority: 3 | Effort: 0.5h | Confidence: 0.99**

**Why it fails:** `.discount-badge` has white text (`#ffffff`) on red background (`#e74c3c`) = **3.82:1 contrast ratio**. WCAG 1.4.3 requires 4.5:1 for normal-size text (14.4px bold is normal text, not large text).

**Context:** `main > section.featured-section > div.featured-potion > div.discount-badge` (index.html:30)

```html
<!-- HTML unchanged: <div class="discount-badge">15% OFF</div> -->
```

```css
/* BEFORE */
.discount-badge {
  background-color: #e74c3c;  /* contrast 3.82:1 — FAIL */
  color: #ffffff;
}

/* AFTER — Option A: Darken red to achieve ≥4.5:1 (minimal visual change) */
.discount-badge {
  background-color: #c0392b;  /* contrast 5.10:1 — PASS AA */
  color: #ffffff;
}

/* AFTER — Option B: White background with dark red text (max contrast) */
.discount-badge {
  background-color: #ffffff;
  color: #c0392b;             /* contrast 5.10:1 — PASS AA */
  border: 1px solid #c0392b;
}
```

**Contrast ratios by color:**
| Background | Text | Ratio | Status |
|------------|------|-------|--------|
| `#e74c3c` (original) | `#ffffff` | 3.82:1 | FAIL AA |
| `#c0392b` (darker red) | `#ffffff` | 5.10:1 | PASS AA |
| `#96281b` (dark red) | `#ffffff` | 7.20:1 | PASS AAA |

---

## Fix 4: Footer Heading Hierarchy — Skipped Levels (WCAG 1.3.1)

**Priority: 4 | Effort: 0.5h | Confidence: 0.95**

**Why it fails:** The page heading hierarchy jumps from `<h2>` (last main-content heading: "Customer Reviews") directly to `<h4>` in the footer. Lighthouse flags this as a sequentially non-descending heading order.

**Context:** `footer.site-footer > div.footer-content > div.footer-section > h4` (index.html:343–362)

```html
<!-- BEFORE (broken): Footer headings are h4, skipping h3 -->
<div class="footer-section">
    <h4>Shop Hours</h4>
    ...
</div>
<div class="footer-section">
    <h4>Visit Us</h4>
    ...
</div>
<div class="footer-section">
    <h4>Contact</h4>
    ...
</div>
<div class="footer-section">
    <h4>Follow Us</h4>
    ...
</div>

<!-- AFTER: Change to h3 — footer sections are direct children of the document -->
<div class="footer-section">
    <h3>Shop Hours</h3>
    ...
</div>
<div class="footer-section">
    <h3>Visit Us</h3>
    ...
</div>
<div class="footer-section">
    <h3>Contact</h3>
    ...
</div>
<div class="footer-section">
    <h3>Follow Us</h3>
    ...
</div>
```

**Updated heading structure after fix:**
```
h1: The Enchanted Brew Shop
├── h2: Elixir of Eternal Focus (featured)
├── h2: 🧪 Craft Your Potion
│   ├── h3: Choose Your Base Potion
│   ├── h3: Select Size
│   ├── h3: Add Special Ingredients
│   ├── h3: Choose Potency
│   └── h3: Quantity
├── h2: 📜 Order Summary
├── h2: 📋 Delivery Details
├── h2: Order Confirmed! (modal)
├── h2: ⭐ Customer Reviews
└── footer
    ├── h3: Shop Hours       ← was h4
    ├── h3: Visit Us         ← was h4
    ├── h3: Contact          ← was h4
    └── h3: Follow Us        ← was h4
```

**CSS:** If footer headings are styled via `h4 { }`, update the selector to `footer h3` or add a class.

---

## Fix 5: Navigation Landmark (WCAG 1.3.1)

**Priority: 5 | Effort: 0.25h | Confidence: 0.90**

**Why it flags:** The page has 3 links in the header but no `<nav>` landmark. Screen reader users relying on landmark navigation (NVDA: D key, VoiceOver rotor) cannot jump directly to the navigation. Not flagged by automated tools but identified from page structure (`nav: 0` in pageInfo).

**Context:** Header area containing the 3 links (index.html header section)

```html
<!-- BEFORE: Links not wrapped in nav -->
<header class="shop-header">
    <div class="header-content">
        <h1 class="shop-name">The Enchanted Brew Shop</h1>
        <!-- links here -->
    </div>
</header>

<!-- AFTER: Wrap navigation links in <nav> -->
<header class="shop-header">
    <div class="header-content">
        <h1 class="shop-name">The Enchanted Brew Shop</h1>
        <nav aria-label="Main navigation">
            <!-- existing links -->
        </nav>
    </div>
</header>
```

---

## Testing Checklist

After applying all fixes, verify:

- [ ] Tab through entire page — all interactive elements reachable in logical order
- [ ] Screen reader (VoiceOver: Cmd+F5 on Mac) announces submit button as "Brew My Order" (not "Submit")
- [ ] Screen reader announces quantity field as "Number of potions" with context "Quantity"
- [ ] Screen reader announces decrease/increase buttons by purpose, not just "minus/plus"
- [ ] "15% OFF" badge is visually readable (test at 100% zoom on uncalibrated monitor)
- [ ] Heading navigation (VoiceOver rotor → Headings) shows logical h1 → h2 → h3 hierarchy with no gaps
- [ ] `<nav>` region appears in VoiceOver rotor Landmarks list
- [ ] All fixes pass in axe DevTools browser extension
