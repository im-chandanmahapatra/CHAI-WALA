import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs('screenshots/architecture', exist_ok=True)
os.makedirs('screenshots/database', exist_ok=True)

# Set base aesthetic styling
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# ==============================================================================
# 1. SYSTEM ARCHITECTURE DIAGRAM
# ==============================================================================
def draw_system_architecture():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Background canvas
    ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#fbfbfd'))

    # Title
    ax.text(50, 96, 'CHAIWALA — Multi-Tier System Architecture', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#101113')
    ax.text(50, 92.5, 'End-to-End Component Hierarchy, Client Presentation & Persistence Tiers',
            ha='center', va='center', fontsize=9.5, color='#666666')

    # Tier 1: Client Browser / Frontend (Top Tier)
    ax.add_patch(patches.FancyBboxPatch((4, 52), 92, 36, boxstyle='round,pad=1',
                                        edgecolor='#c89a44', facecolor='#fffdfa', linewidth=1.5))
    ax.text(8, 85, 'CLIENT PRESENTATION TIER (React 19 + TypeScript + Vite)',
            fontsize=11, fontweight='bold', color='#91641b')

    # Client submodules
    client_boxes = [
        ('Presentation Components', ['SiteHeader & Wordmark', 'CinematicHero (Dual Era)', 'EraSwitcher (1900s / 2020s)', 'EraMenuSection & Cards', 'OrderRitual & BrandStory'], 6, 55, 27, 27),
        ('Interactive & Audio Subsystems', ['DynamicIslandPlayer', 'EraRadio / AddaSessions', 'TheatreModeOverlay', 'Customization Modal', 'Cart Slide-Over Drawer'], 36, 55, 28, 27),
        ('State & Data Layer', ['CartContext (React Context)', 'ordering.ts (Adapter/RPC)', 'radio-audio.ts (Web Audio)', 'seed-data.ts (19 Products)', 'MockSupabaseBackend (LocalStorage)'], 67, 55, 27, 27)
    ]

    for title, items, x, y, w, h in client_boxes:
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.6',
                                            edgecolor='#d5cfc5', facecolor='#ffffff', linewidth=1))
        ax.text(x + w/2, y + h - 3, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#222222')
        for idx, item in enumerate(items):
            ax.text(x + 2, y + h - 7.5 - (idx * 4.2), f"• {item}", fontsize=8, color='#444444')

    # Connecting Arrow
    ax.annotate('', xy=(50, 41), xytext=(50, 50),
                arrowprops=dict(facecolor='#f04e30', edgecolor='#f04e30', width=2.5, headwidth=8, headlength=8))
    ax.text(50, 45.5, 'HTTPS / JSON REST & RPC Payloads (idempotency-key, slot reservation, tokens)',
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#f04e30',
            bbox=dict(boxstyle='square,pad=0.2', facecolor='#ffffff', edgecolor='#f04e30', alpha=0.9))

    # Tier 2: Backend & Persistence Tier (Bottom Tier)
    ax.add_patch(patches.FancyBboxPatch((4, 6), 92, 33, boxstyle='round,pad=1',
                                        edgecolor='#2563eb', facecolor='#f8faff', linewidth=1.5))
    ax.text(8, 36, 'BACKEND & PERSISTENCE TIER (PostgreSQL 15 / Supabase Engine)',
            fontsize=11, fontweight='bold', color='#1d4ed8')

    backend_boxes = [
        ('Relational Database Schema', ['stores & admin_users', 'products & option_groups', 'pickup_slots (Time-bound)', 'orders & order_items', 'order_status_history & audit_logs'], 6, 8, 27, 25),
        ('Stored Procedures & RPCs', ['create_order() (Atomic Placement)', 'get_order_tracking() (Timeline)', 'transition_order_status() (FSM)', 'Concurrency slot reservation', 'Automatic tax (5% GST) calc'], 36, 8, 28, 25),
        ('Security & Policy Layer', ['Row Level Security (RLS)', 'Anonymous Token-based Read', 'Barista/Admin Role Guards', 'Strict Terminal FSM Enforcement', 'Idempotency Deduping Engine'], 67, 8, 27, 25)
    ]

    for title, items, x, y, w, h in backend_boxes:
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.6',
                                            edgecolor='#bfdbfe', facecolor='#ffffff', linewidth=1))
        ax.text(x + w/2, y + h - 3, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1e3a8a')
        for idx, item in enumerate(items):
            ax.text(x + 2, y + h - 7 - (idx * 3.8), f"• {item}", fontsize=8, color='#334155')

    plt.tight_layout()
    plt.savefig('screenshots/architecture/system_architecture.png', bbox_inches='tight')
    plt.close()
    print("Generated screenshots/architecture/system_architecture.png")


# ==============================================================================
# 2. SYSTEM WORKFLOW DIAGRAM
# ==============================================================================
def draw_system_workflow():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#fbfbfd'))

    ax.text(50, 96, 'CHAIWALA — End-to-End Customer & Order Workflow',
            ha='center', va='center', fontsize=15, fontweight='bold', color='#101113')
    ax.text(50, 92, 'Step-by-Step Lifecycle from Counter Arrival to Pickup Ticket Collection',
            ha='center', va='center', fontsize=9.5, color='#666666')

    steps = [
        ("1. Arrival & Era Selection", "Scan counter QR code;\nCinematic hero opens;\nSelect 1900s Adda or\n2020s Modern Café.", 3, 56, 17, 30, '#fffbeb', '#b45309'),
        ("2. Menu & Customization", "Browse era catalog;\nOpen customization modal;\nSelect sugar level, cup size,\nand beverage add-ons.", 22.5, 56, 17, 30, '#f0fdf4', '#15803d'),
        ("3. Order Bag Validation", "Review order line items;\nAuto-calc 5% GST &\npackaging fee (₹10);\nVerify total at counter.", 42, 56, 17, 30, '#eff6ff', '#1d4ed8'),
        ("4. Pickup Window Booking", "Choose available 15-min slot;\nConcurrency check ensures\n<= 6 orders per window;\nEnter customer details.", 61.5, 56, 17, 30, '#faf5ff', '#7e22ce'),
        ("5. Placement & Confirmation", "Invoke create_order RPC;\nGenerate secure order # (CW-X)\nand tracking token (cwtk_...);\nRender instant digital ticket.", 81, 56, 17, 30, '#fff1f2', '#be123c')
    ]

    for title, desc, x, y, w, h, bg, border in steps:
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.8',
                                            edgecolor=border, facecolor=bg, linewidth=1.5))
        ax.text(x + w/2, y + h - 4, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=border)
        ax.text(x + 1.5, y + 15, desc, ha='left', va='center', fontsize=8.2, color='#333333', linespacing=1.3)

    # Connecting horizontal arrows between stages 1 to 5
    for i in range(4):
        x_start = steps[i][2] + steps[i][4]
        x_end = steps[i+1][2]
        ax.annotate('', xy=(x_end, 71), xytext=(x_start, 71),
                    arrowprops=dict(facecolor='#101113', edgecolor='#101113', width=2, headwidth=6, headlength=6))

    # Bottom Kitchen Fulfillment Lifecycle
    ax.add_patch(patches.FancyBboxPatch((3, 8), 94, 38, boxstyle='round,pad=1',
                                        edgecolor='#475569', facecolor='#f1f5f9', linewidth=1.2))
    ax.text(6, 42, 'KITCHEN FSM FULFILLMENT & STATE MACHINE (transition_order_status RPC)',
            fontsize=10.5, fontweight='bold', color='#1e293b')

    fsm_nodes = [
        ("PENDING_CONFIRMATION", "Initial state upon RPC submit;\nSlot capacity decremented", 6, 13, 20, 23, '#ffffff', '#64748b'),
        ("CONFIRMED", "Barista acknowledges ticket;\nKitchen prep list updated", 29.5, 13, 19, 23, '#eff6ff', '#2563eb'),
        ("PREPARING", "Chai brewing on gas burner;\nSnacks toasted at station", 51.5, 13, 19, 23, '#fff7ed', '#ea580c'),
        ("READY_FOR_PICKUP", "Packed in eco-paper bag;\nCustomer notified for pickup", 73.5, 13, 21, 23, '#f0fdf4', '#16a34a')
    ]

    for title, desc, x, y, w, h, bg, border in fsm_nodes:
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.6',
                                            edgecolor=border, facecolor=bg, linewidth=1.2))
        ax.text(x + w/2, y + h - 3.5, title, ha='center', va='center', fontsize=8.2, fontweight='bold', color=border)
        ax.text(x + 1.5, y + 9, desc, ha='left', va='center', fontsize=7.6, color='#475569', linespacing=1.2)

    for i in range(3):
        x_s = fsm_nodes[i][2] + fsm_nodes[i][4]
        x_e = fsm_nodes[i+1][2]
        ax.annotate('', xy=(x_e, 24.5), xytext=(x_s, 24.5),
                    arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1.5, headwidth=5, headlength=5))

    # Downward arrow from step 5 to FSM
    ax.annotate('', xy=(85, 36), xytext=(89, 56),
                arrowprops=dict(facecolor='#be123c', edgecolor='#be123c', width=1.8, headwidth=6, headlength=6))
    ax.text(88, 46, 'FSM Trigger', fontsize=8, fontweight='bold', color='#be123c', rotation=-65)

    plt.tight_layout()
    plt.savefig('screenshots/architecture/system_workflow.png', bbox_inches='tight')
    plt.close()
    print("Generated screenshots/architecture/system_workflow.png")


