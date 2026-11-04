"""
Generate a high-resolution, modern infographic conclusion card to replace the plain text box.
Outputs:
- artifacts/screenshots/slide5_conclusion_infographic.png
- screenshots/application/slide5_conclusion_card.png
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import shutil
import os

os.makedirs('artifacts/screenshots', exist_ok=True)
os.makedirs('screenshots/application', exist_ok=True)

# Copy the generated editorial photography to screenshots & artifacts
editorial_src = r"C:\Users\HP\.gemini\antigravity\brain\2447aa8b-af4a-4f92-9ea9-38b738ef7c2a\chai_across_generations_editorial_1793727541674.jpg"
if os.path.exists(editorial_src):
    shutil.copy(editorial_src, 'artifacts/screenshots/heritage_meets_engineering_hero.jpg')
    shutil.copy(editorial_src, 'screenshots/application/heritage_meets_engineering_hero.jpg')
    print("Copied editorial photography to artifacts/screenshots/heritage_meets_engineering_hero.jpg")

# Set base aesthetic styling
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# Set high-DPI figure
fig, ax = plt.subplots(figsize=(14, 11), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Background canvas - Pure White
ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#ffffff'))

# Outer Card Frame with subtle elegant shadow & border
ax.add_patch(patches.FancyBboxPatch((2, 2), 96, 96, boxstyle='round,pad=1.5',
                                    edgecolor='#e5e7eb', facecolor='#fcfbf9', linewidth=1.5))

# ==============================================================================
# HEADER SECTION
# ==============================================================================
# Tag pill
ax.add_patch(patches.FancyBboxPatch((5, 91.5), 34, 3.8, boxstyle='round,pad=0.5',
                                    edgecolor='#b47d28', facecolor='#fef3c7', linewidth=1.2))
ax.text(22, 93.4, 'PROJECT SUMMARY & KEY TAKEAWAYS', ha='center', va='center',
        fontsize=9, fontweight='bold', color='#92400e')

# Main Title
ax.text(5, 87, 'Preserving Cultural Heritage with Modern Engineering',
        fontsize=18, fontweight='bold', color='#111827')

# Subtitle
ax.text(5, 83.2, 'Demonstrating how thoughtful UX and robust backend concurrency solve real-world retail queue bottlenecks.',
        fontsize=10.5, color='#4b5563')

# Divider line
ax.plot([5, 95], [80.5, 80.5], color='#e5e7eb', linewidth=1.2)


# ==============================================================================
# CORE ARCHITECTURAL TAKEAWAYS (3 CARDS)
# ==============================================================================
ax.text(5, 77.5, 'CORE PROJECT ACHIEVEMENTS & ARCHITECTURAL PILLARS',
        fontsize=10, fontweight='bold', color='#92400e')

pillars = [
    {
        'title': 'Cultural Immersion × Retail Speed',
        'badge': 'DUAL-ERA UX',
        'badge_bg': '#fef3c7',
        'badge_color': '#b45309',
        'border': '#d97706',
        'bg': '#ffffff',
        'stat': '0s Switch',
        'stat_label': 'CSS Tokens',
        'desc': 'Digital ordering without losing soul. Instant theme shifts between 1900s Adda and 2020s Café without page reloads or bundle bloat.'
    },
    {
        'title': 'Atomic Concurrency Guarantees',
        'badge': 'ACID LOCKING',
        'badge_bg': '#fee2e2',
        'badge_color': '#b91c1c',
        'border': '#dc2626',
        'bg': '#ffffff',
        'stat': '0 Race Cond.',
        'stat_label': 'SELECT FOR UPDATE',
        'desc': 'Eliminated rush-hour double booking. PostgreSQL row-level locks on 15-minute pickup slots strictly enforce a 6-order limit per window.'
    },
    {
        'title': 'Zero-Dependency Resilience',
        'badge': 'DUAL ADAPTER',
        'badge_bg': '#e0e7ff',
        'badge_color': '#4338ca',
        'border': '#4f46e5',
        'bg': '#ffffff',
        'stat': '100% Offline',
        'stat_label': 'LocalStorage Mock',
        'desc': 'High-availability architecture. Runs seamlessly in production with cloud PostgreSQL or 100% standalone via browser localStorage emulator.'
    }
]

card_w = 28.5
card_h = 24.5
card_gap = 4.75

for i, p in enumerate(pillars):
    cx = 5 + i * (card_w + card_gap)
    cy = 50.5
    
    # Pillar Container
    ax.add_patch(patches.FancyBboxPatch((cx, cy), card_w, card_h, boxstyle='round,pad=0.8',
                                        edgecolor=p['border'], facecolor=p['bg'], linewidth=1.4))
    
    # Top Tag
    ax.add_patch(patches.FancyBboxPatch((cx + 1.5, cy + card_h - 3.8), 12, 2.5, boxstyle='round,pad=0.3',
                                        edgecolor=p['border'], facecolor=p['badge_bg'], linewidth=1))
    ax.text(cx + 7.5, cy + card_h - 2.5, p['badge'], ha='center', va='center',
            fontsize=7.5, fontweight='bold', color=p['badge_color'])
    
    # Stat callout on right
    ax.text(cx + card_w - 2, cy + card_h - 2.5, p['stat'], ha='right', va='center',
            fontsize=9.5, fontweight='bold', color=p['border'])
    
    # Card Title
    ax.text(cx + 1.5, cy + card_h - 6.5, p['title'], fontsize=9.5, fontweight='bold', color='#111827')
    
    # Stat sublabel
    ax.text(cx + card_w - 2, cy + card_h - 4.5, p['stat_label'], ha='right', va='center',
            fontsize=6.8, color='#6b7280')
    
    # Description
    ax.text(cx + 1.5, cy + 9, p['desc'], ha='left', va='center',
            fontsize=8, color='#374151', linespacing=1.35, wrap=True)
    
    # Bottom subtle accent strip
    ax.add_patch(patches.Rectangle((cx + 1.5, cy + 1.5), card_w - 3, 0.8, color=p['border'], alpha=0.3))


# ==============================================================================
# KEY VERIFIED ENGINEERING METRICS (HORIZONTAL STRIP)
# ==============================================================================
ax.add_patch(patches.FancyBboxPatch((5, 41), 90, 6.5, boxstyle='round,pad=0.6',
                                    edgecolor='#cbd5e1', facecolor='#f8fafc', linewidth=1.2))

metrics = [
    ("31 / 31 INVARIANTS", "100% Automated Test Pass Rate", "#16a34a"),
    ("99.5 kB BUNDLE", "Production Gzipped JS (Vite)", "#0284c7"),
    ("INTEGER PAISE", "Exact GST & Tax Precision", "#d97706"),
    ("14 RELATIONAL TABLES", "PostgreSQL 15 Schema + RLS", "#7c3aed")
]

for idx, (m_val, m_lbl, m_col) in enumerate(metrics):
    mx = 6 + idx * 22.5
    ax.text(mx + 10.5, 45.2, m_val, ha='center', va='center', fontsize=9, fontweight='bold', color=m_col)
    ax.text(mx + 10.5, 42.5, m_lbl, ha='center', va='center', fontsize=7.2, color='#64748b')
    if idx < 3:
        ax.plot([mx + 21.5, mx + 21.5], [42, 46.5], color='#cbd5e1', linewidth=1)


# ==============================================================================
# FUTURE ENHANCEMENTS ROADMAP (3 COMPACT CARDS)
# ==============================================================================
ax.text(5, 36.5, 'FUTURE SCOPE & COMMERCIAL ROADMAP',
        fontsize=10, fontweight='bold', color='#4338ca')

future_items = [
    ("Live Barista KDS", "Kitchen Display System on counter tablets driven by Supabase Realtime subscriptions.", "[KDS]"),
    ("Direct UPI Settlement", "Frictionless payment intents via Razorpay & PhonePe with webhook reconciliation.", "[UPI]"),
    ("Progressive Web App", "Service worker offline shell caching for zero-connectivity railway & stall environments.", "[PWA]")
]

fw = 28.5
fh = 10.5
for idx, (f_title, f_desc, f_tag) in enumerate(future_items):
    fx = 5 + idx * (fw + card_gap)
    fy = 24.5
    
    ax.add_patch(patches.FancyBboxPatch((fx, fy), fw, fh, boxstyle='round,pad=0.6',
                                        edgecolor='#cbd5e1', facecolor='#ffffff', linewidth=1.1))
    
    # Tag
    ax.add_patch(patches.FancyBboxPatch((fx + 1.5, fy + fh - 3.2), 7, 2.0, boxstyle='round,pad=0.2',
                                        edgecolor='#94a3b8', facecolor='#f1f5f9', linewidth=0.8))
    ax.text(fx + 5, fy + fh - 2.2, f_tag, ha='center', va='center', fontsize=6.8, fontweight='bold', color='#475569')
    
    ax.text(fx + 9.5, fy + fh - 2.2, f_title, fontsize=8.8, fontweight='bold', color='#1e293b')
    ax.text(fx + 1.5, fy + 4, f_desc, fontsize=7.6, color='#475569', linespacing=1.25)


# ==============================================================================
# PRESENTATION CLOSING & PRESENTER BANNER
# ==============================================================================
ax.add_patch(patches.FancyBboxPatch((5, 5.5), 90, 16, boxstyle='round,pad=0.8',
                                    edgecolor='#b47d28', facecolor='#fffbeb', linewidth=1.6))

# Accent bar
ax.add_patch(patches.Rectangle((5, 19.5), 90, 2, color='#b47d28'))
ax.text(50, 20.5, 'FINAL EVALUATION RECORD  •  MCA MINI PROJECT (2025–27)', ha='center', va='center',
        fontsize=8.5, fontweight='bold', color='#ffffff')

# Headline
ax.text(50, 14.5, 'THANK YOU! Questions & Feedback are Warmly Welcomed.',
        ha='center', va='center', fontsize=15, fontweight='bold', color='#92400e')

# Subtext
ax.text(50, 10.8, 'Presenter: Chandan Mahapatra  •  Registration: MCA Batch 2025–27',
        ha='center', va='center', fontsize=10, fontweight='bold', color='#1f2937')

ax.text(50, 8.0, 'Srusti Academy of Management and Technology (Autonomous), Bhubaneswar  •  GitHub: github.com/im-chandanmahapatra/CHAI-WALA',
        ha='center', va='center', fontsize=8.5, color='#4b5563')

plt.tight_layout()

# Save in both locations
output1 = 'artifacts/screenshots/slide5_conclusion_infographic.png'
output2 = 'screenshots/application/slide5_conclusion_card.png'
plt.savefig(output1, bbox_inches='tight')
plt.savefig(output2, bbox_inches='tight')
plt.close()

print(f"Generated {output1}")
print(f"Generated {output2}")
