"""
Generator for Chaiwala Professional 5-Slide Presentation (16:9 Widescreen)
Outputs: Project_Presentation.pptx
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Color Palette (derived from DESIGN_SYSTEM.md)
COLOR_BG = RGBColor(16, 17, 19)         # Ink Carbon (#101113)
COLOR_CARD_BG = RGBColor(26, 29, 34)    # Dark Charcoal (#1A1D22)
COLOR_CARD_BORDER = RGBColor(48, 54, 62)# Subtle Border (#30363E)
COLOR_MILK = RGBColor(244, 238, 229)    # Warm Milk Primary Text (#F4EEE5)
COLOR_MUTED = RGBColor(156, 163, 175)   # Slate Muted Text (#9CA3AF)
COLOR_BRASS = RGBColor(200, 154, 68)    # 1900s Adda Brass (#C89A44)
COLOR_HOT = RGBColor(240, 78, 48)       # Chai Vermilion Accent (#F04E30)
COLOR_LILAC = RGBColor(169, 149, 255)   # 2020s Café Lilac (#A995FF)
COLOR_EMERALD = RGBColor(16, 185, 129)  # Success Green (#10B981)
COLOR_WHITE = RGBColor(255, 255, 255)

FONT_HEAD = "Georgia"
FONT_BODY = "Segoe UI"

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLOR_BG

def add_header(slide, tag_text, title_text, subtitle_text):
    # Tag Pill
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.35))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag_text.upper()
    p_tag.font.size = Pt(9.5)
    p_tag.font.bold = True
    p_tag.font.name = FONT_BODY
    p_tag.font.color.rgb = COLOR_BRASS

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.name = FONT_HEAD
    p_title.font.color.rgb = COLOR_MILK

    # Subtitle
    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.38), Inches(11.733), Inches(0.35))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = subtitle_text
    p_sub.font.size = Pt(11.5)
    p_sub.font.name = FONT_BODY
    p_sub.font.color.rgb = COLOR_MUTED

    # Divider Line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = COLOR_CARD_BORDER
    line.line.color.rgb = COLOR_CARD_BORDER

def create_card(slide, left, top, width, height, border_color=COLOR_CARD_BORDER, bg_color=COLOR_CARD_BG):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1.2)
    return shape

# ==============================================================================
# SLIDE 1 — Project Identity (Cover)
# ==============================================================================
slide1 = prs.slides.add_slide(blank_layout)
set_slide_background(slide1)

# Left Content Box (Identity & Student Details)
left_card = create_card(slide1, Inches(0.8), Inches(0.8), Inches(5.6), Inches(5.9), border_color=COLOR_BRASS)

# Content inside Left Box
tb_id = slide1.shapes.add_textbox(Inches(1.1), Inches(1.1), Inches(5.0), Inches(5.3))
tf1 = tb_id.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

# Tag
p = tf1.paragraphs[0]
p.text = "ACADEMIC MINI PROJECT  •  MCA 2025–27"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(10)

# Project Name
p = tf1.add_paragraph()
p.text = "CHAIWALA"
p.font.size = Pt(40)
p.font.bold = True
p.font.name = FONT_HEAD
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)

# Tagline
p = tf1.add_paragraph()
p.text = "Chai Across Generations"
p.font.size = Pt(18)
p.font.bold = True
p.font.name = FONT_HEAD
p.font.color.rgb = COLOR_HOT
p.space_after = Pt(6)

# Cultural Motto
p = tf1.add_paragraph()
p.text = "“Waqt badla. Baithak wahi.” (Time changes. The gathering remains.)"
p.font.size = Pt(11)
p.font.italic = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(14)

# Elevator pitch
p = tf1.add_paragraph()
p.text = "A cinematic, QR-first web application bridging nostalgic 1900s Adda heritage with contemporary 2020s café-speed ordering and capacity-controlled pickup slots."
p.font.size = Pt(11)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(22)

# Student Metadata Section
p = tf1.add_paragraph()
p.text = "STUDENT & INSTITUTIONAL RECORD"
p.font.size = Pt(9)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(4)

p = tf1.add_paragraph()
r1 = p.add_run()
r1.text = "Student Presenter: "
r1.font.bold = True
r1.font.color.rgb = COLOR_MILK
r2 = p.add_run()
r2.text = "[STUDENT NAME] (Chandan Mahapatra)"
r2.font.bold = True
r2.font.color.rgb = COLOR_HOT
p.font.size = Pt(11)
p.font.name = FONT_BODY
p.space_after = Pt(3)

p = tf1.add_paragraph()
p.text = "Program: Master of Computer Applications (MCA) | Batch 2025–27"
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(3)

p = tf1.add_paragraph()
p.text = "Institution: Srusti Academy of Management and Technology (Autonomous), Bhubaneswar"
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(16)

# Tech Pill Badges
p = tf1.add_paragraph()
p.text = "⚡ React 19 + Vite   •   🗄️ PostgreSQL Slot Locks   •   📻 Web Audio API"
p.font.size = Pt(9.5)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_LILAC

# Right Visual Card (Hero Application Showcase)
right_card = create_card(slide1, Inches(6.7), Inches(0.8), Inches(5.833), Inches(5.9), border_color=COLOR_CARD_BORDER)

# Add Hero Screenshot
slide1.shapes.add_picture("screenshots/application/01_homepage_1900s_adda.png", Inches(6.9), Inches(1.05), Inches(5.433), Inches(3.4))

# Caption & Feature Callout Box below hero
cap_box = slide1.shapes.add_textbox(Inches(6.9), Inches(4.55), Inches(5.433), Inches(2.0))
tf_cap = cap_box.text_frame
tf_cap.word_wrap = True
tf_cap.margin_left = tf_cap.margin_top = tf_cap.margin_right = tf_cap.margin_bottom = 0

p = tf_cap.paragraphs[0]
p.text = "LIVE SYSTEM DEMONSTRATION"
p.font.size = Pt(9.5)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(4)

p = tf_cap.add_paragraph()
p.text = "Viewport: 1900s Nostalgic Adda Cinematic Hero & Ambient Radio Deck"
p.font.size = Pt(11.5)
p.font.bold = True
p.font.name = FONT_HEAD
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(6)

p = tf_cap.add_paragraph()
p.text = "• Seamless era switching dynamically reconfigures typography, menu catalogue, and audio soundtrack.\n• Touch-optimized responsive interface designed specifically for table QR-code scanning.\n• Eliminates physical counter line-ups through scheduled 15-minute pickup slots."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED


# ==============================================================================
# SLIDE 2 — Problem, Solution and Project Overview
# ==============================================================================
slide2 = prs.slides.add_slide(blank_layout)
set_slide_background(slide2)
add_header(slide2, 
           "CHALLENGE & SOLUTION ARCHITECTURE",
           "Modern Queue Bottlenecks vs. Authentic Heritage",
           "Eliminating rush-hour counter congestion while preserving Subcontinental tea-counter warmth.")

# Left Column: Problem & Solution Breakdown (~42% width)
left_card2 = create_card(slide2, Inches(0.8), Inches(2.0), Inches(5.2), Inches(4.9))

tb_s2 = slide2.shapes.add_textbox(Inches(1.0), Inches(2.15), Inches(4.8), Inches(4.6))
tf2 = tb_s2.text_frame
tf2.word_wrap = True
tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = 0

# Problem Header
p = tf2.paragraphs[0]
p.text = "THE PROBLEM STATEMENT"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_HOT
p.space_after = Pt(6)

p = tf2.add_paragraph()
p.text = "• Peak Rush Congestion: Morning and evening chai breaks create chaotic counter choke points and blind customer waiting."
p.font.size = Pt(10.5)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)

p = tf2.add_paragraph()
p.text = "• Cultural Commoditization: Generic delivery apps turn chai into a sterile, transactional commodity, erasing community 'adda' camaraderie."
p.font.size = Pt(10.5)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)

p = tf2.add_paragraph()
p.text = "• Kitchen Overbooking: Lack of concurrency-managed scheduling leads to dropped orders and barista overload."
p.font.size = Pt(10.5)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(14)

# Solution Header
p = tf2.add_paragraph()
p.text = "THE CHAIWALA SOLUTION — 4 CORE PILLARS"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(6)

p = tf2.add_paragraph()
p.text = "1. Dual-Era Curation: Instant toggle between 1900s Adda (brass, cutting chai, vintage radio) and 2020s Café (lilac, matcha, iced boba)."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(4)

p = tf2.add_paragraph()
p.text = "2. Tactile Customization: Real-time modifiers for sweetness, cup size (Cutting vs. Kulhad Mug), and spice blends with dynamic price computation."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(4)

p = tf2.add_paragraph()
p.text = "3. Concurrency-Controlled Slots: 15-minute pickup windows enforcing capacity limits (6 orders/slot) via PostgreSQL SELECT FOR UPDATE locks."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(4)

p = tf2.add_paragraph()
p.text = "4. Resilient Order Fulfillment: Zero-setup offline browser storage fallback combined with live Supabase RPC and cryptographic tracking tokens."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED

# Right Column: Visual Evidence (~58% width)
# Image Card 1: Customization Modal
create_card(slide2, Inches(6.3), Inches(2.0), Inches(6.233), Inches(2.35))
slide2.shapes.add_picture("screenshots/workflows/05_customization_modal.png", Inches(6.45), Inches(2.1), Inches(3.2), Inches(2.15))
tb_c1 = slide2.shapes.add_textbox(Inches(9.8), Inches(2.15), Inches(2.6), Inches(2.0))
tfc1 = tb_c1.text_frame
tfc1.word_wrap = True
tfc1.margin_left = tfc1.margin_top = tfc1.margin_right = tfc1.margin_bottom = 0
p = tfc1.paragraphs[0]
p.text = "TACTILE MODAL"
p.font.size = Pt(9)
p.font.bold = True
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(3)
p = tfc1.add_paragraph()
p.text = "Multi-Group Beverage Customization"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)
p = tfc1.add_paragraph()
p.text = "Enables precise customer control over sugar grades, cup sizing, and spice additions with real-time paise-level price delta updates."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED

# Image Card 2: Order Confirmation Ticket
create_card(slide2, Inches(6.3), Inches(4.55), Inches(6.233), Inches(2.35))
slide2.shapes.add_picture("screenshots/workflows/08_order_confirmation_ticket.png", Inches(6.45), Inches(4.65), Inches(3.2), Inches(2.15))
tb_c2 = slide2.shapes.add_textbox(Inches(9.8), Inches(4.7), Inches(2.6), Inches(2.0))
tfc2 = tb_c2.text_frame
tfc2.word_wrap = True
tfc2.margin_left = tfc2.margin_top = tfc2.margin_right = tfc2.margin_bottom = 0
p = tfc2.paragraphs[0]
p.text = "FULFILLMENT TICKET"
p.font.size = Pt(9)
p.font.bold = True
p.font.color.rgb = COLOR_EMERALD
p.space_after = Pt(3)
p = tfc2.add_paragraph()
p.text = "Digital Order Ticket (#CW-1001)"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)
p = tfc2.add_paragraph()
p.text = "Generates secure tracking tokens (cwtk_...), committed 15-minute pickup slots, and counter instructions eliminating verbal order chaos."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED


# ==============================================================================
# SLIDE 3 — Technology Stack and System Architecture
# ==============================================================================
slide3 = prs.slides.add_slide(blank_layout)
set_slide_background(slide3)
add_header(slide3,
           "SYSTEM ARCHITECTURE & TECHNICAL FOUNDATIONS",
           "Multi-Tier Reactive Architecture with Concurrency Control",
           "A production-grade separation between presentation, state orchestration, and atomic database persistence.")

# Left Column: Structured Tech Stack Cards (~44% width)
left_card3 = create_card(slide3, Inches(0.8), Inches(2.0), Inches(5.3), Inches(4.9))

tb_s3 = slide3.shapes.add_textbox(Inches(1.0), Inches(2.15), Inches(4.9), Inches(4.6))
tf3 = tb_s3.text_frame
tf3.word_wrap = True
tf3.margin_left = tf3.margin_top = tf3.margin_right = tf3.margin_bottom = 0

p = tf3.paragraphs[0]
p.text = "VERIFIED TECHNOLOGY STACK BY ROLE"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(8)

p = tf3.add_paragraph()
p.text = "🌐 Frontend Presentation Tier"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)
p = tf3.add_paragraph()
p.text = "• React 19.0.0 & Vite 6.1.0: Lightning-fast rendering and Hot Module Replacement.\n• TypeScript 5.7.3: Strict end-to-end interface typing.\n• Lucide React & Web Audio API: Featherweight vector icons and opt-in ambient radio.\n• Pure CSS Design Tokens: Zero-dependency CSS custom properties for instant theme shifts."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(8)

p = tf3.add_paragraph()
p.text = "⚙️ State & Concurrency Engine Tier"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)
p = tf3.add_paragraph()
p.text = "• React Context (CartContext): Persistent itemized bag and quantity management.\n• Integer Paise Precision: Avoids floating-point rounding errors in 5% GST and packaging fee calculations."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(8)

p = tf3.add_paragraph()
p.text = "🗄️ Database & Security Tier"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)
p = tf3.add_paragraph()
p.text = "• Supabase (PostgreSQL 15): Relational schema spanning 14 tables.\n• Atomic Stored Procedures: create_order (SELECT FOR UPDATE) and transition_order_status FSM.\n• Row Level Security (RLS): Strict tokenized order isolation protecting customer privacy."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(8)

p = tf3.add_paragraph()
p.text = "🛡️ Resilience & Mock Layer"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)
p = tf3.add_paragraph()
p.text = "• MockSupabaseBackend: PostgREST-compatible localStorage emulator for 100% offline presentations without API keys."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED

# Right Column: Architecture Diagram (~56% width)
diag_card = create_card(slide3, Inches(6.4), Inches(2.0), Inches(6.133), Inches(4.9))

# High-resolution System Architecture Diagram
slide3.shapes.add_picture("screenshots/architecture/system_architecture.png", Inches(6.55), Inches(2.15), Inches(5.833), Inches(3.6))

# Caption & Flow Explanatory Note
tb_arch = slide3.shapes.add_textbox(Inches(6.55), Inches(5.85), Inches(5.833), Inches(0.95))
tf_arch = tb_arch.text_frame
tf_arch.word_wrap = True
tf_arch.margin_left = tf_arch.margin_top = tf_arch.margin_right = tf_arch.margin_bottom = 0

p = tf_arch.paragraphs[0]
p.text = "END-TO-END EXECUTION FLOW"
p.font.size = Pt(9)
p.font.bold = True
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(2)

p = tf_arch.add_paragraph()
p.text = "Client Browser (QR Scan)  ──►  React Cart Context  ──►  Atomic RPC (create_order)\nPostgreSQL Slot Lock (FOR UPDATE)  ──►  Slot Decrement  ──►  Order Token Issued"
p.font.size = Pt(9.5)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)

p = tf_arch.add_paragraph()
p.text = "Figure 3.1: Multi-Tier Architecture combining stateless client rendering with ACID-compliant concurrency locking."
p.font.size = Pt(8.5)
p.font.italic = True
p.font.color.rgb = COLOR_MUTED


# ==============================================================================
# SLIDE 4 — Development Process, Prompts and Screenshots
# ==============================================================================
slide4 = prs.slides.add_slide(blank_layout)
set_slide_background(slide4)
add_header(slide4,
           "LIFECYCLE, AI WORKFLOW & VERIFICATION",
           "From Design System to Verified Production Code",
           "Structured software lifecycle combining prompt-assisted architecture with strict automated verification.")

# Left Column: Structured Timeline & Reconstructed AI Prompts (~45% width)
left_card4 = create_card(slide4, Inches(0.8), Inches(2.0), Inches(5.4), Inches(4.9))

tb_s4 = slide4.shapes.add_textbox(Inches(1.0), Inches(2.15), Inches(5.0), Inches(4.6))
tf4 = tb_s4.text_frame
tf4.word_wrap = True
tf4.margin_left = tf4.margin_top = tf4.margin_right = tf4.margin_bottom = 0

p = tf4.paragraphs[0]
p.text = "5-STAGE SYSTEMATIC ENGINEERING LIFECYCLE"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(6)

p = tf4.add_paragraph()
p.text = "1. Research & PRD: Cultural grounding, queue analysis, persona use-cases."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(3)

p = tf4.add_paragraph()
p.text = "2. Design Tokens: Fraunces & DM Sans typography, brass/vermilion CSS tokens."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(3)

p = tf4.add_paragraph()
p.text = "3. Database & Concurrency: 14 PostgreSQL tables, atomic RPCs, 7-state kitchen FSM."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(3)

p = tf4.add_paragraph()
p.text = "4. Reactive Implementation: React 19 UI, Web Audio radio, local mock adapter."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(3)

p = tf4.add_paragraph()
p.text = "5. Automated Verification: 31-invariant test harness & Playwright visual tests."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(12)

# AI Prompt Engineering Section
p = tf4.add_paragraph()
p.text = "RECONSTRUCTED AI DEVELOPMENT PROMPTS"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_HOT
p.space_after = Pt(6)

p = tf4.add_paragraph()
p.text = "💬 Concurrency Engineering Prompt:"
p.font.size = Pt(9.5)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)

p = tf4.add_paragraph()
p.text = "“Write an atomic PostgreSQL function for a tea counter that reserves a 15-minute slot using SELECT FOR UPDATE to prevent race conditions during rush hours.”"
p.font.size = Pt(9)
p.font.italic = True
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(6)

p = tf4.add_paragraph()
p.text = "💬 Design System Architecture Prompt:"
p.font.size = Pt(9.5)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)

p = tf4.add_paragraph()
p.text = "“Design a CSS custom property system that switches seamlessly between an authentic 1900s brass Adda theme and a modern lilac Café theme without page reload.”"
p.font.size = Pt(9)
p.font.italic = True
p.font.color.rgb = COLOR_MUTED

# Right Column: Visual Verification & Testing (~55% width)
# Image 1: Test Results
create_card(slide4, Inches(6.5), Inches(2.0), Inches(6.033), Inches(2.35))
slide4.shapes.add_picture("screenshots/testing/test_execution_results.png", Inches(6.65), Inches(2.1), Inches(3.2), Inches(2.15))
tb_t1 = slide4.shapes.add_textbox(Inches(10.0), Inches(2.15), Inches(2.4), Inches(2.0))
tft1 = tb_t1.text_frame
tft1.word_wrap = True
tft1.margin_left = tft1.margin_top = tft1.margin_right = tft1.margin_bottom = 0
p = tft1.paragraphs[0]
p.text = "VERIFIED INVARIANTS"
p.font.size = Pt(9)
p.font.bold = True
p.font.color.rgb = COLOR_EMERALD
p.space_after = Pt(3)
p = tft1.add_paragraph()
p.text = "31 / 31 Test Harness"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)
p = tft1.add_paragraph()
p.text = "Validates catalogue integrity, atomic RPC pricing, GST calculation, slot capacity decrements, and terminal state enforcement."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED

# Image 2: Pickup Slot Selector
create_card(slide4, Inches(6.5), Inches(4.55), Inches(6.033), Inches(2.35))
slide4.shapes.add_picture("screenshots/workflows/07_checkout_pickup_selection.png", Inches(6.65), Inches(4.65), Inches(3.2), Inches(2.15))
tb_t2 = slide4.shapes.add_textbox(Inches(10.0), Inches(4.7), Inches(2.4), Inches(2.0))
tft2 = tb_t2.text_frame
tft2.word_wrap = True
tft2.margin_left = tft2.margin_top = tft2.margin_right = tft2.margin_bottom = 0
p = tft2.paragraphs[0]
p.text = "CAPACITY CONTROL"
p.font.size = Pt(9)
p.font.bold = True
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(3)
p = tft2.add_paragraph()
p.text = "15-Min Pickup Selector"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)
p = tft2.add_paragraph()
p.text = "Live capacity indicators (AVAILABLE, FILLING FAST, FULL) prevent counter crowding and give customers predictable collection times."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED


# ==============================================================================
# SLIDE 5 — Repository, Conclusion and Thank You
# ==============================================================================
slide5 = prs.slides.add_slide(blank_layout)
set_slide_background(slide5)
add_header(slide5,
           "PROJECT CONCLUSION & CODEBASE ACCESS",
           "Preserving Cultural Heritage with Modern Engineering",
           "Demonstrating how thoughtful UX and robust backend concurrency solve real-world retail queue bottlenecks.")

# Left Column: Project Takeaways, Future Scope & Thank You (~50% width)
left_card5 = create_card(slide5, Inches(0.8), Inches(2.0), Inches(6.0), Inches(4.9))

tb_s5 = slide5.shapes.add_textbox(Inches(1.0), Inches(2.15), Inches(5.6), Inches(4.6))
tf5 = tb_s5.text_frame
tf5.word_wrap = True
tf5.margin_left = tf5.margin_top = tf5.margin_right = tf5.margin_bottom = 0

p = tf5.paragraphs[0]
p.text = "CORE PROJECT TAKEAWAYS"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(6)

p = tf5.add_paragraph()
p.text = "• Cultural Immersion Meets Commercial Speed: Proved that digital ordering doesn't need to be sterile; nostalgic storytelling elevates engagement while cutting queue times."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)

p = tf5.add_paragraph()
p.text = "• Atomic Concurrency Guarantees: Database row locks (SELECT FOR UPDATE) completely eliminate rush-hour double-booking and protect kitchen throughput."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(4)

p = tf5.add_paragraph()
p.text = "• Zero-Dependency Resilience: Runs anywhere — with cloud PostgreSQL/Supabase or fully offline via browser localStorage PostgREST emulation."
p.font.size = Pt(10)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(12)

# Future Scope
p = tf5.add_paragraph()
p.text = "FUTURE ENHANCEMENTS"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_LILAC
p.space_after = Pt(4)

p = tf5.add_paragraph()
p.text = "• Live Barista Kitchen Display System (KDS) via Supabase Realtime subscriptions.\n• Direct UPI payment gateway integration (Razorpay / PhonePe) with instant webhook reconciliation.\n• PWA service-worker offline caching for zero-connectivity environments."
p.font.size = Pt(9.5)
p.font.color.rgb = COLOR_MUTED
p.space_after = Pt(16)

# Thank you block
p = tf5.add_paragraph()
p.text = "THANK YOU!"
p.font.size = Pt(24)
p.font.bold = True
p.font.name = FONT_HEAD
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(2)

p = tf5.add_paragraph()
p.text = "Questions & feedback are warmly welcomed."
p.font.size = Pt(11.5)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(3)

p = tf5.add_paragraph()
p.text = "Presenter: [STUDENT NAME] (Chandan Mahapatra)  •  MCA 2025–27, Srusti Academy"
p.font.size = Pt(9.5)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED

# Right Column: Verified Repository Card with Real QR Code (~50% width)
right_card5 = create_card(slide5, Inches(7.1), Inches(2.0), Inches(5.433), Inches(4.9), border_color=COLOR_BRASS)

# Repository Heading
tb_repo = slide5.shapes.add_textbox(Inches(7.3), Inches(2.15), Inches(5.033), Inches(0.8))
tf_r = tb_repo.text_frame
tf_r.word_wrap = True
tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0

p = tf_r.paragraphs[0]
p.text = "VERIFIED GITHUB REPOSITORY"
p.font.size = Pt(10)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_BRASS
p.space_after = Pt(3)

p = tf_r.add_paragraph()
p.text = "Inspect Source Code, Migrations & Tests:"
p.font.size = Pt(11)
p.font.bold = True
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MILK
p.space_after = Pt(2)

# Clickable Hyperlink Text
p = tf_r.add_paragraph()
run = p.add_run()
run.text = "https://github.com/im-chandanmahapatra/CHAI-WALA"
run.font.size = Pt(10)
run.font.bold = True
run.font.name = FONT_BODY
run.font.color.rgb = COLOR_HOT
run.hyperlink.address = "https://github.com/im-chandanmahapatra/CHAI-WALA"

# Genuine QR Code Image Centered
slide5.shapes.add_picture("repo_qr.png", Inches(8.4), Inches(3.2), Inches(2.8), Inches(2.8))

# QR Code Scanning Instruction Note
tb_qr_inst = slide5.shapes.add_textbox(Inches(7.3), Inches(6.15), Inches(5.033), Inches(0.65))
tf_qi = tb_qr_inst.text_frame
tf_qi.word_wrap = True
tf_qi.margin_left = tf_qi.margin_top = tf_qi.margin_right = tf_qi.margin_bottom = 0

p = tf_qi.paragraphs[0]
p.text = "📱 Scan with any smartphone camera to open the live GitHub repository.\nIncludes full 30-page academic report, SQL migration scripts, and test suite."
p.alignment = PP_ALIGN.CENTER
p.font.size = Pt(9)
p.font.name = FONT_BODY
p.font.color.rgb = COLOR_MUTED

# Save presentation
output_path = "Project_Presentation.pptx"
prs.save(output_path)
print(f"PowerPoint Presentation successfully created: {output_path}")

