import os
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer
import threading
import time
import sys
from playwright.sync_api import sync_playwright

PORT = 5195
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = CURRENT_DIR if os.path.exists(os.path.join(CURRENT_DIR, 'client')) else os.path.dirname(CURRENT_DIR)
DIST_DIR = os.path.join(REPO_ROOT, 'client', 'dist')
SCREENSHOTS_DIR = os.path.join(REPO_ROOT, 'artifacts', 'screenshots')

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with full HTTP Range request (206 Partial Content) support."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def log_message(self, format, *args):
        pass # suppress request noise

    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                self.send_response(301)
                new_parts = (parts[0], parts[1], parts[2] + '/', parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs[6]

        range_header = self.headers.get('Range')
        if range_header:
            try:
                range_match = range_header.strip().split('=')[1]
                start_str, end_str = range_match.split('-')
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else size - 1
                end = min(end, size - 1)
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()
                f.seek(start)
                return f
            except Exception:
                pass

        self.send_response(200)
        self.send_header("Content-type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return f

server = HTTPServer(('127.0.0.1', PORT), RangeHTTPRequestHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()
time.sleep(1)
print(f"Test server running on http://127.0.0.1:{PORT}")

test_results = {}
console_errors = []

def run_tests():
    with sync_playwright() as p:
        browser = None
        for channel in ["msedge", "chrome", None]:
            try:
                if channel:
                    browser = p.chromium.launch(channel=channel, headless=True)
                else:
                    browser = p.chromium.launch(headless=True)
                print(f"Launched Chromium with channel: {channel}")
                break
            except Exception as e:
                print(f"Could not launch with channel {channel}: {e}")
        
        if not browser:
            print("Failed to launch any browser!")
            return False

        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # ---------------------------------------------------------------------
        # SCENARIO 1 & 2: 2020s Theme & Correct Track Metadata
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 1 & 2: 2020s Café Track Playback & Metadata ---")
        page.goto(f"http://127.0.0.1:{PORT}/?era=2020s", wait_until="load")
        time.sleep(1)

        title_el = page.locator(".cafe-now-playing-title")
        title_text = title_el.text_content()
        artist_el = page.locator(".cafe-now-playing-artist")
        artist_text = artist_el.text_content()
        print(f"Displayed Title: {title_text}")
        print(f"Displayed Artist/Movie: {artist_text}")

        assert "Zara Sa" in title_text, f"Expected 'Zara Sa' in title, got: {title_text}"
        assert "KK" in artist_text, f"Expected 'KK' in artist, got: {artist_text}"
        test_results["Scenario 1 & 2 (2020s Metadata & Title)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 3: Draggable Seek Bar & Seeking to 01:35
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 3: Draggable Seek Bar & Seeking to 01:35 ---")
        play_btn = page.locator(".cafe-transport-row .radio-circular-play-btn")
        play_btn.click()
        time.sleep(1.5)

        audio_src = page.evaluate("() => document.querySelector('audio')?.src")
        print(f"Audio src: {audio_src}")
        assert "/audio/2000s/-8C_2BBVWk8.mp3" in audio_src, f"Unexpected audio src: {audio_src}"

        # Drag/fill slider to 95 seconds (01:35)
        range_input = page.locator(".cafe-scrubber-wrapper input[type='range']")
        range_input.fill("95")
        time.sleep(1)

        current_audio_time = page.evaluate("() => document.querySelector('audio')?.currentTime")
        is_playing_after_seek = page.evaluate("() => !document.querySelector('audio')?.paused")
        print(f"Audio currentTime after seek: {current_audio_time:.2f}s (playing: {is_playing_after_seek})")
        assert abs(current_audio_time - 95.0) < 5, f"Expected ~95s, got {current_audio_time}"
        assert is_playing_after_seek, "Audio should continue playing from 01:35 position"

        # Check timestamp label in UI shows 01:35
        curr_time_label = page.locator(".cafe-scrubber-wrapper .seek-timestamp.current").text_content()
        print(f"Seek bar current time display: {curr_time_label}")
        assert "01:3" in curr_time_label, f"Expected 01:35 timestamp display, got {curr_time_label}"
        test_results["Scenario 3 (Seek Bar Drag & Sync to 01:35)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 4: Pause, Resume, Skip Next & Previous
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 4: Pause, Resume, Next, Previous ---")
        # Pause
        play_btn.click()
        time.sleep(0.5)
        is_paused = page.evaluate("() => document.querySelector('audio')?.paused")
        assert is_paused, "Expected audio to be paused"

        # Resume
        play_btn.click()
        time.sleep(0.5)
        is_playing = page.evaluate("() => !document.querySelector('audio')?.paused")
        assert is_playing, "Expected audio to be playing"

        # Skip Next
        next_btn = page.locator(".cafe-control-btn[aria-label='Next track']")
        next_btn.click()
        time.sleep(1.5)

        new_title = page.locator(".cafe-now-playing-title").text_content()
        new_src = page.evaluate("() => document.querySelector('audio')?.src")
        print(f"Track 2 Title: {new_title}")
        print(f"Track 2 Src: {new_src}")
        assert "Surili Akhiyon Wale" in new_title, f"Expected 'Surili Akhiyon Wale', got {new_title}"
        assert "0dUdnlAps9Q.mp3" in new_src, f"Expected 0dUdnlAps9Q.mp3, got {new_src}"

        # Skip Previous (first click inside 4s goes to track 1)
        prev_btn = page.locator(".cafe-control-btn[aria-label='Previous track']")
        prev_btn.click()
        time.sleep(1.5)
        back_title = page.locator(".cafe-now-playing-title").text_content()
        print(f"Track after Prev: {back_title}")
        assert "Zara Sa" in back_title, f"Expected 'Zara Sa', got {back_title}"
        test_results["Scenario 4 (Pause, Resume, Next, Prev)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 5: Auto-advance to Next Track on Ended
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 5: Auto-advance on Track Ended ---")
        page.evaluate("""() => {
            const audio = document.querySelector('audio');
            if (audio) {
                audio.dispatchEvent(new Event('ended'));
            }
        }""")
        time.sleep(1.5)
        autonext_title = page.locator(".cafe-now-playing-title").text_content()
        print(f"Auto-advanced Track Title: {autonext_title}")
        assert "Surili Akhiyon Wale" in autonext_title, f"Expected auto advance to Track 2, got {autonext_title}"
        test_results["Scenario 5 (Auto-advance on Track End)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 6 & 7: Theme Switching (90s vs 2020s Playlists)
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 6 & 7: Theme Switching ---")
        # Click the 1900s Adda switch pill in the UI
        switch_to_1900s = page.locator(".era-switch-pill").first
        switch_to_1900s.click()
        time.sleep(1.5)

        walkman_badge = page.locator(".walkman-model-badge").text_content()
        print(f"1900s Walkman Badge: {walkman_badge}")
        assert "WM-1900" in walkman_badge, f"Expected WM-1900 badge, got {walkman_badge}"

        # Play 1900s audio
        hero_radio = page.locator(".hero-radio-cta")
        hero_radio.click()
        time.sleep(1.5)

        src_90s = page.evaluate("() => document.querySelector('audio')?.src")
        print(f"90s Era Audio Src: {src_90s}")
        assert "90s_playlist.mp3" in src_90s, f"Expected 90s_playlist.mp3, got {src_90s}"

        # Switch back to 2020s Café via UI switcher pill
        switch_to_2020s = page.locator(".era-switch-pill").nth(1)
        switch_to_2020s.click()
        time.sleep(1.5)

        # Confirm 2020s radio section returns and plays 2000s music
        hero_radio_2020s = page.locator(".hero-radio-cta")
        hero_radio_2020s.click()
        time.sleep(1.5)
        src_2020s = page.evaluate("() => document.querySelector('audio')?.src")
        print(f"Back to 2020s Audio Src: {src_2020s}")
        assert "2000s" in src_2020s, f"Expected 2000s source, got {src_2020s}"
        test_results["Scenario 6 & 7 (Theme Isolation & Switching)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 8: Playlist Drawer Browse & Track Selection
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 8: Drawer Browse & Specific Track ---")
        drawer_btn = page.locator(".cafe-action-pill-btn.drawer-toggle")
        drawer_btn.click()
        time.sleep(0.5)

        rows = page.locator(".cafe-drawer-row")
        drawer_count = rows.count()
        print(f"Tracks in Drawer: {drawer_count}")
        assert drawer_count == 35, f"Expected 35 tracks in drawer, got {drawer_count}"

        row_9 = rows.nth(8)
        row_9_title = row_9.locator(".row-track-title").text_content()
        print(f"Clicking Track 9: {row_9_title}")
        row_9.click()
        time.sleep(1.5)

        active_title = page.locator(".cafe-now-playing-title").text_content()
        print(f"Now playing after drawer click: {active_title}")
        assert "Enna Sona" in active_title, f"Expected Enna Sona, got {active_title}"
        test_results["Scenario 8 (Drawer & 35 Tracks Integrity)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 9: Mobile Responsiveness
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 9: Mobile Viewport (375x667) ---")
        page.set_viewport_size({"width": 375, "height": 667})
        time.sleep(1)

        mobile_play = page.locator(".cafe-transport-row .radio-circular-play-btn")
        assert mobile_play.is_visible(), "Play button not visible on mobile"
        mobile_seek = page.locator(".cafe-scrubber-wrapper input[type='range']")
        assert mobile_seek.is_visible(), "Seek bar not visible on mobile"
        
        os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
        ss_path = os.path.join(SCREENSHOTS_DIR, 'cafe_radio_mobile_test.png')
        page.screenshot(path=ss_path)
        print(f"Saved mobile screenshot: {ss_path}")
        test_results["Scenario 9 (Mobile Responsiveness)"] = "PASSED"

        # ---------------------------------------------------------------------
        # SCENARIO 10: Single Audio Instance & Console Check
        # ---------------------------------------------------------------------
        print("\n--- Running Scenario 10: Audio Instance Integrity & Console Check ---")
        audio_count = page.evaluate("() => document.querySelectorAll('audio').length")
        print(f"Total HTMLAudioElements in DOM: {audio_count}")
        assert audio_count <= 1, f"Found multiple audio elements in DOM: {audio_count}"

        clean_errors = [e for e in console_errors if "favicon" not in e and "manifest" not in e]
        print(f"Clean console errors captured: {len(clean_errors)}")
        assert len(clean_errors) == 0, f"Unexpected console errors: {clean_errors}"
        test_results["Scenario 10 (Single Instance & Zero Console Errors)"] = "PASSED"

        # Capture Desktop Full Page Screenshot
        page.set_viewport_size({"width": 1440, "height": 900})
        time.sleep(0.5)
        page.locator("#radio").scroll_into_view_if_needed()
        time.sleep(0.5)
        ss_desktop = os.path.join(SCREENSHOTS_DIR, 'cafe_radio_desktop_test.png')
        page.screenshot(path=ss_desktop)
        print(f"Saved desktop screenshot: {ss_desktop}")

        browser.close()
        return True

try:
    success = run_tests()
    print("\n" + "="*50)
    print("TEST SUITE EXECUTION SUMMARY:")
    print("="*50)
    for test, result in test_results.items():
        print(f"  [PASS] {test}: {result}")
    print("="*50)
    if not success:
        sys.exit(1)
    else:
        print("\nALL 10 SCENARIOS VERIFIED SUCCESSFULLY!")
        sys.exit(0)
except Exception as e:
    print(f"\nTEST RUN FAILED WITH EXCEPTION: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
    sys.exit(1)
