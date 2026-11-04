import os
import time
from playwright.sync_api import sync_playwright

APP_URL = "http://localhost:5173/"

def run():
    print("Starting screenshot capture process...")
    os.makedirs("screenshots/application", exist_ok=True)
    os.makedirs("screenshots/workflows", exist_ok=True)
    os.makedirs("screenshots/responsive", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)

        # -------------------------------------------------------------
        # DESKTOP VIEWPORT (1440 x 900)
        # -------------------------------------------------------------
        print("Launching desktop context (1440x900)...")
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto(APP_URL, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # 01. Homepage 1900s Adda
        print("Capturing 01_homepage_1900s_adda.png...")
        page.screenshot(path="screenshots/application/01_homepage_1900s_adda.png")

        # 02. Homepage 2020s Café
        print("Switching to 2020s Café mode...")
        # Switch era button
        try:
            era_btns = page.locator(".era-tab-btn, button:has-text('2020s'), button:has-text('The modern')")
            if era_btns.count() > 0:
                era_btns.first.click()
                page.wait_for_timeout(800)
        except Exception as e:
            print("Error switching to 2020s:", e)
        
        print("Capturing 02_homepage_2020s_cafe.png...")
        page.screenshot(path="screenshots/application/02_homepage_2020s_cafe.png")

        # Switch back to 1900s for menu
        try:
            era_1900 = page.locator(".era-tab-btn, button:has-text('1900s'), button:has-text('The original')")
            if era_1900.count() > 0:
                era_1900.first.click()
                page.wait_for_timeout(600)
        except Exception as e:
            print("Error switching to 1900s:", e)

        # 03. Menu Catalogue Adda
        print("Scrolling to menu catalogue...")
        page.evaluate("window.scrollTo(0, 750)")
        page.wait_for_timeout(1000)
        print("Capturing 03_menu_catalogue_adda.png...")
        page.screenshot(path="screenshots/application/03_menu_catalogue_adda.png")

        # 04. Menu Catalogue Café
        try:
            if era_btns.count() > 0:
                era_btns.first.click()
                page.wait_for_timeout(800)
        except:
            pass
        print("Capturing 04_menu_catalogue_cafe.png...")
        page.screenshot(path="screenshots/application/04_menu_catalogue_cafe.png")

        # 05. Product Customization Modal
        print("Opening product customization modal...")
        try:
            card_btns = page.locator(".product-card button, button:has-text('Add to Bag'), button:has-text('Select')")
            if card_btns.count() > 0:
                card_btns.first.click()
                page.wait_for_timeout(800)
                print("Capturing 05_customization_modal.png...")
                page.screenshot(path="screenshots/workflows/05_customization_modal.png")

                # Add to bag
                add_to_bag_btn = page.locator("button:has-text('Add to bag'), button:has-text('Add to Bag')")
                if add_to_bag_btn.count() > 0:
                    add_to_bag_btn.last.click()
                    page.wait_for_timeout(600)
        except Exception as e:
            print("Modal error:", e)

        # 06. Order Bag Drawer
        print("Opening cart/bag drawer...")
        try:
            cart_btn = page.locator("button[aria-label*='bag' i], button[aria-label*='cart' i], button:has-text('Bag'), .header-bag-btn")
            if cart_btn.count() > 0:
                cart_btn.first.click()
                page.wait_for_timeout(800)
                print("Capturing 06_order_bag_drawer.png...")
                page.screenshot(path="screenshots/workflows/06_order_bag_drawer.png")

                # 07. Checkout & Pickup Window Selection
                print("Clicking checkout / pickup choose...")
                checkout_trigger = page.locator("button:has-text('Pickup choose karo'), button:has-text('Proceed to checkout'), button:has-text('Checkout')")
                if checkout_trigger.count() > 0:
                    checkout_trigger.first.click()
                    page.wait_for_timeout(800)

                    # Fill Name and Phone
                    name_input = page.locator("input#customer-name, input[name='customerName'], input[placeholder*='Name' i]")
                    if name_input.count() > 0:
                        name_input.first.fill("Aarav Mohapatra")
                    phone_input = page.locator("input#customer-phone, input[name='customerPhone'], input[placeholder*='Phone' i], input[type='tel']")
                    if phone_input.count() > 0:
                        phone_input.first.fill("9876543210")

                    print("Capturing 07_checkout_pickup_selection.png...")
                    page.screenshot(path="screenshots/workflows/07_checkout_pickup_selection.png")

                    # 08. Submit Order & Confirmation Ticket
                    print("Submitting order for live confirmation ticket...")
                    submit_btn = page.locator("button:has-text('Order place karo'), button:has-text('Place Order'), button:has-text('Confirm Order')")
                    if submit_btn.count() > 0:
                        submit_btn.first.click()
                        page.wait_for_timeout(1500)
                        print("Capturing 08_order_confirmation_ticket.png...")
                        page.screenshot(path="screenshots/workflows/08_order_confirmation_ticket.png")
        except Exception as e:
            print("Cart/checkout error:", e)

        # 09. Audio Radio / Theatre Mode
        print("Testing audio player / theatre mode...")
        try:
            page.goto(APP_URL, wait_until="networkidle")
            page.wait_for_timeout(600)
            radio_cta = page.locator(".hero-radio-cta, button:has-text('Era radio'), button:has-text('Now playing')")
            if radio_cta.count() > 0:
                radio_cta.first.click()
                page.wait_for_timeout(800)
                print("Capturing 09_theatre_mode_radio.png...")
                page.screenshot(path="screenshots/application/09_theatre_mode_radio.png")
        except Exception as e:
            print("Radio error:", e)

        context.close()

        # -------------------------------------------------------------
        # MOBILE VIEWPORT (390 x 844 - iPhone 14)
        # -------------------------------------------------------------
        print("Launching mobile context (390x844)...")
        mob_context = browser.new_context(viewport={"width": 390, "height": 844})
        mob_page = mob_context.new_page()
        mob_page.goto(APP_URL, wait_until="networkidle")
        mob_page.wait_for_timeout(800)

        # 10. Mobile Hero View
        print("Capturing 10_mobile_hero_view.png...")
        mob_page.screenshot(path="screenshots/responsive/10_mobile_hero_view.png")

        # 11. Mobile Menu View
        print("Scrolling to mobile menu...")
        mob_page.evaluate("window.scrollTo(0, 680)")
        mob_page.wait_for_timeout(800)
        print("Capturing 11_mobile_menu_view.png...")
        mob_page.screenshot(path="screenshots/responsive/11_mobile_menu_view.png")

        # 12. Mobile Checkout View
        print("Adding item on mobile and opening bag...")
        try:
            m_card_btn = mob_page.locator(".product-card button, button:has-text('Add to Bag'), button:has-text('Select')")
            if m_card_btn.count() > 0:
                m_card_btn.first.click()
                mob_page.wait_for_timeout(600)
                m_add_bag = mob_page.locator("button:has-text('Add to bag'), button:has-text('Add to Bag')")
                if m_add_bag.count() > 0:
                    m_add_bag.last.click()
                    mob_page.wait_for_timeout(500)

            m_cart_btn = mob_page.locator("button[aria-label*='bag' i], button[aria-label*='cart' i], button:has-text('Bag'), .header-bag-btn")
            if m_cart_btn.count() > 0:
                m_cart_btn.first.click()
                mob_page.wait_for_timeout(800)
                print("Capturing 12_mobile_checkout_view.png...")
                mob_page.screenshot(path="screenshots/responsive/12_mobile_checkout_view.png")
        except Exception as e:
            print("Mobile cart error:", e)

        mob_context.close()
        browser.close()
        print("Screenshot capture finished successfully!")

if __name__ == "__main__":
    run()

