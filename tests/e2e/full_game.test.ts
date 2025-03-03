import { test, expect } from '@playwright/test'

test('Full game flow from start to finish', async ({ page }) => {
  // Step 1: Open Landing Page
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/CopVerse/)

  // Step 2: Click on "Start the Chase" and ensure navigation
  const startButton = page.locator('text=Start the Chase')
  await startButton.click()
  await page.waitForURL('**/city-selection', { timeout: 5000 })

  // Step 3: Ensure "Select" buttons are available
  await page.waitForSelector('button:has-text("Select")', { timeout: 5000 })

  const cities = await page.locator('button:has-text("Select")').all()
  expect(cities.length).toBeGreaterThanOrEqual(3)

  await cities[0].click()
  await cities[2].click()
  await cities[3].click()

  // Click "Next" button to proceed
  await page.locator('button:has-text("Next")').click()
  await page.waitForURL('**/vehicle-selection', { timeout: 5000 })

  // Step 4: Ensure vehicle selection sections are loaded
  await page.waitForSelector('.vehicle-selection-section', { timeout: 5000 })

  const vehicleSections = await page.locator('.vehicle-selection-section').all()
  expect(vehicleSections.length).toBeGreaterThanOrEqual(3)

  for (let i = 0; i < 3; i++) {
    const section = vehicleSections[i]

    // Check if there's a recommended vehicle
    const recommendedLocator = section.locator('p:has-text("Recommended") + b')
    const recommendedExists = await recommendedLocator.count()

    let vehicleToSelect

    if (recommendedExists > 0) {
      // Get recommended vehicle name
      const recommended = await recommendedLocator.innerText()
      vehicleToSelect = section.locator(`.vehicle-card:has-text("${recommended}")`)
    } else {
      // No recommendation, pick any available vehicle
      const availableVehicles = await section.locator('.vehicle-card:not(.opacity-50)').all()
      expect(availableVehicles.length).toBeGreaterThan(0)
      vehicleToSelect = availableVehicles[0]
    }

    await vehicleToSelect.click()
  }

  // Click "Submit"
  await page.locator('button:has-text("Submit")').click()
  await page.waitForURL('**/result', { timeout: 5000 })

  // Step 5: Wait for result page
  await expect(page.locator('text=The fugitive was captured')).toBeVisible()

  // Step 6: Click "Home" button
  await page.locator('button:has-text("Home")').click()

  // Step 7: Verify we are back on the landing page
  await expect(page).toHaveURL('http://localhost:3000')
  await expect(page.locator('text=Start the Chase')).toBeVisible()
})
