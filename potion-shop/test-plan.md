# Potion Shop Complete Test Plan

## Application Overview

The Enchanted Brew Shop is a fantasy-themed e-commerce application for ordering custom potions. The application includes a potion builder with multiple configuration options, real-time price calculations, order summary, customer information form, and order confirmation modal. Testing focuses on functional correctness, user experience, edge cases, and validation of identified potential bugs including pricing discrepancies and calculation errors.

## Test Scenarios

### 1. Featured Potion Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Add featured potion to order

**File:** `tests/featured-potion/add-featured-potion.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop application
    - expect: The page loads successfully
    - expect: Featured Potion section displays 'Elixir of Eternal Focus' with 15% OFF badge
  2. Click the 'Add to Order' button in the featured section
    - expect: Button text changes to '✓ Added!'
    - expect: Button becomes temporarily disabled
    - expect: Order summary updates to include featured potion cost
  3. Wait for 3 seconds
    - expect: Button text reverts to 'Add to Order'
    - expect: Button becomes clickable again
  4. Click the 'Add to Order' button again
    - expect: Featured item can be added multiple times
    - expect: Order summary reflects cumulative cost

### 2. Base Potion Selection

**Seed:** `tests/seed.spec.ts`

#### 2.1. Select different base potions

**File:** `tests/potion-builder/base-potion-selection.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop application
    - expect: No base potion is selected initially
    - expect: Order summary shows 'No potion selected'
  2. Select Healing Draught (25 gold)
    - expect: Healing Draught is selected
    - expect: Order summary updates to show 'Healing Draught' and '25 gold'
    - expect: Total updates to include base price plus brewing fee
  3. Select Elixir of Strength (30 gold)
    - expect: Selection changes to Elixir of Strength
    - expect: Order summary updates to show 'Elixir of Strength' and '30 gold'
    - expect: Total recalculates correctly
  4. Select Potion of Wisdom (35 gold)
    - expect: Selection changes to Potion of Wisdom
    - expect: Order summary updates to show 'Potion of Wisdom' and '35 gold'
    - expect: Total recalculates correctly
  5. Select Invisibility Brew (45 gold)
    - expect: Selection changes to Invisibility Brew
    - expect: Order summary updates to show 'Invisibility Brew' and '45 gold'
    - expect: Total recalculates correctly

### 3. Size Selection and Multipliers

**Seed:** `tests/seed.spec.ts`

#### 3.1. Verify size multiplier calculations

**File:** `tests/potion-builder/size-multipliers.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop and select Healing Draught (25 gold)
    - expect: Base price is 25 gold
    - expect: Default size Vial (1x) is selected
  2. Select Flask size option
    - expect: Flask size is selected
    - expect: Order summary shows size as 'Flask (1.5x)'
    - expect: Price calculation uses correct multiplier (verify if 1.5x or 1.35x from code)
  3. Select Bottle size option
    - expect: Bottle size is selected
    - expect: Order summary shows size as 'Bottle (2.5x)'
    - expect: Price is calculated as base price × 2.5
  4. Return to Vial size
    - expect: Vial size is selected
    - expect: Price returns to original base potion price

#### 3.2. Size multiplier bug verification

**File:** `tests/potion-builder/size-multiplier-bug.spec.ts`

**Steps:**
  1. Select Healing Draught (25 gold) and Flask size
    - expect: Verify if Flask multiplier matches display text - HTML shows 1.5x but JavaScript uses 1.35x
  2. Check calculated price against expected price
    - expect: Document any discrepancy between displayed multiplier and actual calculation

### 4. Special Ingredients

**Seed:** `tests/seed.spec.ts`

#### 4.1. Add and remove ingredients

**File:** `tests/potion-builder/ingredients-selection.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop and select Healing Draught
    - expect: Ingredients section shows all 6 available ingredients
    - expect: Ingredients total shows 0 gold
  2. Select Dragon Scale (+15 gold)
    - expect: Dragon Scale checkbox is checked
    - expect: Ingredients total updates to 15 gold
    - expect: Overall total includes ingredient cost
  3. Select Moonstone Dust (+8 gold)
    - expect: Both ingredients are selected
    - expect: Ingredients total shows 23 gold
    - expect: Overall total includes both ingredients
  4. Select all remaining ingredients
    - expect: All 6 ingredients are selected
    - expect: Ingredients total calculates correctly
    - expect: Overall total includes all ingredient costs
  5. Deselect Dragon Scale
    - expect: Dragon Scale is unchecked
    - expect: Ingredients total decreases by 15 gold
    - expect: Overall total recalculates correctly

#### 4.2. Ingredient pricing discrepancies

**File:** `tests/potion-builder/ingredient-pricing-bugs.spec.ts`

**Steps:**
  1. Check Phoenix Feather pricing
    - expect: Verify if displayed price (+20 gold) matches data-price (+18 gold)
  2. Check Starlight Dew pricing
    - expect: Verify if displayed price (+12 gold) matches data-price (+10 gold)
  3. Add these ingredients and verify actual cost calculation
    - expect: Document which price is used in calculations

