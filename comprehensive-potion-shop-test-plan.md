# Comprehensive Potion Shop Test Plan

## Application Overview

The Enchanted Brew Shop is a fantasy-themed e-commerce application for ordering custom potions. It includes a potion builder with configuration options, real-time price calculations, order summary, customer information form, and order confirmation system. This comprehensive test plan covers functional correctness, user experience, security, accessibility, performance, and edge cases including known pricing discrepancies and calculation errors.

## Test Scenarios

### 1. Core Functionality Suite

**Seed:** `tests/seed.spec.ts`

#### 1.1. Featured Potion Operations

**File:** `tests/core-functionality/featured-potion-operations.spec.ts`

**Steps:**
  1. Navigate to the Potion Shop application
    - expect: Page loads successfully
    - expect: Featured Potion section displays 'Elixir of Eternal Focus' with 15% OFF badge
  2. Click the 'Add to Order' button in the featured section
    - expect: Button text changes to '✓ Added!'
    - expect: Button becomes temporarily disabled
    - expect: Order summary updates to include featured potion cost
  3. Wait for button to reset and click 'Add to Order' again
    - expect: Featured item can be added multiple times
    - expect: Order summary reflects cumulative cost accurately
  4. Verify featured potion pricing matches expected discount
    - expect: 15% discount is applied correctly
    - expect: Final price matches calculated expectation

#### 1.2. Base Potion Selection and Switching

**File:** `tests/core-functionality/base-potion-selection.spec.ts`

**Steps:**
  1. Load application and verify initial state
    - expect: No base potion is selected initially
    - expect: Order summary shows 'No potion selected'
  2. Select each base potion option sequentially
    - expect: Each selection updates order summary correctly
    - expect: Prices match expected values: Healing Draught (25g), Elixir of Strength (30g), Potion of Wisdom (35g), Invisibility Brew (45g)
  3. Switch between different base potions rapidly
    - expect: Order summary updates correctly for each selection
    - expect: No race conditions or calculation errors occur

#### 1.3. Size Multiplier Verification and Bug Testing

**File:** `tests/core-functionality/size-multipliers-bug-verification.spec.ts`

**Steps:**
  1. Select base potion and test each size option
    - expect: Vial (1x) - no multiplier applied
    - expect: Flask - verify actual multiplier (potential bug: display shows 1.5x but code uses 1.35x)
    - expect: Bottle (2.5x) - multiplier applied correctly
  2. Calculate expected price vs actual price for Flask size
    - expect: Document discrepancy between displayed (1.5x) and actual (1.35x) multiplier
    - expect: Verify which value the system actually uses in calculations
  3. Test size switching with complex configurations
    - expect: All size changes recalculate properly with other multipliers
    - expect: No rounding errors in complex calculations

#### 1.4. Ingredients Selection and Pricing Bugs

**File:** `tests/core-functionality/ingredients-pricing-verification.spec.ts`

**Steps:**
  1. Select and deselect each ingredient individually
    - expect: Each ingredient updates total correctly
    - expect: Ingredients can be combined without errors
  2. Verify Phoenix Feather pricing accuracy
    - expect: Check if displayed (+20 gold) matches data-price (+18 gold)
    - expect: Document which price is used in actual calculations
  3. Verify Starlight Dew pricing accuracy
    - expect: Check if displayed (+12 gold) matches data-price (+10 gold)
    - expect: Document calculation vs display discrepancy
  4. Select all ingredients and verify total calculation
    - expect: All ingredient costs sum correctly
    - expect: Complex ingredient combinations calculate properly

#### 1.5. Potency Multipliers and Complex Calculations

**File:** `tests/core-functionality/potency-complex-calculations.spec.ts`

**Steps:**
  1. Test each potency level individually
    - expect: Standard - no multiplier
    - expect: Enhanced (+25%) - 1.25x multiplier
    - expect: Maximum (+75%) - 1.75x multiplier
  2. Create complex order: Invisibility Brew + Bottle + Maximum + multiple ingredients + quantity 3
    - expect: Calculation: ((base × size × potency) + ingredients) × quantity
    - expect: Real-time updates work correctly for each component
  3. Verify calculation accuracy with maximum complexity
    - expect: All multipliers apply in correct order
    - expect: Final total matches manual calculation
    - expect: Brewing fee (3 gold) always included

### 2. User Interface and UX Suite

**Seed:** `tests/seed.spec.ts`

#### 2.1. Quantity Controls and Validation

**File:** `tests/ui-ux/quantity-controls-validation.spec.ts`

**Steps:**
  1. Test quantity increment/decrement buttons
    - expect: + button increases quantity
    - expect: - button decreases quantity
    - expect: Quantity cannot go below 1
    - expect: Maximum quantity limits enforced
  2. Test direct quantity input with invalid values
    - expect: Zero value handled appropriately
    - expect: Negative numbers rejected
    - expect: Non-numeric input rejected
    - expect: Empty field handled gracefully
  3. Test boundary values and extreme quantities
    - expect: Maximum quantity (99) works correctly
    - expect: Attempting quantity over max is handled
    - expect: Large quantity calculations remain accurate

