from playwright.sync_api import sync_playwright

APP_URL = "http://localhost:5173/"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto(APP_URL, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Scroll to menu
        page.evaluate("window.scrollTo(0, 750)")
        page.wait_for_timeout(600)

        # Click first product card button
        card_btn = page.locator(".product-card button, button:has-text('Add to Bag'), button:has-text('Select')").first
        card_btn.click()
        page.wait_for_timeout(600)

        # Add to bag in modal
        modal_btn = page.locator("button:has-text('Add to bag'), button:has-text('Add to Bag')").last
        modal_btn.click()
        page.wait_for_timeout(600)

        # Open cart/bag
        cart_btn = page.locator("button[aria-label*='bag' i], button[aria-label*='cart' i], .header-bag-btn").first
        cart_btn.click()
        page.wait_for_timeout(600)

        # Click 'Choose pickup slot'
        pickup_btn = page.locator("button:has-text('Choose pickup slot')").first
        pickup_btn.click()
        page.wait_for_timeout(1000)

        # Select first available pickup slot
        first_slot = page.locator(".slots label").first
        if first_slot.count() > 0:
            first_slot.click()
            page.wait_for_timeout(400)

        # Fill inputs
        name_input = page.locator("input[placeholder*='Name on the order ticket' i]")
        if name_input.count() > 0:
            name_input.fill("Aarav Mohapatra")
        phone_input = page.locator("input[placeholder*='10-digit mobile number' i]")
        if phone_input.count() > 0:
            phone_input.fill("9876543210")
        notes_input = page.locator("input[placeholder*='Special instructions' i], input[placeholder*='Extra hot' i]")
        if notes_input.count() > 0:
            notes_input.fill("Extra ginger, serve in earthen kulhad")

        page.wait_for_timeout(500)
        print("Capturing 07_checkout_pickup_selection.png...")
        page.screenshot(path="screenshots/workflows/07_checkout_pickup_selection.png")

        # Submit order
        confirm_btn = page.locator("button:has-text('Confirm Order')").first
        confirm_btn.click()
        page.wait_for_timeout(1500)

        print("Capturing 08_order_confirmation_ticket.png...")
        page.screenshot(path="screenshots/workflows/08_order_confirmation_ticket.png")

        context.close()
        browser.close()
        print("Done!")

if __name__ == "__main__":
    run()

