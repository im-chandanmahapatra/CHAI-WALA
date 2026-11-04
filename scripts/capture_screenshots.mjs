import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const APP_URL = 'http://localhost:5173/';

async function capture() {
  console.log('Launching browser to capture genuine application screenshots...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Desktop Viewport (1440 x 900)
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 01. Homepage 1900s Adda
    console.log('Capturing 01_homepage_1900s_adda.png...');
    await page.screenshot({ path: 'screenshots/application/01_homepage_1900s_adda.png' });

    // Switch to 2020s mode
    console.log('Switching to 2020s mode...');
    const switch2020Btn = page.locator('button:has-text("2020s"), button:has-text("The modern")').first();
    if (await switch2020Btn.count() > 0) {
      await switch2020Btn.click();
      await page.waitForTimeout(800);
    }
    console.log('Capturing 02_homepage_2020s_cafe.png...');
    await page.screenshot({ path: 'screenshots/application/02_homepage_2020s_cafe.png' });

    // Switch back to 1900s for consistent menu walk
    const switch1900Btn = page.locator('button:has-text("1900s"), button:has-text("The original")').first();
    if (await switch1900Btn.count() > 0) {
      await switch1900Btn.click();
      await page.waitForTimeout(500);
    }

    // Scroll down to menu section
    console.log('Scrolling to menu section...');
    const menuSection = page.locator('#menu, .menu-section, section:has(.product-card)').first();
    if (await menuSection.count() > 0) {
      await menuSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      console.log('Capturing 03_menu_catalogue_adda.png...');
      await page.screenshot({ path: 'screenshots/application/03_menu_catalogue_adda.png' });
    }

    // Switch menu to 2020s
    if (await switch2020Btn.count() > 0) {
      await switch2020Btn.click();
      await page.waitForTimeout(600);
      console.log('Capturing 04_menu_catalogue_cafe.png...');
      await page.screenshot({ path: 'screenshots/application/04_menu_catalogue_cafe.png' });
    }

    // Open Customization Modal on first product card
    console.log('Opening product customization modal...');
    const productCardBtn = page.locator('.product-card button, button:has-text("Customize"), button:has-text("Add")').first();
    if (await productCardBtn.count() > 0) {
      await productCardBtn.click();
      await page.waitForTimeout(800);
      console.log('Capturing 05_customization_modal.png...');
      await page.screenshot({ path: 'screenshots/workflows/05_customization_modal.png' });

      // Click add to bag inside modal
      const addToBagModalBtn = page.locator('button:has-text("Add to"), button:has-text("Add to bag")').last();
      if (await addToBagModalBtn.count() > 0) {
        await addToBagModalBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // Open Order Bag (Cart)
    console.log('Opening order bag drawer...');
    const cartBtn = page.locator('button[aria-label*="cart" i], button[aria-label*="bag" i], button:has-text("Bag"), button:has(.lucide-shopping-bag)').first();
    if (await cartBtn.count() > 0) {
      await cartBtn.click();
      await page.waitForTimeout(800);
      console.log('Capturing 06_order_bag_drawer.png...');
      await page.screenshot({ path: 'screenshots/workflows/06_order_bag_drawer.png' });

      // Proceed to checkout / pickup slots
      console.log('Proceeding to pickup selection...');
      const checkoutBtn = page.locator('button:has-text("Pickup choose karo"), button:has-text("Checkout"), button:has-text("Proceed to checkout")').first();
      if (await checkoutBtn.count() > 0) {
        await checkoutBtn.click();
        await page.waitForTimeout(800);

        // Fill form fields if present
        const nameInput = page.locator('input[placeholder*="Name" i], input#customer-name, input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Aarav Mohapatra');
        }
        const phoneInput = page.locator('input[placeholder*="Phone" i], input#customer-phone, input[type="tel"]').first();
        if (await phoneInput.count() > 0) {
          await phoneInput.fill('9876543210');
        }

        console.log('Capturing 07_checkout_pickup_selection.png...');
        await page.screenshot({ path: 'screenshots/workflows/07_checkout_pickup_selection.png' });

        // Submit order
        console.log('Submitting order to capture confirmation ticket...');
        const placeOrderBtn = page.locator('button:has-text("Place Order"), button:has-text("Confirm Order"), button:has-text("Order place karo")').first();
        if (await placeOrderBtn.count() > 0) {
          await placeOrderBtn.click();
          await page.waitForTimeout(1200);
          console.log('Capturing 08_order_confirmation_ticket.png...');
          await page.screenshot({ path: 'screenshots/workflows/08_order_confirmation_ticket.png' });
        }
      }
    }

    // Capture Audio Radio / AddaSessions / TheatreMode
    console.log('Capturing audio radio / adda sessions...');
    const radioBtn = page.locator('button:has-text("Era radio"), button:has-text("Now playing"), .hero-radio-cta').first();
    if (await radioBtn.count() > 0) {
      await radioBtn.click();
      await page.waitForTimeout(600);
      console.log('Capturing 09_theatre_mode_radio.png...');
      await page.screenshot({ path: 'screenshots/application/09_theatre_mode_radio.png' });
    }

    await desktopContext.close();

    // 2. Mobile Viewport (iPhone 14 / 390 x 844)
    console.log('Launching mobile viewport context...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(APP_URL, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    console.log('Capturing 10_mobile_hero_view.png...');
    await mobilePage.screenshot({ path: 'screenshots/responsive/10_mobile_hero_view.png' });

    // Scroll to mobile menu
    console.log('Scrolling to mobile menu...');
    const mobMenu = mobilePage.locator('#menu, .menu-section, section:has(.product-card)').first();
    if (await mobMenu.count() > 0) {
      await mobMenu.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(600);
      console.log('Capturing 11_mobile_menu_view.png...');
      await mobilePage.screenshot({ path: 'screenshots/responsive/11_mobile_menu_view.png' });
    }

    // Add item and open cart on mobile
    const mobAddBtn = mobilePage.locator('.product-card button, button:has-text("Add")').first();
    if (await mobAddBtn.count() > 0) {
      await mobAddBtn.click();
      await mobilePage.waitForTimeout(600);
      // If modal opens, confirm
      const modalAdd = mobilePage.locator('button:has-text("Add to")').last();
      if (await modalAdd.count() > 0) {
        await modalAdd.click();
        await mobilePage.waitForTimeout(500);
      }
    }
    const mobCartBtn = mobilePage.locator('button[aria-label*="cart" i], button[aria-label*="bag" i], button:has-text("Bag"), button:has(.lucide-shopping-bag)').first();
    if (await mobCartBtn.count() > 0) {
      await mobCartBtn.click();
      await mobilePage.waitForTimeout(600);
      console.log('Capturing 12_mobile_checkout_view.png...');
      await mobilePage.screenshot({ path: 'screenshots/responsive/12_mobile_checkout_view.png' });
    }

    await mobileContext.close();

    console.log('All screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