#### 2.2. Real-time Order Summary Updates

**File:** `tests/ui-ux/real-time-order-summary.spec.ts`

**Steps:**
  1. Make rapid successive changes to order configuration
    - expect: Order summary updates in real-time for all changes
    - expect: No lag or inconsistent states occur
    - expect: All price components display correctly
  2. Verify order summary content accuracy
    - expect: Selected options text matches actual selections
    - expect: Quantities display correctly
    - expect: All price components itemized properly
  3. Test order summary with maximum complexity configuration
    - expect: All items listed correctly
    - expect: Subtotal includes all components
    - expect: Total includes brewing fee
    - expect: Math remains accurate

#### 2.3. Delivery Cost Integration Bug

**File:** `tests/ui-ux/delivery-cost-integration.spec.ts`

**Steps:**
  1. Select Owl Post delivery (5 gold) and check order total
    - expect: Delivery method appears in form
    - expect: Verify if delivery cost appears in order summary
    - expect: Check if delivery cost affects final total
  2. Switch to Dragon Express delivery (15 gold)
    - expect: Delivery method updates
    - expect: Verify if delivery cost change affects total
    - expect: Document potential bug: delivery cost missing from total calculation
  3. Complete order and verify final pricing includes delivery
    - expect: Final order confirmation includes delivery cost
    - expect: Total calculation is complete and accurate

#### 2.4. Responsive Design and Mobile UX

**File:** `tests/ui-ux/responsive-mobile-experience.spec.ts`

**Steps:**
  1. Resize browser to mobile viewport (375px width)
    - expect: Layout adapts appropriately
    - expect: All interactive elements remain accessible
    - expect: Text remains readable without horizontal scroll
  2. Test touch interactions on mobile-sized viewport
    - expect: All buttons appropriately sized for touch
    - expect: Selection options work with touch
    - expect: Form inputs work on mobile
  3. Test modal behavior on mobile
    - expect: Confirmation modal displays properly
    - expect: Modal can be closed on mobile
    - expect: Modal doesn't break mobile layout

### 3. Form Validation and Customer Data Suite

**Seed:** `tests/seed.spec.ts`

#### 3.1. Required Field Validation

**File:** `tests/form-validation/required-field-validation.spec.ts`

**Steps:**
  1. Attempt to submit form with no fields completed
    - expect: Form submission blocked
    - expect: Required field validation messages displayed
    - expect: User guided to complete required fields
  2. Fill fields partially and test validation
    - expect: Missing required fields prevent submission
    - expect: Validation messages are clear and helpful
    - expect: Form remains in correct state
  3. Complete all required fields and submit
    - expect: Form accepts submission
    - expect: Only Full Name, Castle/Tower Name, and Kingdom/Realm are truly required
    - expect: Form processes successfully

#### 3.2. Optional Fields and Data Integrity

**File:** `tests/form-validation/optional-fields-data-integrity.spec.ts`

**Steps:**
  1. Fill optional fields individually and in combination
    - expect: Contact Crystal/email field works independently
    - expect: Tower/Room Number accepts input
    - expect: Special Instructions accepts text input
  2. Test form with all optional fields completed
    - expect: All data is preserved during form interaction
    - expect: Submission includes all optional data
    - expect: No data loss occurs
  3. Test special characters and long text in optional fields
    - expect: Special characters handled appropriately
    - expect: Long text doesn't break layout
    - expect: Input validation is reasonable

#### 3.3. Input Sanitization and Security

**File:** `tests/form-validation/input-sanitization-security.spec.ts`

**Steps:**
  1. Test XSS prevention by entering script tags in text fields
    - expect: Script tags are sanitized or escaped
    - expect: No JavaScript execution from user input
    - expect: Form remains secure
  2. Test SQL injection patterns in text fields
    - expect: SQL injection patterns handled safely
    - expect: No backend errors from malicious input
    - expect: Application remains stable
  3. Test extremely long input strings
    - expect: Long strings handled gracefully
    - expect: No buffer overflow or system crashes
    - expect: Reasonable input length limits enforced

### 4. Order Processing and Confirmation Suite

**Seed:** `tests/seed.spec.ts`

#### 4.1. Order Submission Flow

**File:** `tests/order-processing/order-submission-flow.spec.ts`

**Steps:**
  1. Create complete valid order and submit
    - expect: Order processes without page reload
    - expect: Confirmation modal appears immediately
    - expect: Order number generated in EB-##### format
  2. Verify order confirmation modal content
    - expect: Order number displays correctly
    - expect: Delivery estimate matches selected method (3-5 days Owl, Next day Dragon)
    - expect: Continue Shopping button present and functional
  3. Test order number uniqueness
    - expect: Each order generates unique order number
    - expect: Order numbers follow expected format
    - expect: No duplicate order numbers generated

#### 4.2. Modal Interaction and State Management

**File:** `tests/order-processing/modal-interaction-state.spec.ts`

