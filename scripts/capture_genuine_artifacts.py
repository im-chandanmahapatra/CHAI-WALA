import os
import subprocess
import time
import urllib.request
from playwright.sync_api import sync_playwright

os.makedirs("artifacts/screenshots", exist_ok=True)

# 1. Start Vite dev server in client/
print("Starting Vite development server in client/...")
vite_proc = subprocess.Popen(["npx.cmd", "vite", "--port", "5173"], cwd="client", shell=False)

APP_URL = "http://localhost:5173/"

try:
    # Wait for Vite dev server to respond
    server_ready = False
    for attempt in range(25):
        try:
            with urllib.request.urlopen(APP_URL) as resp:
                if resp.status == 200:
                    print(f"Vite server ready at {APP_URL} on attempt {attempt+1}")
                    server_ready = True
                    break
        except Exception:
            time.sleep(0.5)

    if not server_ready:
        # Check if Vite auto-assigned port 5174
        try:
            with urllib.request.urlopen("http://localhost:5174/") as resp:
                if resp.status == 200:
                    APP_URL = "http://localhost:5174/"
                    print(f"Vite server bound to fallback port {APP_URL}")
                    server_ready = True
        except Exception:
            pass

    if not server_ready:
        raise RuntimeError("Vite dev server failed to become ready.")

    print(f"Using application URL: {APP_URL}")

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)

        # -------------------------------------------------------------
        # DESKTOP VIEWPORT (1440 x 900)
        # -------------------------------------------------------------
        print("Opening desktop browser context (1440 x 900)...")
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.newPage() if hasattr(context, "newPage") else context.new_page()

        page.goto(APP_URL, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # 1. Landing Page / Visual Identity (1900s Adda Hero)
        print("Capturing 01: landing-page.png...")
        page.screenshot(path="artifacts/screenshots/landing-page.png")

        # 2. Era Switcher 2020s Café
        print("Toggling to 2020s Modern Café era...")
        switch_2020 = page.locator("button:has-text('2020s'), button:has-text('The modern')").first
        if switch_2020.count() > 0:
            switch_2020.click()
            page.wait_for_timeout(800)
        print("Capturing 02: era-switcher-2020s.png...")
        page.screenshot(path="artifacts/screenshots/era-switcher-2020s.png")

        # Switch back to 1900s Adda
        switch_1900 = page.locator("button:has-text('1900s'), button:has-text('The original')").first
        if switch_1900.count() > 0:
            switch_1900.click()
            page.wait_for_timeout(600)

        # 3. Tea Menu Catalogue
        print("Scrolling to menu catalogue...")
        page.evaluate("window.scrollTo(0, 750)")
        page.wait_for_timeout(800)
        print("Capturing 03: tea-menu-catalogue.png...")
        page.screenshot(path="artifacts/screenshots/tea-menu-catalogue.png")

        # 4. Tea Customization Modal
        print("Triggering tea customization modal on first beverage card...")
        add_btn = page.locator(".product-card button, button:has-text('Add to Bag'), button:has-text('Select')").first
        if add_btn.count() > 0:
            add_btn.click()
            page.wait_for_timeout(800)
            print("Capturing 04: tea-customization.png...")
            page.screenshot(path="artifacts/screenshots/tea-customization.png")

            # Add to bag inside modal
            modal_add = page.locator("button:has-text('Add to bag'), button:has-text('Add to Bag')").last
            if modal_add.count() > 0:
                modal_add.click()
                page.wait_for_timeout(600)

        # 5. Order Bag Drawer
        print("Opening persistent cart drawer...")
        cart_trigger = page.locator("button[aria-label*='bag' i], button[aria-label*='cart' i], button:has-text('Bag'), .header-bag-btn").first
        if cart_trigger.count() > 0:
            cart_trigger.click()
            page.wait_for_timeout(800)
            print("Capturing 05: order-bag-drawer.png...")
            page.screenshot(path="artifacts/screenshots/order-bag-drawer.png")

            # 6. Available Time-Slot Selection (Pickup Windows)
            print("Proceeding to pickup slot selection...")
            checkout_trigger = page.locator("button:has-text('Pickup choose karo'), button:has-text('Choose pickup slot'), button:has-text('Proceed to checkout')").first
            if checkout_trigger.count() > 0:
                checkout_trigger.click()
                page.wait_for_timeout(1000)

                # Select an available slot
                slot_label = page.locator(".slots label, input[type='radio']").first
                if slot_label.count() > 0:
                    slot_label.click()
                    page.wait_for_timeout(400)

                # Fill customer details
                name_field = page.locator("input#customer-name, input[name='customerName'], input[placeholder*='Name' i]").first
                if name_field.count() > 0:
                    name_field.fill("Aarav Mohapatra")
                phone_field = page.locator("input#customer-phone, input[name='customerPhone'], input[placeholder*='Phone' i], input[type='tel']").first
                if phone_field.count() > 0:
                    phone_field.fill("9876543210")
                notes_field = page.locator("input[placeholder*='instructions' i], input[placeholder*='Extra hot' i]").first
                if notes_field.count() > 0:
                    notes_field.fill("Serve in authentic clay kulhad, extra adrak")

                print("Capturing 06: pickup-slot-selection.png...")
                page.screenshot(path="artifacts/screenshots/pickup-slot-selection.png")

                # 7. Real Order Confirmation Ticket
                print("Submitting order to receive real fulfillment ticket...")
                confirm_btn = page.locator("button:has-text('Order place karo'), button:has-text('Confirm Order'), button:has-text('Place Order')").first
                if confirm_btn.count() > 0:
                    confirm_btn.click()
                    page.wait_for_timeout(1500)
                    print("Capturing 07: order-ticket.png...")
                    page.screenshot(path="artifacts/screenshots/order-ticket.png")

        # 8. Theatre Mode / Ambient Audio Radio
        print("Testing ambient audio radio / theatre mode...")
        page.goto(APP_URL, wait_until="networkidle")
        page.wait_for_timeout(600)
        radio_cta = page.locator(".hero-radio-cta, button:has-text('Era radio'), button:has-text('Now playing')").first
        if radio_cta.count() > 0:
            radio_cta.click()
            page.wait_for_timeout(800)
            print("Capturing 08: theatre-mode-radio.png...")
            page.screenshot(path="artifacts/screenshots/theatre-mode-radio.png")

        context.close()

        # -------------------------------------------------------------
        # MOBILE VIEWPORT (390 x 844 - iPhone 14)
        # -------------------------------------------------------------
        print("Opening mobile browser context (390 x 844)...")
        mobile_context = browser.new_context(viewport={"width": 390, "height": 844})
        mobile_page = mobile_context.new_page()
        mobile_page.goto(APP_URL, wait_until="networkidle")
        mobile_page.wait_for_timeout(800)

        # 9. Mobile Responsive Hero View
        print("Capturing 09: mobile-responsive-hero.png...")
        mobile_page.screenshot(path="artifacts/screenshots/mobile-responsive-hero.png")

        # 10. Mobile Responsive Checkout View
        print("Interacting on mobile to capture cart / responsive drawer...")
        mob_add = mobile_page.locator(".product-card button, button:has-text('Add to Bag'), button:has-text('Select')").first
        if mob_add.count() > 0:
            mob_add.click()
            mobile_page.wait_for_timeout(600)
            mob_modal_add = mobile_page.locator("button:has-text('Add to bag')").last
            if mob_modal_add.count() > 0:
                mob_modal_add.click()
                mobile_page.wait_for_timeout(500)

        mob_cart = mobile_page.locator("button[aria-label*='bag' i], button[aria-label*='cart' i], button:has-text('Bag'), .header-bag-btn").first
        if mob_cart.count() > 0:
            mob_cart.click()
            mobile_page.wait_for_timeout(800)
            print("Capturing 10: mobile-responsive-checkout.png...")
            mobile_page.screenshot(path="artifacts/screenshots/mobile-responsive-checkout.png")

        mobile_context.close()
        browser.close()
        print("Browser capture completed successfully!")

finally:
    print("Terminating Vite development server...")
    subprocess.call(["taskkill", "/F", "/T", "/PID", str(vite_proc.pid)])
    print("Cleanup completed.")