### 5. Potency Selection

**Seed:** `tests/seed.spec.ts`

#### 5.1. Test potency multipliers

**File:** `tests/potion-builder/potency-selection.spec.ts`

**Steps:**
  1. Select Healing Draught (25 gold) with Standard potency
    - expect: Standard potency is selected by default
    - expect: No additional multiplier applied
    - expect: Price remains 25 gold
  2. Select Enhanced potency (+25%)
    - expect: Enhanced potency is selected
    - expect: Order summary shows 'Enhanced (+25%)'
    - expect: Price increases by 25% (31.25 gold)
  3. Select Maximum potency (+75%)
    - expect: Maximum potency is selected
    - expect: Order summary shows 'Maximum (+75%)'
    - expect: Price increases by 75% (43.75 gold)
  4. Combine with Flask size (1.5x) and Enhanced potency
    - expect: Both multipliers apply correctly
    - expect: Final price = base × size × potency

### 6. Quantity Controls

**Seed:** `tests/seed.spec.ts`

#### 6.1. Quantity input and buttons

**File:** `tests/potion-builder/quantity-controls.spec.ts`

**Steps:**
  1. Select a base potion and verify default quantity is 1
    - expect: Quantity input shows 1
    - expect: Order summary shows 'Quantity: 1'
  2. Click the '+' button 5 times
    - expect: Quantity increases to 6
    - expect: Order summary updates
    - expect: Total price multiplies by 6
  3. Click the '-' button 2 times
    - expect: Quantity decreases to 4
    - expect: Total price recalculates correctly
  4. Click the '-' button until quantity would go below 1
    - expect: Quantity stops at 1 and cannot go lower
  5. Manually type '99' in the quantity input
    - expect: Quantity updates to 99
    - expect: Total price calculates correctly for maximum quantity
  6. Try to input '100' in the quantity field
    - expect: Quantity is limited to maximum allowed (99 or system limit)

#### 6.2. Invalid quantity inputs

**File:** `tests/potion-builder/quantity-validation.spec.ts`

**Steps:**
  1. Type '0' in the quantity input
    - expect: System handles zero quantity appropriately
    - expect: Either prevents input or defaults to minimum
  2. Type negative number (-5) in the quantity input
    - expect: System rejects negative quantities
  3. Type non-numeric characters (abc) in the quantity input
    - expect: System rejects non-numeric input
  4. Clear the quantity field completely
    - expect: System handles empty quantity field gracefully

### 7. Order Summary and Calculations

**Seed:** `tests/seed.spec.ts`

#### 7.1. Real-time calculation accuracy

**File:** `tests/order-summary/calculation-accuracy.spec.ts`

**Steps:**
  1. Build a complex order: Invisibility Brew, Bottle size, Maximum potency, 3x Dragon Scale, quantity 2
    - expect: Order summary updates in real-time for each selection
    - expect: Subtotal calculation: (45 × 2.5 × 1.75 × 2) + (15 × 3) = 441.25 gold
    - expect: Total includes brewing fee: 441.25 + 3 = 444.25 gold
  2. Add the featured potion to the same order
    - expect: Featured potion cost (34 or 36 gold) is added to subtotal
    - expect: Total recalculates correctly
  3. Change one parameter and verify recalculation
    - expect: All dependent calculations update correctly
    - expect: No calculation errors or rounding issues

#### 7.2. Delivery cost calculation bug

**File:** `tests/order-summary/delivery-cost-bug.spec.ts`

**Steps:**
  1. Create an order and select Owl Post delivery (5 gold)
    - expect: Delivery method shows in customer form
    - expect: Delivery cost is displayed in selection
  2. Check if delivery cost is included in order summary total
    - expect: Verify if delivery cost is missing from total calculation (potential bug)
  3. Switch to Dragon Express delivery (15 gold)
    - expect: Check if delivery cost calculation changes in total

### 8. Customer Information Form

**Seed:** `tests/seed.spec.ts`

#### 8.1. Required field validation

**File:** `tests/customer-form/required-fields.spec.ts`

**Steps:**
  1. Create a valid potion order and navigate to the form section
    - expect: All form fields are visible
    - expect: Required fields are marked with *
  2. Try to submit the form without filling any fields
    - expect: Form validation prevents submission
    - expect: Required field errors are displayed
  3. Fill only the Full Name field and submit
    - expect: Form still requires Castle/Tower Name and Kingdom/Realm
    - expect: Validation messages guide user
  4. Fill all required fields: Full Name, Castle/Tower Name, Kingdom/Realm
    - expect: Form accepts submission with minimum required data

#### 8.2. Optional fields functionality

**File:** `tests/customer-form/optional-fields.spec.ts`

**Steps:**
  1. Fill required fields and add Contact Crystal (email)
    - expect: Optional field accepts input
    - expect: Form submits successfully with optional data
  2. Add Tower/Room Number and Special Instructions
    - expect: All optional fields work independently
    - expect: Form submits with all data

