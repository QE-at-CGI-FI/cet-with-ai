# Comprehensive Potion Shop Test Plan

## Application Overview

The Enchanted Brew Shop is a magical potion e-commerce website featuring a custom potion builder with dynamic pricing, delivery options, and order processing. The site includes promotional items, complex configuration options, real-time price calculations, and a complete checkout process with form validation.

## Test Scenarios

### 1. Feature Potion Testing

**Seed:** `tests/seed.spec.ts`

#### 1.1. Verify Featured Potion Details and Discount

**File:** `tests/feature-potion/featured-potion-details.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop homepage
    - expect: Featured potion section displays 'Elixir of Eternal Focus'
    - expect: 15% OFF badge is visible
    - expect: Original price shows as 40 gold
    - expect: Discounted price shows as 34 gold
    - expect: Product description is present and informative
  2. Click the 'Add to Order' button on the featured potion
    - expect: Button changes to '✓ Added!' and becomes disabled
    - expect: Order summary updates with the featured potion
    - expect: Subtotal reflects the discounted price (34 gold)
    - expect: Total includes brewing fee and delivery costs

#### 1.2. Featured Potion State Management

**File:** `tests/feature-potion/potion-state-management.spec.ts`

**Steps:**
  1. Add the featured potion to order, then select a base potion from the custom builder
    - expect: Both items appear in the order summary
    - expect: Featured potion button reverts to 'Add to Order'
    - expect: Pricing calculations include both potions
  2. Add the featured potion multiple times by clicking the button
    - expect: Button remains disabled after first click
    - expect: Only one featured potion instance is added to the order
    - expect: No duplicate entries in order summary

### 2. Custom Potion Builder

**Seed:** `tests/seed.spec.ts`

#### 2.1. Base Potion Selection and Pricing

**File:** `tests/potion-builder/base-potion-selection.spec.ts`

**Steps:**
  1. Select each base potion type one at a time (Healing Draught, Elixir of Strength, Potion of Wisdom, Invisibility Brew)
    - expect: Only one base potion can be selected at a time
    - expect: Order summary updates with correct potion name and price
    - expect: Pricing matches displayed amounts: Healing (25g), Strength (30g), Wisdom (35g), Invisibility (45g)
  2. Verify default state when no base potion is selected
    - expect: Order summary shows 'No potion selected'
    - expect: Price shows '-' for base potion
    - expect: Subtotal shows only brewing fee (3 gold)

#### 2.2. Size Selection and Price Multipliers

**File:** `tests/potion-builder/size-selection.spec.ts`

**Steps:**
  1. Select Healing Draught (25 gold) and test each size option
    - expect: Vial (50ml): 1x price = 25 gold
    - expect: Flask (150ml): 1.5x price = 37.5 gold
    - expect: Bottle (500ml): 2x price = 50 gold
    - expect: Order summary reflects correct size multiplier
  2. Change size selections multiple times with different base potions
    - expect: Price calculations update correctly for each combination
    - expect: Only one size can be selected at a time
    - expect: Multiplier applies to base potion price only

#### 2.3. Special Ingredients Addition

**File:** `tests/potion-builder/special-ingredients.spec.ts`

**Steps:**
  1. Add multiple special ingredients to verify cumulative pricing
    - expect: Multiple ingredients can be selected simultaneously
    - expect: Each ingredient adds correct price: Dragon Scale (+15g), Moonstone Dust (+8g), Phoenix Feather (+20g), Enchanted Honey (+5g), Shadow Essence (+12g), Starlight Dew (+12g)
    - expect: Ingredients total displays cumulative cost
    - expect: Order subtotal includes all ingredient costs
  2. Select and deselect ingredients to test toggle functionality
    - expect: Checkboxes can be toggled on and off
    - expect: Pricing updates dynamically when ingredients are added/removed
    - expect: Ingredients total accurately reflects current selections

#### 2.4. Potency Level Configuration

**File:** `tests/potion-builder/potency-levels.spec.ts`

**Steps:**
  1. Select Healing Draught (25 gold) and test each potency level
    - expect: Standard: Base price (25 gold)
    - expect: Enhanced: +25% price (31.25 gold)
    - expect: Maximum: +75% price (43.75 gold)
    - expect: Only one potency level can be selected at a time
  2. Test potency levels with different base potions and size multipliers
    - expect: Potency multiplier applies after size multiplier
    - expect: Calculations remain accurate for complex combinations
    - expect: Order summary displays selected potency level

#### 2.5. Quantity Management

**File:** `tests/potion-builder/quantity-management.spec.ts`

**Steps:**
  1. Use + and - buttons to adjust quantity
    - expect: Quantity increases and decreases correctly
    - expect: Minimum quantity is 1 (- button should not go below 1)
    - expect: Price multiplies correctly based on quantity
    - expect: Quantity field accepts direct input
  2. Test quantity with complex potion configuration (multiple ingredients, enhanced potency, large size)
    - expect: All multipliers and additions apply to base calculation
    - expect: Total price scales correctly with quantity
    - expect: Order summary shows correct quantity

### 3. Order Summary and Pricing

**Seed:** `tests/seed.spec.ts`

#### 3.1. Dynamic Price Calculation Accuracy

**File:** `tests/order-summary/price-calculations.spec.ts`

**Steps:**
  1. Create a complex order: Invisibility Brew (45g) + Bottle size (2x) + Enhanced potency (+25%) + Dragon Scale (+15g) + Phoenix Feather (+20g) + Quantity 3
    - expect: Base calculation: (45 * 2 * 1.25 + 15 + 20) * 3 = 417.5 gold
    - expect: Subtotal includes brewing fee: 417.5 + 3 = 420.5 gold
    - expect: Total includes delivery: 420.5 + 5 = 425.5 gold (with Owl Post)
    - expect: Order summary displays all selected options correctly
  2. Verify brewing fee and delivery costs are applied correctly
    - expect: Brewing fee is consistently 3 gold regardless of order complexity
    - expect: Owl Post delivery is 5 gold
    - expect: Dragon Express delivery is 15 gold
    - expect: Final total accurately sums all components

#### 3.2. Order Summary Display Accuracy

**File:** `tests/order-summary/display-accuracy.spec.ts`

**Steps:**
  1. Configure various potion combinations and verify order summary details
    - expect: Potion name displays correctly
    - expect: Size information shows selected option with multiplier
    - expect: Potency level is accurately displayed
    - expect: Ingredient list and cost are correct
    - expect: Quantity reflects current selection

### 4. Delivery Form and Validation

**Seed:** `tests/seed.spec.ts`

#### 4.1. Required Field Validation

**File:** `tests/delivery-form/required-validation.spec.ts`

**Steps:**
  1. Attempt to submit form with empty required fields
    - expect: Form prevents submission
    - expect: Focus moves to first empty required field (Full Name)
    - expect: Browser shows validation message for required fields
  2. Fill fields one by one and verify validation behavior
    - expect: Form accepts valid input in required fields
    - expect: Partially filled form still prevents submission until all required fields are complete
    - expect: Field placeholders provide helpful examples

#### 4.2. Form Field Input Testing

**File:** `tests/delivery-form/field-input.spec.ts`

**Steps:**
  1. Test input validation and character limits for all form fields
    - expect: All text fields accept standard alphanumeric characters
    - expect: Special characters and emojis are handled appropriately
    - expect: Long text inputs are accepted or appropriately limited
    - expect: Email field (Contact Crystal) accepts email format
  2. Test optional vs required field behavior
    - expect: Contact Crystal email field is optional
    - expect: Tower/Room Number field is optional
    - expect: Special Instructions field is optional
    - expect: Required fields are clearly marked with asterisks

#### 4.3. Delivery Method Selection

**File:** `tests/delivery-form/delivery-methods.spec.ts`

**Steps:**
  1. Select different delivery methods and verify pricing updates
    - expect: Owl Post (3-5 days) costs 5 gold - selected by default
    - expect: Dragon Express (next day) costs 15 gold
    - expect: Only one delivery method can be selected at a time
    - expect: Total price updates when delivery method changes
  2. Verify delivery method information is accurate
    - expect: Delivery timeframes are clearly displayed
    - expect: Associated costs are shown
    - expect: Visual icons help distinguish between options

### 5. Order Processing and Confirmation

**Seed:** `tests/seed.spec.ts`

#### 5.1. Successful Order Submission

**File:** `tests/order-processing/successful-submission.spec.ts`

**Steps:**
  1. Complete a full order process with all required fields and submit
    - expect: Order confirmation modal appears
    - expect: Order number is generated (format: EB-#####)
    - expect: Estimated delivery time is displayed
    - expect: Success message confirms order is being processed
  2. Verify order confirmation modal functionality
    - expect: Modal can be closed with 'Continue Shopping' button
    - expect: Modal can be closed with 'x' button
    - expect: Closing modal returns to clean shop page
    - expect: Form fields are reset after successful submission

#### 5.2. Order State Management After Submission

**File:** `tests/order-processing/post-submission-state.spec.ts`

**Steps:**
  1. Submit an order and verify page state reset
    - expect: Order summary resets to empty state
    - expect: Form fields are cleared
    - expect: Potion selections are deselected
    - expect: Featured potion button returns to 'Add to Order' state
  2. Verify ability to place subsequent orders
    - expect: New orders can be configured immediately
    - expect: All functionality remains available
    - expect: No residual data from previous order affects new order

### 6. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 6.1. Boundary Testing

**File:** `tests/edge-cases/boundary-testing.spec.ts`

**Steps:**
  1. Test minimum and maximum quantity values
    - expect: Quantity cannot be reduced below 1
    - expect: High quantity values are handled correctly (test up to 999)
    - expect: Price calculations remain accurate with large quantities
    - expect: No integer overflow or precision errors
  2. Test with very long text inputs in form fields
    - expect: Form handles long names gracefully
    - expect: Long addresses don't break layout
    - expect: Special instructions field handles extensive text
    - expect: No JavaScript errors with unusual input

#### 6.2. Configuration Edge Cases

**File:** `tests/edge-cases/configuration-edges.spec.ts`

**Steps:**
  1. Test maximum complexity configuration (most expensive potion + all ingredients + maximum potency + largest size + high quantity)
    - expect: All options can be simultaneously selected
    - expect: Price calculations remain accurate
    - expect: Order summary displays all selections
    - expect: Form submission succeeds with complex order
  2. Test rapid configuration changes
    - expect: Quick selection changes don't cause errors
    - expect: Price updates keep pace with rapid changes
    - expect: No visual glitches or delayed updates
    - expect: Order summary remains synchronized

### 7. User Experience and Interface

**Seed:** `tests/seed.spec.ts`

#### 7.1. Visual Interface Testing

**File:** `tests/user-experience/visual-interface.spec.ts`

**Steps:**
  1. Verify all interactive elements are accessible and properly styled
    - expect: All buttons have appropriate hover states
    - expect: Radio buttons and checkboxes are clearly distinguishable
    - expect: Selected states are visually obvious
    - expect: Text is readable and properly formatted
  2. Test responsive behavior and layout integrity
    - expect: Page layout remains functional at different screen sizes
    - expect: Order summary stays visible during configuration
    - expect: Form elements are properly aligned
    - expect: No content overlap or text cutoff

#### 7.2. Customer Reviews and Static Content

**File:** `tests/user-experience/static-content.spec.ts`

**Steps:**
  1. Verify customer reviews section displays correctly
    - expect: All customer reviews are visible
    - expect: Star ratings display properly
    - expect: Customer names are shown
    - expect: Review text is complete and readable
  2. Verify footer information is accurate and functional
    - expect: Shop hours and contact information are displayed
    - expect: Social media links are present (may be placeholder links)
    - expect: Copyright information is shown
    - expect: All footer sections are properly formatted
