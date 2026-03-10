# Tester-Oriented Feature Checklist

This checklist covers the landing page in `index.html` and the Potion Shop app in `potion-shop/index.html`, with behavior verified from `potion-shop/js/app.js`.

## Landing Page

- Page loads with title, session heading, project description, participant list, ideas section, and terminology section.
- "Test the Potion Shop Application" link is visible and opens the Potion Shop in a new tab.
- Static content is readable on typical desktop and mobile widths.
- External link target is correct and not broken.

## Potion Shop: Browsing

- Shop header, featured potion section, potion builder, order summary, delivery form, reviews, and footer are visible.
- Featured potion card shows discount, name, description, and price.
- "Add to Order" button on featured potion gives visual feedback after click.

## Potion Builder

- User can select one base potion at a time.
- User can select one size at a time.
- User can select one potency level at a time.
- User can select multiple ingredients.
- Quantity can be increased and decreased with buttons.
- Quantity can also be edited directly in the input.
- Quantity respects minimum and maximum bounds.
- Default selections are applied correctly on first load.

## Live Pricing and Summary

- Order summary updates when base potion changes.
- Order summary updates when size changes.
- Order summary updates when potency changes.
- Order summary updates when ingredients are added or removed.
- Order summary updates when quantity changes.
- Brewing fee is always shown.
- Total recalculates correctly after every change.
- Featured potion addition affects subtotal and total correctly.
- Summary text matches the currently selected options.

## Delivery Details Form

- User can enter full name.
- User can enter contact crystal or email.
- User can enter castle or tower name.
- User can enter tower or room number.
- User can enter kingdom or realm.
- User can enter special instructions.
- User can choose a delivery method.
- Required fields block submission when missing.

## Order Submission

- Submit button sends the form without page reload.
- Successful submission opens confirmation modal.
- Confirmation modal shows generated order number.
- Confirmation modal shows delivery estimate based on selected delivery method.
- Form reset behavior after submit is correct and does not leave UI in an inconsistent state.

## Modal Behavior

- Modal can be closed with the close icon.
- Modal can be closed with the Continue Shopping button.
- Modal closes when clicking outside it.
- Modal closes when pressing Escape.
- Modal is not visible before submission.

## Static Content

- Customer reviews are shown.
- Footer contact details and social links are shown.
- External footer links behave as expected.

## Good Exploratory Test Angles

- Try submitting with no potion selected.
- Try invalid quantity values such as 0, 100, negative numbers, text, decimals, and blank input.
- Compare displayed size multipliers and ingredient prices against actual calculation behavior.
- Verify whether delivery price affects total, since delivery selection exists separately from the pricing summary.
- Check whether form reset also resets internal order state and displayed summary after submission.
- Try adding the featured potion multiple times or interacting while the button is temporarily disabled.
- Test keyboard-only use for builder, form, submit, and modal closing.
- Check mobile layout and readability for long labels and summary values.
