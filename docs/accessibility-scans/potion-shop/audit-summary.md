# Accessibility Audit Report: The Enchanted Brew Shop

**URL:** http://localhost:8080 (potion-shop/index.html)
**Date:** 2026-04-02
**Standard:** WCAG 2.1 Level AA
**Tools:** axe-core v4.11 + pa11y + Lighthouse (3/3 succeeded)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Lighthouse Accessibility Score** | 86/100 |
| **Production Ready (strict AA)** | **No** |
| **Critical Violations** | 4 |
| **Serious Violations** | 1 |
| **Total Unique Violations** | 5 (deduplicated across tools) |
| **Estimated Fix Time** | ~2 hours |
| **No Videos Detected** | Video pipeline not required |

**Verdict:** The shop is close to accessible but has 4 critical violations that would block screen reader users from completing an order. All fixes are low-effort.

---

## POUR Analysis

| Principle | WCAG | Issues | Score |
|-----------|------|--------|-------|
| **Perceivable** | 1.1–1.4 | 1 (color contrast on badge) | ~90% |
| **Operable** | 2.1–2.5 | 2 (heading order, label-name mismatch on submit) | ~85% |
| **Understandable** | 3.1–3.3 | 0 | 100% |
| **Robust** | 4.1 | 1 (missing label on quantity input) | ~85% |
| **Overall** | | **4 critical, 1 serious** | **86%** |

---

## Violations by Priority (ROI-ranked)

| Rank | Violation | WCAG | Impact | Tool(s) | Users Affected | Effort | ROI Score |
|------|-----------|------|--------|---------|----------------|--------|-----------|
| 1 | Accessible name ≠ visible text on "Brew My Order" button | 2.5.3 | Critical | Lighthouse | ~8% | 0.25h | **320** |
| 2 | Missing label on quantity `#quantity` input | 4.1.2 | Critical | All 3 | ~8% | 0.5h | **160** |
| 3 | Color contrast on `.discount-badge` (3.82:1 < 4.5:1) | 1.4.3 | Serious | axe + LH | ~12% | 0.5h | **168** |
| 4 | Heading order: footer jumps from H2→H4, skipping H3 | 1.3.1 | Critical | Lighthouse | ~8% | 0.5h | **112** |
| 5 | No `<nav>` landmark (3 links, 0 nav regions) | 1.3.1 | Moderate | (structural) | ~8% | 0.25h | **64** |

---

## User Impact Summary

| Violation | Affected Groups | Experience |
|-----------|-----------------|------------|
| Submit button name mismatch | Screen reader users | BLOCKS-USAGE — SR announces "Submit" but visible label says "Brew My Order"; violates 2.5.3 label-in-name rule |
| Missing quantity label | Blind/screen reader users | IMPAIRS-USAGE — no way to understand what the number field is for without navigating context |
| Color contrast badge | Low-vision, color-blind users | IMPAIRS-USAGE — "15% OFF" badge fails 4.5:1 requirement; may be unreadable |
| Heading order skip | Screen reader users using heading navigation | MINOR — jumps from H2 to H4 in footer; disorienting when using H-key navigation |
| No nav landmark | Screen reader users | MINOR — cannot jump directly to navigation using landmark navigation |

---

## What's Working Well (axe-core: 20 passing rules)

- Single `<h1>` present
- Page language declared (`lang="en"`)
- All images have non-empty `alt` text
- Form inputs have visible `<label>` elements (except `#quantity`)
- Landmarks present: `<main>`, `<header>`, `<footer>`
- ARIA usage is minimal and correct where applied
- No keyboard traps detected
- No duplicate IDs
- No auto-playing media

---

## Recommendations (in fix order)

1. **[15 min]** Fix `aria-label` on submit button — change from `"Submit"` to match visible text
2. **[30 min]** Add `<label>` for quantity input
3. **[30 min]** Darken `.discount-badge` background color to achieve ≥4.5:1
4. **[30 min]** Change footer `<h4>` elements to `<h3>` (or add `<h3>` grouping)
5. **[15 min]** Wrap header links in `<nav aria-label="Main navigation">`
