# Playwright Exploratory Bug Report

Date: March 10, 2026
Environment: Local static server, Playwright browser exploration

## Functional / Calculation Bugs

1. **Order submits without a potion selected.**
   Repro: Fill only the required delivery fields and submit.
   Actual: A confirmation modal and order number are shown while the summary still says "No potion selected".
   Reference: js/app.js:222

2. **Form reset doesn't reset order state or summary.**
   Repro: Build a non-default order, submit it, then inspect the builder and summary.
   Actual: The previously selected potion, size, potency, ingredients, quantity, subtotal, and total remain in place after submit. Only the HTML form fields are cleared.
   Reference: js/app.js:238

3. **Delivery price is never included in the total.**
   Repro: Switch from Owl Post (5 gold) to Dragon Express (15 gold) and observe the total.
   Actual: The total does not change. `updateOrderSummary()` adds only `BREWING_FEE`, never `deliveryPrice`.
   References: js/app.js:136, js/app.js:199, index.html:267, index.html:275

4. **Flask size multiplier mismatch (1.5x displayed, 1.35x charged).**
   Repro: Select Flask size and compare the displayed "1.5x price" text with the JS constant `SIZE_MULTIPLIERS.flask`.
   Actual: HTML `data-multiplier="1.5"` (used at runtime) vs JS constant `1.35` (dead code but misleading). The summary label reads "Flask (1.5x)" from HTML but the constant says 1.35.
   References: js/app.js:8, index.html:102

5. **Bottle label says "2x price" but charges 2.5x.**
   Repro: Select Bottle and compare the displayed text with the calculated price.
   Actual: Label reads `500ml · 2x price` but `data-multiplier="2.5"` and `SIZE_MULTIPLIERS.bottle = 2.5`.
   References: index.html:114, js/app.js:11

6. **Phoenix Feather displayed as +20 gold but charges 18.**
   Repro: Add Phoenix Feather and check the summary.
   Actual: Label says `+20 gold`, `data-price="18"`, summary shows 18.
   Reference: index.html:135

7. **Starlight Dew displayed as +12 gold but charges 10.**
   Repro: Add Starlight Dew and check the summary.
   Actual: Label says `+12 gold`, `data-price="10"`, summary shows 10.
   Reference: index.html:150

8. **Featured potion advertised at 34 gold but charges 36.**
   Repro: Click "Add to Order" on the featured Elixir of Eternal Focus.
   Actual: Sale price shows `34 gold` (15% off 40), but `addFeaturedToOrder()` hard-codes `featuredTotal = 36`.
   References: index.html:37-38, js/app.js:189

9. **Quantity edge cases not handled.**
   Repro: Enter `0`, `2.5`, or `100` in the quantity field.
   Actual:
   - `0` displays in the field but the summary silently uses quantity `1`.
   - `2.5` is truncated to `2` (no decimal validation/feedback).
   - `100` is priced at 100 even though the field's `max` attribute is `99`.
     References: js/app.js:130, index.html:184

10. **Ingredients not multiplied by quantity.**
    Repro: Select a potion, add Dragon Scale (+15g), set quantity to 3.
    Actual: Ingredient cost stays at 15 gold flat regardless of quantity. Expected: 45 gold for 3 potions.
    Reference: js/app.js:193

## UI / Content Bugs

11. **Featured product image broken (404).**
    Repro: Load the page and check the network/console.
    Actual: `images/featured-potion.png` returns 404.
    Reference: index.html:31

12. **Opening hours contradiction between header and footer.**
    Repro: Compare header and footer text.
    Actual: Header says "Open dawn to dusk", footer says "Open dusk to dawn".
    References: index.html:21, index.html:344

13. **Review stars nearly invisible for one review.**
    Repro: Look at the Shadow Walker Lyra review card.
    Actual: The `light-stars` CSS class sets `color: #f5f5dc` (beige), making the ★★★★★ stars hard to read against the background.
    References: index.html:322, css/style.css:825

14. **Copyright year outdated.**
    Repro: Check the footer.
    Actual: Says `© 1247-2024` but the current year is 2026.
    Reference: index.html:370

15. **Footer heading level inconsistency.**
    Repro: Inspect the footer section headings.
    Actual: "Shop Hours" uses `<h5>` while all sibling sections ("Visit Us", "Contact", "Follow Us") use `<h4>`.
    Reference: index.html:343

## Accessibility Bugs

16. **Quantity input not keyboard-reachable.**
    Repro: Tab through the page controls.
    Actual: Focus skips from the − button to the + button because the input has `tabindex="-1"`.
    Reference: index.html:184

17. **Contact Crystal field has no label.**
    Repro: Inspect the field or use a screen reader.
    Actual: The field uses an empty `<div class="label-placeholder">` instead of a `<label>`. Only placeholder text identifies it.
    References: index.html:242-243

18. **Featured image has no alt text.**
    Repro: Inspect the `<img>` element.
    Actual: `<img src="images/featured-potion.png" class="featured-image">` has no `alt` attribute.
    Reference: index.html:31

## Broken Links / Resources

19. **Wandergram footer link is dead.**
    Repro: Click Wandergram in the footer.
    Actual: Points to `https://wandergram.fake/enchanted-brew` which fails with `ERR_NAME_NOT_RESOLVED`.
    Reference: index.html:364

20. **Missing favicon produces console error.**
    Repro: Load the page and check the console.
    Actual: Browser requests `/favicon.ico` which returns 404.

## Notes

- No mobile horizontal overflow was observed at 390×844.
- Modal closing via Escape worked correctly.
- Total bugs found: **20**