# ==============================================================================
# 3. USE CASE DIAGRAM
# ==============================================================================
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#fbfbfd'))

    ax.text(50, 96, 'CHAIWALA — System Use Case Diagram',
            ha='center', va='center', fontsize=15, fontweight='bold', color='#101113')
    ax.text(50, 92.5, 'Primary Actors, Boundaries, and Core Operational Use Cases',
            ha='center', va='center', fontsize=9.5, color='#666666')

    # System boundary
    ax.add_patch(patches.FancyBboxPatch((22, 6), 56, 83, boxstyle='round,pad=1',
                                        edgecolor='#101113', facecolor='#ffffff', linewidth=1.5, linestyle='--'))
    ax.text(50, 86, 'CHAIWALA SYSTEM BOUNDARY', ha='center', va='center', fontsize=10.5, fontweight='bold', color='#101113')

    # Actors
    # Actor 1: Customer (Left)
    ax.add_patch(patches.Circle((10, 68), 3.5, edgecolor='#b45309', facecolor='#fffbeb', linewidth=1.5))
    ax.plot([10, 10], [64.5, 54], color='#b45309', linewidth=2)
    ax.plot([10, 5], [60, 54], color='#b45309', linewidth=2)
    ax.plot([10, 15], [60, 54], color='#b45309', linewidth=2)
    ax.plot([10, 6], [54, 45], color='#b45309', linewidth=2)
    ax.plot([10, 14], [54, 45], color='#b45309', linewidth=2)
    ax.text(10, 41, 'CUSTOMER\n(Dine-in / Takeaway)', ha='center', va='center', fontsize=9, fontweight='bold', color='#b45309')

    # Actor 2: Barista / Kitchen Staff (Right Top)
    ax.add_patch(patches.Circle((90, 72), 3.2, edgecolor='#1d4ed8', facecolor='#eff6ff', linewidth=1.5))
    ax.plot([90, 90], [68.8, 60], color='#1d4ed8', linewidth=2)
    ax.plot([90, 85], [65, 60], color='#1d4ed8', linewidth=2)
    ax.plot([90, 95], [65, 60], color='#1d4ed8', linewidth=2)
    ax.plot([90, 86], [60, 52], color='#1d4ed8', linewidth=2)
    ax.plot([90, 94], [60, 52], color='#1d4ed8', linewidth=2)
    ax.text(90, 48, 'BARISTA / STAFF\n(Counter Operations)', ha='center', va='center', fontsize=9, fontweight='bold', color='#1d4ed8')

    # Actor 3: Store Manager / Admin (Right Bottom)
    ax.add_patch(patches.Circle((90, 28), 3.2, edgecolor='#15803d', facecolor='#f0fdf4', linewidth=1.5))
    ax.plot([90, 90], [24.8, 16], color='#15803d', linewidth=2)
    ax.plot([90, 85], [21, 16], color='#15803d', linewidth=2)
    ax.plot([90, 95], [21, 16], color='#15803d', linewidth=2)
    ax.plot([90, 86], [16, 8], color='#15803d', linewidth=2)
    ax.plot([90, 94], [16, 8], color='#15803d', linewidth=2)
    ax.text(90, 4, 'STORE MANAGER\n(Catalog & Reports)', ha='center', va='center', fontsize=9, fontweight='bold', color='#15803d')

    # Use Case Ovals inside boundary
    use_cases = [
        ("UC1: Browse Era-Specific Menu & Stories", 50, 80, 42, 6.5, '#fffbeb', '#b45309'),
        ("UC2: Customize Beverage (Sugar/Size/Addons)", 50, 71, 42, 6.5, '#fffbeb', '#b45309'),
        ("UC3: Manage Bag & Review Itemized Taxes", 50, 62, 42, 6.5, '#fffbeb', '#b45309'),
        ("UC4: Select 15-Min Capacity-Controlled Slot", 50, 53, 42, 6.5, '#fffbeb', '#b45309'),
        ("UC5: Place Order & Obtain Secure Ticket", 50, 44, 42, 6.5, '#fffbeb', '#b45309'),
        ("UC6: Track Real-Time Order Status Timeline", 50, 35, 42, 6.5, '#eff6ff', '#1d4ed8'),
        ("UC7: Transition Kitchen Order Status (FSM)", 50, 26, 42, 6.5, '#eff6ff', '#1d4ed8'),
        ("UC8: Toggle Menu Availability (86 Items)", 50, 17, 42, 6.5, '#f0fdf4', '#15803d'),
        ("UC9: Inspect Order Audit Logs & Financials", 50, 8, 42, 6.5, '#f0fdf4', '#15803d')
    ]

    for title, cx, cy, w, h, bg, border in use_cases:
        ellipse = patches.Ellipse((cx, cy), w, h, edgecolor=border, facecolor=bg, linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(cx, cy, title, ha='center', va='center', fontsize=8.2, fontweight='bold', color=border)

    # Connections from Customer to UC1-UC5
    for cy in [80, 71, 62, 53, 44, 35]:
        ax.plot([14, 29], [58, cy], color='#b45309', linewidth=1, linestyle='-')

    # Connections from Barista to UC6, UC7
    for cy in [35, 26]:
        ax.plot([86, 71], [62, cy], color='#1d4ed8', linewidth=1, linestyle='-')

    # Connections from Manager to UC8, UC9
    for cy in [17, 8]:
        ax.plot([86, 71], [18, cy], color='#15803d', linewidth=1, linestyle='-')

    plt.tight_layout()
    plt.savefig('screenshots/architecture/use_case_diagram.png', bbox_inches='tight')
    plt.close()
    print("Generated screenshots/architecture/use_case_diagram.png")


# ==============================================================================
# 4. DATA FLOW DIAGRAM (DFD LEVEL-1)
# ==============================================================================
def draw_data_flow_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#fbfbfd'))

    ax.text(50, 96, 'CHAIWALA — Data Flow Diagram (Level-1 DFD)',
            ha='center', va='center', fontsize=15, fontweight='bold', color='#101113')
    ax.text(50, 92.5, 'Information Flows Between External Entities, Processes, and Data Stores',
            ha='center', va='center', fontsize=9.5, color='#666666')

    # External Entities (Rectangles)
    # Customer
    ax.add_patch(patches.Rectangle((4, 60), 18, 14, edgecolor='#b45309', facecolor='#fffbeb', linewidth=1.5))
    ax.text(13, 67, 'CUSTOMER\n(Browser Client)', ha='center', va='center', fontsize=9, fontweight='bold', color='#b45309')

    # Barista Counter
    ax.add_patch(patches.Rectangle((78, 60), 18, 14, edgecolor='#1d4ed8', facecolor='#eff6ff', linewidth=1.5))
    ax.text(87, 67, 'BARISTA\n(Kitchen Display)', ha='center', va='center', fontsize=9, fontweight='bold', color='#1d4ed8')

    # Processes (Circles/Rounded)
    processes = [
        ("1.0\nMenu Filter &\nCatalogue Retrieval", 36, 76, 12, '#ffffff', '#222222'),
        ("2.0\nCart Pricing &\nTax Assessment", 36, 48, 12, '#ffffff', '#222222'),
        ("3.0\nSlot Allocation &\nCapacity Control", 64, 48, 12, '#ffffff', '#222222'),
        ("4.0\nAtomic Order &\nTicket Generation", 50, 22, 13, '#ffffff', '#f04e30'),
        ("5.0\nFSM Kitchen\nStatus Transition", 78, 22, 12, '#ffffff', '#15803d')
    ]

    for title, cx, cy, r, bg, border in processes:
        circle = patches.Circle((cx, cy), r, edgecolor=border, facecolor=bg, linewidth=1.5)
        ax.add_patch(circle)
        ax.text(cx, cy, title, ha='center', va='center', fontsize=7.8, fontweight='bold', color=border)

    # Data Stores (Open-ended parallel lines)
    def draw_data_store(x, y, w, h, label):
        ax.plot([x, x+w], [y, y], color='#475569', linewidth=1.5)
        ax.plot([x, x+w], [y+h, y+h], color='#475569', linewidth=1.5)
        ax.plot([x, x], [y, y+h], color='#475569', linewidth=1.5)
        ax.add_patch(patches.Rectangle((x, y), w, h, color='#f8fafc', alpha=0.8))
        ax.text(x + w/2, y + h/2, label, ha='center', va='center', fontsize=8, fontweight='bold', color='#334155')

    draw_data_store(3, 20, 22, 6, 'D1: Products & Options')
    draw_data_store(3, 10, 22, 6, 'D2: Pickup Slots')
    draw_data_store(40, 4, 24, 6, 'D3: Orders & Order Items')
    draw_data_store(72, 4, 24, 6, 'D4: Status History Log')

    # Connecting Arrows with labels
    # Customer to 1.0
    ax.annotate('', xy=(28, 76), xytext=(22, 70),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(23, 75, 'Era preference', fontsize=7, color='#475569', rotation=20)

    # D1 to 1.0
    ax.annotate('', xy=(36, 68), xytext=(14, 26),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(20, 45, 'Catalogue data', fontsize=7, color='#475569', rotation=60)

    # Customer to 2.0
    ax.annotate('', xy=(28, 52), xytext=(22, 63),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(21, 56, 'Add item / options', fontsize=7, color='#475569', rotation=-25)

    # 2.0 to 3.0
    ax.annotate('', xy=(56, 48), xytext=(44, 48),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(50, 50, 'Verified cart', fontsize=7, color='#475569', ha='center')

    # D2 to 3.0
    ax.annotate('', xy=(64, 40), xytext=(18, 16),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(38, 30, 'Slot availability', fontsize=7, color='#475569', rotation=30)

    # 3.0 to 4.0
    ax.annotate('', xy=(50, 31), xytext=(60, 41),
                arrowprops=dict(facecolor='#f04e30', edgecolor='#f04e30', width=1.2, headwidth=5))
    ax.text(58, 33, 'Lock slot', fontsize=7.2, fontweight='bold', color='#f04e30')

    # 4.0 to D3
    ax.annotate('', xy=(52, 10), xytext=(52, 14),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(54, 12, 'Persist order', fontsize=7, color='#475569')

    # 4.0 to Customer
    ax.annotate('', xy=(12, 60), xytext=(42, 22),
                arrowprops=dict(facecolor='#15803d', edgecolor='#15803d', width=1.2, headwidth=5))
    ax.text(23, 37, 'Order Ticket & Token', fontsize=7.2, fontweight='bold', color='#15803d', rotation=50)

    # 4.0 to Barista
    ax.annotate('', xy=(85, 60), xytext=(58, 26),
                arrowprops=dict(facecolor='#1d4ed8', edgecolor='#1d4ed8', width=1.2, headwidth=5))
    ax.text(76, 40, 'New Order Notification', fontsize=7.2, fontweight='bold', color='#1d4ed8', rotation=-50)

    # Barista to 5.0
    ax.annotate('', xy=(80, 30), xytext=(85, 60),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(85, 45, 'Update status', fontsize=7, color='#475569')

    # 5.0 to D4
    ax.annotate('', xy=(80, 10), xytext=(80, 14),
                arrowprops=dict(facecolor='#475569', edgecolor='#475569', width=1, headwidth=4))
    ax.text(82, 12, 'Audit event', fontsize=7, color='#475569')

    plt.tight_layout()
    plt.savefig('screenshots/architecture/data_flow_diagram.png', bbox_inches='tight')
    plt.close()
    print("Generated screenshots/architecture/data_flow_diagram.png")


# ==============================================================================
# 5. DATABASE ER DIAGRAM
# ==============================================================================
def draw_er_diagram():
    fig, ax = plt.subplots(figsize=(13, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.add_patch(patches.Rectangle((0, 0), 100, 100, color='#fbfbfd'))

    ax.text(50, 97, 'CHAIWALA — Relational Database Entity-Relationship Diagram',
            ha='center', va='center', fontsize=15, fontweight='bold', color='#101113')
    ax.text(50, 94, 'PostgreSQL 15 / Supabase Production Schema: Entities, Primary/Foreign Keys & Relations',
            ha='center', va='center', fontsize=9.5, color='#666666')

    # Entity drawing helper
    def draw_entity(x, y, w, h, name, fields, header_color='#1e293b'):
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.4',
                                            edgecolor=header_color, facecolor='#ffffff', linewidth=1.2))
        # Header bar
        header_h = 4.2
        ax.add_patch(patches.Rectangle((x, y + h - header_h), w, header_h, color=header_color))
        ax.text(x + w/2, y + h - header_h/2, name, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color='#ffffff')
        # Fields
        for idx, (f_name, f_type, is_pk, is_fk) in enumerate(fields):
            curr_y = y + h - header_h - 2.8 - (idx * 2.8)
            prefix = "PK " if is_pk else ("FK " if is_fk else "   ")
            f_color = '#b45309' if is_pk else ('#2563eb' if is_fk else '#333333')
            ax.text(x + 1.2, curr_y, prefix + f_name, fontsize=7.2, fontweight='bold' if (is_pk or is_fk) else 'normal', color=f_color)
            ax.text(x + w - 1.2, curr_y, f_type, ha='right', fontsize=6.8, color='#666666')

    # 1. stores
    draw_entity(3, 68, 22, 23, 'stores', [
        ('id', 'UUID', True, False),
        ('name', 'TEXT', False, False),
        ('slug', 'TEXT [UQ]', False, False),
        ('is_open', 'BOOLEAN', False, False),
        ('opening_time', 'TIME', False, False),
        ('closing_time', 'TIME', False, False),
        ('slot_capacity', 'INT', False, False)
    ], '#b45309')

    # 2. products
    draw_entity(29, 62, 24, 29, 'products', [
        ('id', 'UUID', True, False),
        ('store_id', 'UUID', False, True),
        ('name', 'TEXT', False, False),
        ('hindi_name', 'TEXT', False, False),
        ('slug', 'TEXT [UQ]', False, False),
        ('category', 'ENUM', False, False),
        ('mood', 'ENUM', False, False),
        ('base_price_paise', 'INT', False, False),
        ('prep_minutes', 'INT', False, False),
        ('is_available', 'BOOLEAN', False, False)
    ], '#047857')

    # 3. option_groups
    draw_entity(57, 72, 20, 19, 'option_groups', [
        ('id', 'UUID', True, False),
        ('product_id', 'UUID', False, True),
        ('name', 'TEXT', False, False),
        ('required', 'BOOLEAN', False, False),
        ('min_select', 'INT', False, False),
        ('max_select', 'INT', False, False)
    ], '#047857')

    # 4. option_choices
    draw_entity(80, 72, 17, 19, 'option_choices', [
        ('id', 'UUID', True, False),
        ('group_id', 'UUID', False, True),
        ('name', 'TEXT', False, False),
        ('price_delta', 'INT', False, False),
        ('is_default', 'BOOLEAN', False, False),
        ('is_available', 'BOOLEAN', False, False)
    ], '#047857')

    # 5. pickup_slots
    draw_entity(3, 34, 22, 22, 'pickup_slots', [
        ('id', 'UUID', True, False),
        ('store_id', 'UUID', False, True),
        ('slot_time', 'TIMESTAMPTZ', False, False),
        ('capacity', 'INT', False, False),
        ('booked', 'INT', False, False),
        ('status', 'TEXT', False, False)
    ], '#6d28d9')

    # 6. orders
    draw_entity(29, 23, 24, 33, 'orders', [
        ('id', 'UUID', True, False),
        ('order_number', 'TEXT [UQ]', False, False),
        ('tracking_token', 'TEXT [UQ]', False, False),
        ('store_id', 'UUID', False, True),
        ('pickup_slot_id', 'UUID', False, True),
        ('customer_name', 'TEXT', False, False),
        ('customer_phone', 'TEXT', False, False),
        ('status', 'order_status', False, False),
        ('subtotal_paise', 'INT', False, False),
        ('gst_paise', 'INT', False, False),
        ('packaging_paise', 'INT', False, False),
        ('total_paise', 'INT', False, False)
    ], '#b91c1c')

    # 7. order_items
    draw_entity(57, 34, 20, 22, 'order_items', [
        ('id', 'UUID', True, False),
        ('order_id', 'UUID', False, True),
        ('product_id', 'UUID', False, True),
        ('product_name', 'TEXT', False, False),
        ('unit_price_paise', 'INT', False, False),
        ('quantity', 'INT', False, False),
        ('line_total_paise', 'INT', False, False)
    ], '#b91c1c')

    # 8. order_item_options
    draw_entity(80, 36, 17, 18, 'order_item_options', [
        ('id', 'UUID', True, False),
        ('order_item_id', 'UUID', False, True),
        ('group_name', 'TEXT', False, False),
        ('choice_name', 'TEXT', False, False),
        ('price_delta_paise', 'INT', False, False)
    ], '#b91c1c')

    # 9. order_status_history
    draw_entity(29, 3, 24, 16, 'order_status_history', [
        ('id', 'UUID', True, False),
        ('order_id', 'UUID', False, True),
        ('status', 'order_status', False, False),
        ('actor', 'TEXT', False, False),
        ('reason', 'TEXT', False, False),
        ('created_at', 'TIMESTAMPTZ', False, False)
    ], '#475569')

    # 10. admin_users
    draw_entity(57, 10, 20, 16, 'admin_users', [
        ('id', 'UUID', True, False),
        ('email', 'TEXT [UQ]', False, False),
        ('full_name', 'TEXT', False, False),
        ('role', 'ENUM', False, False),
        ('store_id', 'UUID', False, True)
    ], '#475569')

    # Relationships Lines
    # stores (1) -> products (N)
    ax.plot([25, 29], [78, 78], color='#047857', linewidth=1.5)
    ax.text(26, 79, '1:N', fontsize=7, fontweight='bold', color='#047857')

    # products (1) -> option_groups (N)
    ax.plot([53, 57], [78, 78], color='#047857', linewidth=1.5)
    ax.text(54, 79, '1:N', fontsize=7, fontweight='bold', color='#047857')

    # option_groups (1) -> option_choices (N)
    ax.plot([77, 80], [78, 78], color='#047857', linewidth=1.5)
    ax.text(78, 79, '1:N', fontsize=7, fontweight='bold', color='#047857')

    # stores (1) -> pickup_slots (N)
    ax.plot([14, 14], [68, 56], color='#6d28d9', linewidth=1.5)
    ax.text(15, 62, '1:N', fontsize=7, fontweight='bold', color='#6d28d9')

    # pickup_slots (1) -> orders (N)
    ax.plot([25, 29], [44, 44], color='#b91c1c', linewidth=1.5)
    ax.text(26, 45, '1:N', fontsize=7, fontweight='bold', color='#b91c1c')

    # orders (1) -> order_items (N)
    ax.plot([53, 57], [44, 44], color='#b91c1c', linewidth=1.5)
    ax.text(54, 45, '1:N', fontsize=7, fontweight='bold', color='#b91c1c')

    # order_items (1) -> order_item_options (N)
    ax.plot([77, 80], [44, 44], color='#b91c1c', linewidth=1.5)
    ax.text(78, 45, '1:N', fontsize=7, fontweight='bold', color='#b91c1c')

    # orders (1) -> order_status_history (N)
    ax.plot([41, 41], [23, 19], color='#475569', linewidth=1.5)
    ax.text(42, 21, '1:N', fontsize=7, fontweight='bold', color='#475569')

    plt.tight_layout()
    plt.savefig('screenshots/database/er_diagram.png', bbox_inches='tight')
    plt.close()
    print("Generated screenshots/database/er_diagram.png")

if __name__ == '__main__':
    draw_system_architecture()
    draw_system_workflow()
    draw_use_case_diagram()
    draw_data_flow_diagram()
    draw_er_diagram()
    print("All diagrams generated successfully!")
