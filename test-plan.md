# Enchanted Brew Shop Test Plan

## Application Overview

The Enchanted Brew Shop is a fantasy-themed e-commerce website for ordering magical potions. The application features a sophisticated potion builder allowing customers to customize potions by selecting base types, sizes, potency levels, and special ingredients. It includes real-time pricing calculations, customer delivery forms, and order confirmation functionality. The site uses a whimsical theme with magical terminology and immersive user experience elements.

## Test Scenarios

### 1. Featured Potion Functionality

**Seed:** `tests/setup-homepage.spec.ts`

#### 1.1. Valid Featured Potion Addition

**File:** `tests/featured-potion/add-featured-potion.spec.ts`

**Steps:**
  1. Navigate to the homepage and verify the featured potion section displays correctly
    - expect: Featured potion shows 'Elixir of Eternal Focus'
    - expect: 15% OFF badge is visible
    - expect: Original price shows '40 gold' with strikethrough
    - expect: Sale price shows '34 gold'
    - expect: 'Add to Order' button is present and clickable
  2. Click the 'Add to Order' button for the featured potion
    - expect: Button text changes to '✓ Added!'
    - expect: Button becomes disabled temporarily
    - expect: Order summary updates to include the featured potion
    - expect: Total price increases by 34 gold (featured potion price)
  3. Wait for the button to reset and verify it returns to normal state
    - expect: Button text returns to 'Add to Order' after 2 seconds
    - expect: Button becomes enabled again
    - expect: Featured potion remains in order summary

#### 1.2. Featured Potion Multiple Addition Prevention

**File:** `tests/featured-potion/prevent-duplicate-featured.spec.ts`

**Steps:**
  1. Add the featured potion to the order successfully
    - expect: Featured potion is added to order summary
    - expect: Total reflects the addition
  2. Attempt to add the featured potion again by clicking the button multiple times during the disabled period
    - expect: Additional clicks should not increase the quantity
    - expect: Order summary should show only one featured potion
    - expect: Total should not increase beyond one featured potion addition

### 2. Potion Builder - Base Potion Selection

**Seed:** `tests/setup-homepage.spec.ts`

#### 2.1. Valid Base Potion Selection

**File:** `tests/potion-builder/base-potion-selection.spec.ts`

**Steps:**
  1. Select each base potion option (Healing Draught, Elixir of Strength, Potion of Wisdom, Invisibility Brew)
    - expect: Only one potion can be selected at a time (radio button behavior)
    - expect: Order summary updates with selected potion name
    - expect: Order summary shows correct base price (25, 30, 35, 45 gold respectively)
    - expect: Visual selection state changes appropriately
  2. Switch between different base potion selections
    - expect: Previously selected potion is deselected
    - expect: New selection is reflected in order summary
    - expect: Price calculation updates correctly
    - expect: Total recalculates with new base price

#### 2.2. No Base Potion Selected State

**File:** `tests/potion-builder/no-base-potion.spec.ts`

**Steps:**
  1. Load the page without selecting any base potion
    - expect: Order summary shows 'No potion selected'
    - expect: Price shows '-' for the potion line item
    - expect: Subtotal shows 0 gold
    - expect: Total shows only brewing fee (3 gold)
  2. Proceed through other builder options without selecting a base potion
    - expect: Size, potency, and ingredient selections should still work
    - expect: Order summary should reflect these selections
    - expect: Subtotal should remain 0 gold for potion base

### 3. Potion Builder - Size and Potency

**Seed:** `tests/setup-homepage.spec.ts`

#### 3.1. Size Selection Impact on Pricing

**File:** `tests/potion-builder/size-selection.spec.ts`

**Steps:**
  1. Select a base potion (e.g., Healing Draught - 25 gold)
    - expect: Base potion is selected and price shows 25 gold
  2. Test each size option: Vial (1x), Flask (1.5x), Bottle (2.5x)
    - expect: Vial: price remains 25 gold
    - expect: Flask: price becomes ~37.5 gold
    - expect: Bottle: price becomes ~62.5 gold
    - expect: Order summary updates with size multiplier information
    - expect: Size selection is mutually exclusive (radio buttons)
  3. Verify size descriptions and icons
    - expect: Vial shows 🧴 icon and '50ml · 1x price'
    - expect: Flask shows ⚗️ icon and '150ml · 1.5x price'
    - expect: Bottle shows 🍾 icon and '500ml · 2x price'

#### 3.2. Potency Selection and Price Multipliers

**File:** `tests/potion-builder/potency-selection.spec.ts`

**Steps:**
  1. Select a base potion and test each potency level
    - expect: Standard: no price change (1x multiplier)
    - expect: Enhanced: 25% price increase
    - expect: Maximum: 75% price increase
    - expect: Potency descriptions are accurate
  2. Combine different size and potency selections to verify multiplicative effect
    - expect: Price calculations should multiply size and potency multipliers correctly
    - expect: Order summary should show both size and potency selections
    - expect: Final price should reflect both multipliers applied to base price