**Steps:**
  1. Test all modal closing methods
    - expect: X button closes modal
    - expect: Continue Shopping button closes modal
    - expect: Escape key closes modal
    - expect: Clicking outside modal closes it
  2. Verify form reset behavior after modal interaction
    - expect: Form fields reset to initial state
    - expect: Order summary clears appropriately
    - expect: Application ready for new order
  3. Test modal behavior with keyboard navigation
    - expect: Modal is keyboard accessible
    - expect: Tab navigation works within modal
    - expect: Focus management is proper

#### 4.3. Order State Reset and Multiple Orders

**File:** `tests/order-processing/multiple-orders-state-reset.spec.ts`

**Steps:**
  1. Complete first order and verify reset
    - expect: After submission, form is completely reset
    - expect: Order summary returns to initial state
    - expect: No remnants of previous order remain
  2. Create and submit second order immediately after first
    - expect: Second order processes independently
    - expect: No interference from previous order
    - expect: All calculations start fresh
  3. Verify no memory leaks or state pollution
    - expect: Each order is processed cleanly
    - expect: Previous order data doesn't affect new orders
    - expect: Application performance remains consistent

### 5. Cross-Browser and Performance Suite

**Seed:** `tests/seed.spec.ts`

#### 5.1. Cross-Browser Compatibility

**File:** `tests/cross-browser/browser-compatibility.spec.ts`

**Steps:**
  1. Test core functionality in Chrome/Chromium
    - expect: All features work as expected
    - expect: No Chrome-specific issues
    - expect: Performance is acceptable
  2. Test core functionality in Firefox
    - expect: All features work as expected
    - expect: No Firefox-specific rendering issues
    - expect: JavaScript compatibility confirmed
  3. Test core functionality in Safari/WebKit
    - expect: All features work as expected
    - expect: No Safari-specific issues
    - expect: Touch interactions work on Safari mobile

#### 5.2. Performance and Load Testing

**File:** `tests/performance/performance-load-testing.spec.ts`

**Steps:**
  1. Measure page load time and initial rendering
    - expect: Page loads within reasonable time (< 3 seconds)
    - expect: Critical rendering path is optimized
    - expect: Resources load efficiently
  2. Test calculation performance with rapid input changes
    - expect: Real-time calculations remain responsive
    - expect: No significant lag during rapid interactions
    - expect: Memory usage remains stable
  3. Test with maximum complexity configurations
    - expect: Large calculation loads don't slow system
    - expect: Complex orders process quickly
    - expect: System remains responsive under load

#### 5.3. Accessibility Compliance

**File:** `tests/accessibility/accessibility-compliance.spec.ts`

**Steps:**
  1. Test keyboard navigation throughout application
    - expect: All interactive elements accessible via keyboard
    - expect: Tab order is logical and intuitive
    - expect: Focus indicators are clearly visible
  2. Test screen reader compatibility
    - expect: All content is properly labeled
    - expect: Form fields have appropriate labels
    - expect: Error messages are announced correctly
  3. Verify color contrast and visual accessibility
    - expect: Text contrast meets WCAG guidelines
    - expect: Interactive elements are distinguishable
    - expect: Information isn't conveyed by color alone

### 6. Edge Cases and Error Handling Suite

**Seed:** `tests/seed.spec.ts`

#### 6.1. No Selection Error Handling

**File:** `tests/edge-cases/no-selection-error-handling.spec.ts`

**Steps:**
  1. Attempt to submit order without selecting base potion
    - expect: System prevents submission or provides clear error
    - expect: User is guided to select required options
    - expect: No system errors or crashes occur
  2. Test partial selections and submission attempts
    - expect: System identifies missing required selections
    - expect: Error messages are helpful and specific
    - expect: User can easily complete required selections
  3. Verify order summary behavior with incomplete selections
    - expect: Order summary reflects current state accurately
    - expect: Empty states are handled gracefully
    - expect: No confusing or misleading information displayed

#### 6.2. Network and Connectivity Issues

**File:** `tests/edge-cases/network-connectivity-issues.spec.ts`

**Steps:**
  1. Test form submission with simulated network failure
    - expect: System handles network errors gracefully
    - expect: User receives appropriate error message
    - expect: Order data is preserved during network issues
  2. Test application behavior with slow network
    - expect: Application remains usable during slow loads
    - expect: User feedback provided for loading states
    - expect: No functionality breaks due to slow network
  3. Test offline scenario handling
    - expect: Application provides appropriate offline messaging
    - expect: Core functionality degrades gracefully
    - expect: User understands application limitations

#### 6.3. Boundary Value and Extreme Input Testing

**File:** `tests/edge-cases/boundary-extreme-input-testing.spec.ts`

**Steps:**
  1. Test with maximum possible order value configuration
    - expect: System handles large numerical calculations
    - expect: No integer overflow or precision errors
    - expect: Display formatting remains correct
  2. Test rapid-fire user interactions
    - expect: System handles rapid clicking without errors
    - expect: No race conditions in state management
    - expect: User interface remains responsive
  3. Test unusual browser conditions (very small/large viewport, disabled JavaScript)
    - expect: Application degrades gracefully
    - expect: Core functionality remains available
    - expect: User experience is still acceptable