#### 8.3. Delivery method selection

**File:** `tests/customer-form/delivery-methods.spec.ts`

**Steps:**
  1. Verify Owl Post is selected by default
    - expect: Owl Post radio button is checked
    - expect: Shows '3-5 days · 5 gold'
  2. Select Dragon Express delivery
    - expect: Dragon Express option is selected
    - expect: Shows 'Next day · 15 gold'
    - expect: Delivery cost updates in form
  3. Switch back to Owl Post
    - expect: Selection changes back successfully

### 9. Order Confirmation and Modal

**Seed:** `tests/seed.spec.ts`

#### 9.1. Successful order submission

**File:** `tests/order-confirmation/successful-submission.spec.ts`

**Steps:**
  1. Create a complete valid order with all required fields
    - expect: Order is ready for submission
  2. Click 'Brew My Order' button
    - expect: Confirmation modal appears
    - expect: Modal shows order number in format 'EB-#####'
    - expect: Delivery estimate matches selected method
  3. Verify modal content
    - expect: Order number is displayed
    - expect: Delivery estimate shows correctly (3-5 days for Owl, Tomorrow for Dragon)
    - expect: Continue Shopping button is present
  4. Click 'Continue Shopping' button
    - expect: Modal closes
    - expect: Form is reset to initial state
    - expect: Order summary resets

#### 9.2. Modal interaction and closing

**File:** `tests/order-confirmation/modal-interactions.spec.ts`

**Steps:**
  1. Submit a valid order to open the modal
    - expect: Confirmation modal is displayed
  2. Click the X button in the top-right corner
    - expect: Modal closes successfully
  3. Submit another order and press the Escape key
    - expect: Modal closes with keyboard shortcut
  4. Submit another order and click outside the modal area
    - expect: Modal closes when clicking the overlay

### 10. User Interface and Interactions

**Seed:** `tests/seed.spec.ts`

#### 10.1. Hover and focus states

**File:** `tests/ui-interactions/hover-focus-states.spec.ts`

**Steps:**
  1. Hover over different potion cards
    - expect: Cards show hover effects and visual feedback
    - expect: Transitions are smooth
  2. Use Tab key to navigate through form elements
    - expect: All interactive elements are keyboard accessible
    - expect: Focus indicators are visible
    - expect: Tab order is logical
  3. Test all button hover states
    - expect: Buttons show appropriate hover effects
    - expect: Disabled buttons display correctly

#### 10.2. Visual feedback and animations

**File:** `tests/ui-interactions/visual-feedback.spec.ts`

**Steps:**
  1. Select different options and observe visual changes
    - expect: Selected options are clearly highlighted
    - expect: Transitions between states are smooth
  2. Add featured potion and observe button state change
    - expect: Button shows temporary '✓ Added!' state
    - expect: Button returns to normal after 2 seconds

### 11. Edge Cases and Error Scenarios

**Seed:** `tests/seed.spec.ts`

#### 11.1. Empty and invalid states

**File:** `tests/edge-cases/empty-invalid-states.spec.ts`

**Steps:**
  1. Try to submit order without selecting any base potion
    - expect: System handles gracefully
    - expect: User is prompted to select a potion or submission is prevented
  2. Select all most expensive options and maximum quantity
    - expect: System handles large calculations correctly
    - expect: No overflow errors in pricing
  3. Rapidly click multiple selection options
    - expect: System processes rapid input changes correctly
    - expect: No race conditions in calculations

#### 11.2. Form validation edge cases

**File:** `tests/edge-cases/form-validation-edge-cases.spec.ts`

**Steps:**
  1. Enter extremely long text in name fields
    - expect: System handles long input appropriately
    - expect: No layout breaking or overflow issues
  2. Enter special characters in form fields
    - expect: System accepts or gracefully rejects special characters
    - expect: No security vulnerabilities
  3. Test form with JavaScript disabled (if applicable)
    - expect: Basic functionality works without JavaScript
    - expect: Graceful degradation

### 12. Cross-Browser and Responsive Testing

**Seed:** `tests/seed.spec.ts`

#### 12.1. Mobile responsiveness

**File:** `tests/responsive/mobile-layout.spec.ts`

**Steps:**
  1. Resize browser to mobile viewport (375px width)
    - expect: Layout adapts to mobile screen
    - expect: All elements remain accessible
    - expect: Text is readable without horizontal scrolling
  2. Test potion builder on mobile
    - expect: All selection options work on touch devices
    - expect: Buttons are appropriately sized for touch
    - expect: Modal works correctly on mobile

#### 12.2. Different browser engines

**File:** `tests/cross-browser/browser-compatibility.spec.ts`

**Steps:**
  1. Test core functionality in Chrome/Chromium
    - expect: All features work as expected
  2. Test core functionality in Firefox
    - expect: All features work as expected
    - expect: No Firefox-specific issues
  3. Test core functionality in Safari/WebKit
    - expect: All features work as expected
    - expect: No Safari-specific issues