### 4. Potion Builder - Special Ingredients

**Seed:** `tests/setup-homepage.spec.ts`

#### 4.1. Individual Ingredient Selection

**File:** `tests/potion-builder/ingredients-individual.spec.ts`

**Steps:**
  1. Select each ingredient individually and verify pricing
    - expect: Dragon Scale: +15 gold
    - expect: Moonstone Dust: +8 gold
    - expect: Phoenix Feather: +18 gold (note: HTML shows +20 but data-price shows 18)
    - expect: Enchanted Honey: +5 gold
    - expect: Shadow Essence: +12 gold
    - expect: Starlight Dew: +10 gold (note: HTML shows +12 but data-price shows 10)
    - expect: Ingredients can be selected independently (checkboxes)
    - expect: Order summary updates ingredients total correctly

#### 4.2. Multiple Ingredient Combinations

**File:** `tests/potion-builder/ingredients-multiple.spec.ts`

**Steps:**
  1. Select multiple ingredients in various combinations
    - expect: All selected ingredients are added to the total
    - expect: Order summary shows cumulative ingredient cost
    - expect: Individual ingredients can be deselected
    - expect: Deselecting ingredients reduces the total correctly
  2. Select all ingredients and verify maximum ingredient cost
    - expect: All 6 ingredients can be selected simultaneously
    - expect: Total ingredient cost should be 68 gold (15+8+18+5+12+10)
    - expect: Order summary reflects the complete ingredient addition

### 5. Quantity and Calculation Logic

**Seed:** `tests/setup-homepage.spec.ts`

#### 5.1. Quantity Input Validation

**File:** `tests/potion-builder/quantity-input.spec.ts`

**Steps:**
  1. Test quantity input field with various values
    - expect: Default quantity is 1
    - expect: Accepts values from 1 to 99
    - expect: Rejects values less than 1 or greater than 99
    - expect: Input field shows current quantity
  2. Use quantity adjustment buttons (+ and -)
    - expect: + button increases quantity by 1
    - expect: - button decreases quantity by 1
    - expect: Cannot go below 1 using - button
    - expect: Cannot exceed 99 using + button
    - expect: Order summary updates quantity display
  3. Test edge cases with manual input
    - expect: Entering 0 should default to 1
    - expect: Entering negative numbers should default to 1
    - expect: Entering numbers > 99 should cap at 99
    - expect: Non-numeric input should be handled gracefully

#### 5.2. Total Price Calculation Accuracy

**File:** `tests/potion-builder/price-calculation.spec.ts`

**Steps:**
  1. Create a complex order: Invisibility Brew (45g) + Bottle size (2.5x) + Maximum potency (1.75x) + all ingredients (68g) + quantity 3
    - expect: Base calculation: 45 * 2.5 * 1.75 = 196.875 gold per potion
    - expect: With ingredients: 196.875 + 68 = 264.875 gold per potion
    - expect: For quantity 3: 264.875 * 3 = 794.625 gold
    - expect: Subtotal should show 794.63 gold (rounded)
    - expect: With brewing fee: 794.63 + 3 = 797.63 gold total
  2. Add featured potion to the complex order
    - expect: Total should increase by exactly 34 gold
    - expect: Final total: 797.63 + 34 = 831.63 gold

### 6. Customer Information Form

**Seed:** `tests/setup-homepage.spec.ts`

#### 6.1. Required Field Validation

**File:** `tests/customer-info/required-fields.spec.ts`

**Steps:**
  1. Attempt to submit the form with all required fields empty
    - expect: Form should not submit
    - expect: Required field validation errors should appear
    - expect: Fields marked with * should show validation messages
    - expect: Submit button should not proceed with form submission
  2. Fill required fields one by one and test partial submission
    - expect: Full Name field is required
    - expect: Castle/Tower Name field is required
    - expect: Kingdom/Realm field is required
    - expect: Delivery method should have Owl Post selected by default
    - expect: Form should only submit when all required fields are completed

#### 6.2. Valid Customer Information Submission

**File:** `tests/customer-info/valid-submission.spec.ts`

**Steps:**
  1. Fill out complete customer information with valid data
    - expect: Full Name: 'Gandalf the Grey'
    - expect: Contact Crystal: 'gandalf@middleearth.realm'
    - expect: Castle/Tower Name: 'Minas Tirith'
    - expect: Tower/Room Number: 'White Tower, Level 7'
    - expect: Kingdom/Realm: 'Gondor'
    - expect: Delivery Method: Owl Post or Dragon Express
    - expect: Special Instructions: 'Handle with care - very important wizard'
  2. Submit the form with valid customer information
    - expect: Form submits successfully
    - expect: Confirmation modal appears
    - expect: Order number is generated (format: EB-XXXXX)
    - expect: Delivery estimate is shown
    - expect: Form is reset after successful submission

#### 6.3. Delivery Method Selection

**File:** `tests/customer-info/delivery-options.spec.ts`

**Steps:**
  1. Test delivery method selection between Owl Post and Dragon Express
    - expect: Owl Post: 3-5 days, 5 gold
    - expect: Dragon Express: Next day, 15 gold
    - expect: Only one delivery method can be selected at a time
    - expect: Default selection is Owl Post
    - expect: Price difference is clearly displayed
  2. Verify delivery method affects order calculations and confirmation
    - expect: Delivery price should be included in final total
    - expect: Confirmation modal should show correct delivery estimate
    - expect: Owl Post: '3-5 days' estimate
    - expect: Dragon Express: 'Tomorrow' estimate

### 7. Order Confirmation and Modal Behavior

**Seed:** `tests/setup-homepage.spec.ts`

#### 7.1. Successful Order Confirmation Modal

**File:** `tests/confirmation/successful-order.spec.ts`

**Steps:**
  1. Complete a full order and submit successfully
    - expect: Confirmation modal appears with success message
    - expect: Order number is displayed in format EB-XXXXX (5 digits)
    - expect: Delivery estimate matches selected delivery method
    - expect: 'Continue Shopping' button is present
    - expect: Modal has proper styling and layout
  2. Interact with the confirmation modal
    - expect: Modal can be closed by clicking 'Continue Shopping' button
    - expect: Modal can be closed by clicking X button
    - expect: Modal can be closed by pressing Escape key
    - expect: Modal can be closed by clicking outside the modal area

#### 7.2. Order Form Reset After Submission

**File:** `tests/confirmation/form-reset.spec.ts`

**Steps:**
  1. Submit a complete order and close the confirmation modal
    - expect: Customer information form is reset to blank state
    - expect: All form fields are cleared
    - expect: Delivery method resets to default (Owl Post)
    - expect: Special instructions field is cleared
  2. Verify potion builder state after order submission
    - expect: Potion builder selections should remain intact
    - expect: Order summary should still show previous selections
    - expect: Customer can immediately place another order with same potion
    - expect: Builder state persistence allows quick reorders

### 8. Error Handling and Edge Cases

**Seed:** `tests/setup-homepage.spec.ts`

#### 8.1. Browser Compatibility and Responsive Design

**File:** `tests/compatibility/browser-responsive.spec.ts`

**Steps:**
  1. Test the application on different viewport sizes
    - expect: Layout adapts appropriately to mobile viewport
    - expect: All interactive elements remain accessible
    - expect: Text remains readable at different sizes
    - expect: Form submission works on all screen sizes
  2. Test keyboard navigation throughout the application
    - expect: All form elements are keyboard accessible
    - expect: Tab order is logical and intuitive
    - expect: Radio buttons and checkboxes work with keyboard
    - expect: Modal can be dismissed with Escape key

#### 8.2. Performance and Loading Behavior

**File:** `tests/performance/loading-behavior.spec.ts`

**Steps:**
  1. Test initial page load performance
    - expect: Page loads completely within reasonable time
    - expect: All images load properly (or show appropriate fallbacks)
    - expect: JavaScript functionality initializes correctly
    - expect: CSS styling applies properly
  2. Test real-time calculation performance with rapid interactions
    - expect: Order summary updates smoothly during rapid selections
    - expect: No visible lag in price calculations
    - expect: UI remains responsive during multiple quick changes
    - expect: No JavaScript errors occur during intensive interaction

### 9. Integration and End-to-End Workflows

**Seed:** `tests/setup-homepage.spec.ts`

#### 9.1. Complete Customer Journey - Quick Order

**File:** `tests/e2e/quick-order-journey.spec.ts`

**Steps:**
  1. Execute a complete quick order workflow: Select featured potion, fill minimal required info, submit
    - expect: Featured potion is added successfully
    - expect: Required customer fields are filled efficiently
    - expect: Order submits without errors
    - expect: Confirmation received with order details
    - expect: Entire process completes in under 2 minutes

#### 9.2. Complete Customer Journey - Custom Potion

**File:** `tests/e2e/custom-potion-journey.spec.ts`

**Steps:**
  1. Execute a complete custom potion workflow: Build complex potion, add multiple ingredients, complete detailed customer info
    - expect: Complex potion configuration works smoothly
    - expect: All pricing calculations are accurate throughout
    - expect: Customer information form handles detailed input
    - expect: Final order matches all selections
    - expect: Confirmation provides complete order summary

#### 9.3. Multiple Order Workflow

**File:** `tests/e2e/multiple-orders.spec.ts`

**Steps:**
  1. Place multiple consecutive orders to test form reset and state management
    - expect: First order completes successfully
    - expect: Form resets properly between orders
    - expect: Second order can be placed with different selections
    - expect: Order numbers are unique for each submission
    - expect: No state contamination between orders
