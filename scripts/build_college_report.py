import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)
DOCX_PATH = os.path.join(OUTPUT_DIR, "IBST_Mini_Project_Report.docx")

def build_report():
    doc = docx.Document()
    
    # -------------------------------------------------------------------------
    # Page Setup (Standard Letter: 8.5 x 11.0 in, Margins: Top/Bottom 0.8", Left/Right 0.75")
    # -------------------------------------------------------------------------
    s = doc.sections[0]
    s.page_width = Inches(8.5)
    s.page_height = Inches(11.0)
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.75)
    s.right_margin = Inches(0.75)
    s.header_distance = Inches(0.4)
    s.footer_distance = Inches(0.4)
    s.different_first_page_header_footer = True

    # -------------------------------------------------------------------------
    # Styling and Formatting Helpers (Strictly Formal Academic College Conventions)
    # -------------------------------------------------------------------------
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=60, bottom=60, left=80, right=80):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def chapter_title(title_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.05
        r = p.add_run(title_text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(14)
        r.bold = True
        r.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
        return p

    def section_title(section_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05
        r = p.add_run(section_text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.bold = True
        r.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
        return p

    def subsection_title(subsec_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05
        r = p.add_run(subsec_text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.bold = True
        r.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
        return p

    def academic_p(text, space_after=4, line_spacing=1.08):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
        return p

    def academic_figure(img_path, caption_text, width=Inches(5.3), space_before=4, space_after=4):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.0
        r = p.add_run()
        r.add_picture(img_path, width=width)

        cp = doc.add_paragraph()
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cp.paragraph_format.space_before = Pt(0)
        cp.paragraph_format.space_after = Pt(space_after)
        cp.paragraph_format.line_spacing = 1.0
        r_c = cp.add_run(caption_text)
        r_c.font.name = "Times New Roman"
        r_c.font.size = Pt(9.5)
        r_c.bold = True
        r_c.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
        return cp

    def academic_table(tbl, col_widths, headers, data, font_size=8.5):
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(tbl, color="9CA3AF", sz="4", val="single")

        # Header Row
        hdr_cells = tbl.rows[0].cells
        for i, title in enumerate(headers):
            hdr_cells[i].text = title
            set_cell_background(hdr_cells[i], "F3F4F6")
            set_cell_margins(hdr_cells[i], top=50, bottom=50, left=70, right=70)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            r = p.runs[0]
            r.font.name = "Times New Roman"
            r.font.size = Pt(font_size)
            r.bold = True
            r.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

        # Data Rows
        for r_idx, row_data in enumerate(data):
            row_cells = tbl.rows[r_idx + 1].cells
            bg_col = "FFFFFF" if r_idx % 2 == 0 else "F9FAFB"
            for c_idx, val in enumerate(row_data):
                row_cells[c_idx].text = str(val)
                set_cell_background(row_cells[c_idx], bg_col)
                set_cell_margins(row_cells[c_idx], top=35, bottom=35, left=60, right=60)
                p = row_cells[c_idx].paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.0
                r = p.runs[0]
                r.font.name = "Times New Roman"
                r.font.size = Pt(font_size - 0.5)
                r.font.color.rgb = RGBColor(0x11, 0x11, 0x11)

        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = width

    # =========================================================================
    # PAGE 1: TITLE PAGE (Exact Institutional Layout from Template Table 0)
    # =========================================================================
    t0 = doc.add_table(rows=6, cols=1)
    t0.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t0, color="000000", sz="8", val="single")
    for row in t0.rows:
        row.cells[0].width = Inches(7.0)
        set_cell_margins(row.cells[0], top=40, bottom=40, left=40, right=40)

    # R0: IBST Mini Project Report
    p = t0.rows[0].cells[0].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("IBST Mini Project Report")
    r.font.name = "Times New Roman"; r.font.size = Pt(22); r.bold = True

    # R1: on
    p = t0.rows[1].cells[0].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("on")
    r.font.name = "Times New Roman"; r.font.size = Pt(18); r.bold = True

    # R2: Topic Name
    p = t0.rows[2].cells[0].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("CHAIWALA — SUBCONTINENTAL CRAFT CHAI & DUAL-ERA CAFE ORDER SYSTEM")
    r.font.name = "Times New Roman"; r.font.size = Pt(15); r.bold = True

    # R3: Submitted By
    p = t0.rows[3].cells[0].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Submitted By:")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True

    p2 = t0.rows[3].cells[0].add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_after = Pt(2)
    r = p2.add_run("<Write Student name> : <Write Student regd. No>")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True

    p3 = t0.rows[3].cells[0].add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_after = Pt(6)
    r = p3.add_run("MCA BATCH : [2025 – 27]")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True

    # R4: Submittal Text
    p = t0.rows[4].cells[0].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("(A project report submitted to Srusti Academy of Management and Technology(Autonomous) Bhubaneswar , Odisha for partial fulfillment of the requirements for the award of Degree of MCA Program)")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.bold = True

    # R5: Institutional Branding
    c5 = t0.rows[5].cells[0]
    p = c5.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run()
    if os.path.exists("extracted_assets/srusti_logo.png"):
        r.add_picture("extracted_assets/srusti_logo.png", width=Inches(1.5))

    p_inst = c5.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r = p_inst.add_run("Srusti Academy of Management and Technology (Autonomous)")
    r.font.name = "Times New Roman"; r.font.size = Pt(15); r.bold = True

    p_naac = c5.add_paragraph()
    p_naac.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_naac.paragraph_format.space_after = Pt(1)
    r = p_naac.add_run("1st B-School in Odisha with “A” Grade Accreditation by NAAC")
    r.font.name = "Times New Roman"; r.font.size = Pt(10.5)

    p_aicte = c5.add_paragraph()
    p_aicte.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_aicte.paragraph_format.space_after = Pt(2)
    r = p_aicte.add_run("Approved By AICTE, New Delhi | Affiliated to BPUT, Rourkela")
    r.font.name = "Times New Roman"; r.font.size = Pt(10.5)

    p_line = c5.add_paragraph()
    p_line.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_line.paragraph_format.space_after = Pt(2)
    r = p_line.add_run("_________________________________________________________________________________")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5)

    p_addr = c5.add_paragraph()
    p_addr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_addr.paragraph_format.space_after = Pt(1)
    r = p_addr.add_run("38/1, Chandaka Industrial Estate, Near Infocity, Bhubaneswar,Odisha-751024")
    r.font.name = "Times New Roman"; r.font.size = Pt(10); r.bold = True

    p_web = c5.add_paragraph()
    p_web.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_web.paragraph_format.space_after = Pt(4)
    r = p_web.add_run("www.srustiacademy.ac.in")
    r.font.name = "Times New Roman"; r.font.size = Pt(10)

    doc.add_page_break()

    # =========================================================================
    # PAGE 2: CERTIFICATE (Exact Template Text & Formatting)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("CERTIFICATE")
    r.font.name = "Times New Roman"; r.font.size = Pt(20); r.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("This is to certify that Mr./Ms. ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("<Student Name>")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(", a student of MCA of ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("Srusti Academy of Management and Technology, (Autonomous) Bhubaneswar")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(" has successfully completed his/her IBST Project on the topic of ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("“CHAIWALA — SUBCONTINENTAL CRAFT CHAI & DUAL-ERA CAFE ORDER SYSTEM”")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(". He/She has worked on the IBST Project from ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("01/09/2026 to 31/10/2026")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(". His/Her performance during the project was extremely satisfactory.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(90)

    sig_tbl = doc.add_table(rows=1, cols=3)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, w in enumerate([Inches(2.3), Inches(2.4), Inches(2.3)]):
        sig_tbl.rows[0].cells[i].width = w

    c_left = sig_tbl.rows[0].cells[0].paragraphs[0]
    c_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = c_left.add_run("_____________________\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12)
    r = c_left.add_run("Internal Supervisor\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.bold = True
    r = c_left.add_run("Dept. of Computer Science\nSrusti Academy")
    r.font.name = "Times New Roman"; r.font.size = Pt(10)

    c_mid = sig_tbl.rows[0].cells[1].paragraphs[0]
    c_mid.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = c_mid.add_run("_____________________\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12)
    r = c_mid.add_run("External Examiner\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.bold = True
    r = c_mid.add_run("BPUT Examination Board")
    r.font.name = "Times New Roman"; r.font.size = Pt(10)

    c_right = sig_tbl.rows[0].cells[2].paragraphs[0]
    c_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = c_right.add_run("_____________________\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12)
    r = c_right.add_run("HOD / Director\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.bold = True
    r = c_right.add_run("Srusti Academy\nBhubaneswar")
    r.font.name = "Times New Roman"; r.font.size = Pt(10)

    doc.add_page_break()

    # =========================================================================
    # PAGE 3: DECLARATION (Exact Template Text & Formatting)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("DECLARATION")
    r.font.name = "Times New Roman"; r.font.size = Pt(20); r.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(16)
    r = p.add_run("I am ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("<Student Name>")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(", a bonafide student of ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("Srusti Academy of Management and Technology (Autonomous)")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(", pursuing MCA, do hereby declare that the study entitled ")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)
    r = p.add_run("“CHAIWALA — SUBCONTINENTAL CRAFT CHAI & DUAL-ERA CAFE ORDER SYSTEM”")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p.add_run(" is my authentic work, I have completed my study under the guidance of Mr. / Ms. <External Guide Name> <Designation> <Company Name> <Location>.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p2.paragraph_format.line_spacing = 1.3
    p2.paragraph_format.space_after = Pt(24)
    r = p2.add_run("All the data furnished in this project report are authentic and genuine and this report neither full nor in part has ever been submitted for award of any other degree to either this university or any other university.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(80)

    p_sig = doc.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig.paragraph_format.line_spacing = 1.2
    r = p_sig.add_run("<Student Full Signature>\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p_sig.add_run("MCA (2025-27)\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p_sig.add_run("Regd. No:- 2505286???\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p_sig.add_run("Srusti Academy of Management and Technology (Autonomous),\nBhubaneswar, Odisha")
    r.font.name = "Times New Roman"; r.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # PAGE 4: ACKNOWLEDGEMENT (Exact Template Text & Formatting)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("ACKNOWLEDGEMENT")
    r.font.name = "Times New Roman"; r.font.size = Pt(20); r.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(14)
    r = p.add_run("This project report bears the imprint of many people on it. I am very much thankful to Srusti Academy of Management and Technology (Autonomous), Bhubaneswar for the successful completion of my project report.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(14)
    r = p.add_run("I would like to thank my project supervisor for his invaluable guidance and assistance in preparing the project report and also contributing a lot for accomplishment of this project.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(14)
    r = p.add_run("I am highly indebted Mr. /Ms. <External Guide, Designation, Company Name, Location> my corporate guide, who guided me during the IBST project period and suggested many issues which has been taken care in my project work. I am also expressing my indebtedness to my parents and my friends who gave their full-fledged co-operation for the successful completion of my project.")
    r.font.name = "Times New Roman"; r.font.size = Pt(13)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(60)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_meta.paragraph_format.line_spacing = 1.2
    r = p_meta.add_run("<Student Name>\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p_meta.add_run("Registration No: 2505286???\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.bold = True
    r = p_meta.add_run("Date: - 02/11/2026\nPlace: - Bhubaneswar")
    r.font.name = "Times New Roman"; r.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # PAGE 5: ABSTRACT (Natural Academic Prose)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("ABSTRACT")
    r.font.name = "Times New Roman"; r.font.size = Pt(20); r.bold = True

    academic_p("This project report documents the design, architecture, implementation, and experimental verification of Chaiwala, a web-based ordering and workflow management system developed for modern artisanal tea counters. In urban and campus settings across India, physical tea stalls encounter substantial operational friction during peak morning and evening rush hours. The conventional practice of shouting orders across a crowded counter frequently causes verbal misunderstandings, inaccurate bill computations, and long customer wait times. Concurrently, commercial food aggregators impose high commission fees and strip away the cultural atmosphere that makes tea drinking a communal ritual.")

    academic_p("To resolve these problems, we engineered Chaiwala as a responsive, QR-first single-page application that customers access directly through their mobile web browsers without installing native applications. The application introduces a dual-era user experience where patrons can choose between the 1900s Traditional Adda mode and the 2020s Modern Café mode. This selection dynamically alters the interface styling, menu catalog, and ambient audio cues while keeping the underlying ordering logic unified and simple. Customers can customize beverage sugar levels and cup styles, review itemized line items, and reserve a specific 15-minute counter pickup window.")

    academic_p("The technological stack combines React 19, TypeScript, and Vite on the client with PostgreSQL 15 and Supabase for database persistence. For offline testing and demonstration venues where external cloud credentials might be unavailable, a mock backend engine stores operational state in browser localStorage. To safeguard beverage temperature and prevent kitchen overcrowding, the scheduling engine limits order bookings to a maximum of six per pickup slot. All monetary calculations are performed in integer paise to avoid JavaScript floating-point errors. A 31-invariant automated test suite was constructed and verified, achieving a 100% pass rate across catalogue integrity, atomic order placement, and kitchen status transitions.")

    p_kw = doc.add_paragraph()
    p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw.paragraph_format.space_before = Pt(8)
    r_k = p_kw.add_run("Keywords: ")
    r_k.font.name = "Times New Roman"; r_k.font.size = Pt(10.5); r_k.bold = True
    r_v = p_kw.add_run("Chaiwala, Quick Service Restaurant, React 19, TypeScript, Supabase, Pickup Slot Scheduling, Dual-Era Interface, Concurrency Control, MCA Project.")
    r_v.font.name = "Times New Roman"; r_v.font.size = Pt(10.5); r_v.italic = True

    doc.add_page_break()

    # =========================================================================
    # PAGE 6: TABLE OF CONTENTS (PART 1)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run("Table of Contents")
    r.font.name = "Times New Roman"; r.font.size = Pt(20); r.bold = True

    toc1_data = [
        ["1", "Title Page", "1"],
        ["2", "Certificate", "2"],
        ["3", "Declaration", "3"],
        ["4", "Acknowledgement", "4"],
        ["5", "Abstract", "5"],
        ["6", "Table of Contents", "6"],
        ["7", "List of Figures & List of Tables", "8"],
        ["8", "Chapter 1: Introduction", "9"],
        ["", "    1.1 Project Overview", "9"],
        ["", "    1.2 Problem Statement", "9"],
        ["", "    1.3 Objectives and Scope", "10"],
        ["", "    1.4 Target Users", "10"],
        ["", "    1.5 Existing and Proposed Systems", "11"],
        ["9", "Chapter 2: Requirements Analysis and PRD", "12"],
        ["", "    2.1 Product Requirements Document (PRD)", "12"],
        ["", "    2.2 Functional and Non-Functional Requirements", "12"],
        ["", "    2.3 User Stories and Use Cases", "14"],
        ["", "    2.4 Features and Acceptance Criteria", "15"],
        ["", "    2.5 Constraints and Assumptions", "15"],
        ["10", "Chapter 3: System Analysis and Design", "16"],
        ["", "    3.1 System Architecture", "16"],
        ["", "    3.2 System Workflow", "17"],
        ["", "    3.3 Use Case Diagram", "18"],
        ["", "    3.4 Data Flow Diagram (DFD)", "19"],
        ["", "    3.5 Database and Component Design Overview", "19"],
        ["", "    3.6 User Interface Design", "19"],
        ["11", "Chapter 4: Technology Stack and Development Plan", "20"],
        ["", "    4.1 Frontend, Backend and Database Technologies", "20"],
        ["", "    4.2 AI Models and Development Tools", "21"],
        ["", "    4.3 APIs and Third-Party Integrations", "21"],
        ["", "    4.4 Technology Selection Justification", "22"],
        ["", "    4.5 Project Milestones and Build Plan", "22"]
    ]

    t_toc1 = doc.add_table(rows=len(toc1_data)+1, cols=3)
    academic_table(t_toc1, [Inches(0.8), Inches(5.2), Inches(1.0)], ["Sl. No.", "Contents", "Page No."], toc1_data, font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 7: TABLE OF CONTENTS (PART 2)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run("Table of Contents (Continued)")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.bold = True

    toc2_data = [
        ["12", "Chapter 5: Database Design and API Specification", "23"],
        ["", "    5.1 Database Schema and ER Diagram", "23"],
        ["", "    5.2 Tables and Relationships (Data Dictionary)", "24"],
        ["", "    5.3 API Endpoints and Methods", "25"],
        ["", "    5.4 Request and Response Formats", "25"],
        ["", "    5.5 Authentication and Security", "25"],
        ["13", "Chapter 6: Testing and Evaluation", "26"],
        ["", "    6.1 Testing Strategy", "26"],
        ["", "    6.2 Unit, Integration and System Testing", "26"],
        ["", "    6.3 Test Cases and Results", "27"],
        ["", "    6.4 AI Output Evaluation", "27"],
        ["", "    6.5 Limitations and Known Issues", "27"],
        ["14", "Chapter 7: Deployment and Results", "28"],
        ["", "    7.1 Deployment and Installation", "28"],
        ["", "    7.2 System Screenshots", "28"],
        ["", "    7.3 Implemented Features", "29"],
        ["", "    7.4 Expected vs. Actual Results", "29"],
        ["", "    7.5 Challenges and Solutions", "29"],
        ["15", "Chapter 8: Conclusion and Future Scope", "30"],
        ["", "    8.1 Conclusion", "30"],
        ["", "    8.2 Learning Outcomes", "30"],
        ["", "    8.3 Future Enhancements", "30"],
        ["16", "References / Bibliography", "30"]
    ]

    t_toc2 = doc.add_table(rows=len(toc2_data)+1, cols=3)
    academic_table(t_toc2, [Inches(0.8), Inches(5.2), Inches(1.0)], ["Sl. No.", "Contents", "Page No."], toc2_data, font_size=8.5)

    p_rec = doc.add_paragraph()
    p_rec.paragraph_format.space_before = Pt(14)
    p_rec.paragraph_format.space_after = Pt(4)
    r = p_rec.add_run("Recommended Repository Documentation Files:")
    r.font.name = "Times New Roman"; r.font.size = Pt(10.5); r.bold = True

    md_files = [
        ["1", "README.md", "Project overview, setup commands, and build scripts."],
        ["2", "TASK.md", "Feature delivery checklist and operational decisions."],
        ["3", "DESIGN_SYSTEM.md", "Color tokens, typography hierarchy, and UI guidelines."],
        ["4", "RESEARCH.md", "Architectural tradeoffs and technical references."],
        ["5", "UI_REPAIR_QA.md", "Cross-browser testing and responsive touch target QA."]
    ]
    t_md = doc.add_table(rows=len(md_files)+1, cols=3)
    academic_table(t_md, [Inches(0.8), Inches(2.2), Inches(4.0)], ["Sl. No.", "File Name", "Purpose"], md_files, font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 8: LIST OF FIGURES & LIST OF TABLES
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("List of Figures")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.bold = True

    figures_data = [
        ["Figure 3.1", "Multi-tier system architecture diagram", "16"],
        ["Figure 3.2", "End-to-end customer ordering and kitchen fulfillment workflow", "17"],
        ["Figure 3.3", "Use case diagram depicting actor boundaries and system features", "18"],
        ["Figure 3.4", "Level-1 Data Flow Diagram for order processing and tracking", "19"],
        ["Figure 5.1", "Relational entity-relationship diagram for the Chaiwala database", "23"],
        ["Figure 6.1", "Full-stack automated verification test suite execution record", "26"],
        ["Figure 7.1", "Application landing page in 1900s Traditional Adda mode", "28"],
        ["Figure 7.2", "Application landing page in 2020s Modern Café mode", "28"],
        ["Figure 7.3", "Product customization modal dialog for sugar and cup size", "29"],
        ["Figure 7.4", "Live order confirmation ticket displaying order ID and tracking token", "29"]
    ]
    t_figs = doc.add_table(rows=len(figures_data)+1, cols=3)
    academic_table(t_figs, [Inches(1.2), Inches(4.8), Inches(1.0)], ["Figure No.", "Title", "Page No."], figures_data, font_size=8)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("List of Tables")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.bold = True

    tables_data = [
        ["Table 1.1", "Comparative analysis of traditional stalls, aggregators, and Chaiwala", "11"],
        ["Table 2.1", "User stories, system actors, and acceptance criteria matrix", "14"],
        ["Table 4.1", "Architectural technology selection and tradeoff evaluation", "22"],
        ["Table 4.2", "Agile project development milestones and sprint roadmap", "22"],
        ["Table 5.1", "Relational database schema data dictionary and constraints", "24"],
        ["Table 6.1", "Automated verification test cases, procedures, and observed results", "27"]
    ]
    t_tbls = doc.add_table(rows=len(tables_data)+1, cols=3)
    academic_table(t_tbls, [Inches(1.2), Inches(4.8), Inches(1.0)], ["Table No.", "Title", "Page No."], tables_data, font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 9: CHAPTER 1 — INTRODUCTION (PART 1)
    # =========================================================================
    chapter_title("Chapter 1: Introduction")
    
    section_title("1.1 Project Overview")
    academic_p("In the subcontinental context, tea drinking is an integral part of daily life and social interaction. Whether gathered at a roadside tapri in the morning or meeting friends at an evening adda, a cup of freshly boiled chai serves as a catalyst for conversation, community connection, and daily pauses. However, the operational environment of these tea counters has largely remained manual, chaotic, and vulnerable to service delays.")

    academic_p("Chaiwala was conceived and developed as an academic software engineering project to modernize counter service while honoring traditional cultural heritage. The application is a web-based, mobile-friendly Quick Service Restaurant (QSR) ordering system designed to operate directly through counter QR code scans. Instead of requiring patrons to download heavy native mobile applications from app stores, Chaiwala loads instantly in standard mobile browsers such as Chrome, Safari, and Edge.")

    academic_p("A defining technical feature of the system is its dual-era presentation layer. Customers can seamlessly switch between two distinct aesthetic and culinary themes: the 1900s Traditional Adda world and the 2020s Modern Café world. Switching modes reconfigures CSS theme variables, editorial photographs, chapter descriptions, and recommended beverage catalogues without triggering document reloads or disturbing the user's active shopping cart.")

    section_title("1.2 Problem Statement")
    academic_p("High-volume beverage counters face several persistent operational bottlenecks that degrade both customer satisfaction and kitchen throughput:")
    academic_p("1. Physical Queue Bottlenecks: Peak business hours create dense counter crowding. Customers struggle to place verbal orders, staff make frequent mistakes with sugar or milk preferences, and manual cash handovers cause delays.")
    academic_p("2. Beverage Thermal Degradation: Tea is exceptionally sensitive to serving temperature. In standard online ordering systems, tea is often brewed too early and sits cooling on the counter, leading to a degraded drinking experience.")
    academic_p("3. High Third-Party Commission Fees: Commercial delivery aggregators take commissions ranging from 20% to 30%, which is financially prohibitive for small-ticket beverage items.")
    academic_p("4. Lack of Brand and Cultural Identity: Generic point-of-sale applications offer sterile, transactional forms that divorce beverage ordering from the rich cultural narratives of Indian tea traditions.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 10: CHAPTER 1 — INTRODUCTION (PART 2)
    # =========================================================================
    section_title("1.3 Objectives and Scope")
    academic_p("The primary objective of this project is to develop and thoroughly test a responsive web-based counter ordering platform tailored specifically to craft chai businesses. The detailed engineering objectives include:")
    academic_p("1. Instant Web Access: Building a lightweight single-page application using React 19 and Vite that renders the initial interactive view within 50 milliseconds on mobile networks, avoiding splash screens or mandatory loading preloaders.")
    academic_p("2. Dual-Era Dynamic Theming: Creating a client-side theme switcher that modifies styling, editorial imagery, and filtered menu items between historical Adda and contemporary Café modes.")
    academic_p("3. Multi-Attribute Item Customization: Allowing customers to adjust sugar levels (Regular, Less, None), cup sizes (Cutting 120ml vs. Handcrafted Kulhad 220ml), and add-ons, recalculating line totals dynamically.")
    academic_p("4. Concurrency-Controlled Pickup Scheduling: Implementing rolling 15-minute pickup slots capped at six orders per window to regulate kitchen workload and guarantee hot beverages.")
    academic_p("5. Transactional Order Management: Executing order placement via atomic database stored procedures that generate sequential order numbers (e.g., CW-1001) and secure tracking tokens.")
    academic_p("6. Dual-Mode Operational Fallback: Integrating an offline mock storage backend so that the application functions reliably in demonstration environments without live cloud credentials.")

    section_title("1.4 Target Users")
    academic_p("The application architecture addresses four primary stakeholder groups:")
    academic_p("• Traditional Adda Connoisseurs: Customers seeking authentic spiced Assam CTC tea, bun maska, and nostalgic conversation without dealing with complex app installations.")
    academic_p("• Contemporary Café Visitors: Students and professionals looking for iced brews, matcha lattes, boba teas, and convenient mobile ordering.")
    academic_p("• Kitchen Staff and Baristas: Operational personnel who require structured, unambiguous digital order tickets with clear customization tags and sequential order numbers.")
    academic_p("• Counter Managers and Administrators: Supervisors who monitor slot capacity, update daily product availability (item 86ing), and review transaction histories.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 11: CHAPTER 1 — INTRODUCTION (PART 3)
    # =========================================================================
    section_title("1.5 Existing and Proposed Systems")
    academic_p("To evaluate the technical and practical advantages of Chaiwala, we compared it against two common approaches: traditional pen-and-paper counter service and commercial third-party delivery platforms. Traditional stalls offer personal rapport but fail during rush hours due to verbal miscommunications and disorganized queues. Third-party aggregators solve payment and tracking but take substantial profit cuts, require app installations, and do not manage on-site counter pickup timing.")

    p_tbl = doc.add_paragraph()
    p_tbl.paragraph_format.space_before = Pt(4)
    p_tbl.paragraph_format.space_after = Pt(2)
    r = p_tbl.add_run("Table 1.1: Comparative Analysis of Beverage Ordering Paradigms")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.bold = True

    comp_data = [
        ["Feature / Parameter", "Traditional Tea Stall", "Third-Party Aggregators", "Chaiwala (Proposed System)"],
        ["Ordering Channel", "Verbal shouting at counter", "Native app download required", "Instant browser QR scan (No install)"],
        ["Queue Coordination", "Unstructured physical crowd", "Driver delivery queue only", "15-minute capacity-controlled slots"],
        ["Customization Accuracy", "Frequent verbal errors", "Complex nested menus", "Visual modal with clear badges"],
        ["Thermal Freshness", "Unpredictable wait times", "Cooling during transit", "Brewed fresh for scheduled window"],
        ["Commission Overhead", "0% (Direct cash)", "20% – 30% per order", "0% (Direct counter settlement)"],
        ["Offline / Demo Mode", "Manual notepad tracking", "Fails without internet", "Full offline mock with LocalStorage"],
        ["Cultural Presentation", "Informal local stall", "Standard corporate listing", "Dual-era visual worlds & stories"]
    ]
    t_comp = doc.add_table(rows=len(comp_data), cols=4)
    academic_table(t_comp, [Inches(1.5), Inches(1.8), Inches(1.8), Inches(1.9)], comp_data[0], comp_data[1:], font_size=8)

    academic_p("Chaiwala provides an effective balance for craft beverage businesses. It delivers modern queue management and digital order tracking while keeping customer onboarding frictionless and eliminating commercial commission fees.", space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 12: CHAPTER 2 — REQUIREMENTS ANALYSIS AND PRD (PART 1)
    # =========================================================================
    chapter_title("Chapter 2: Requirements Analysis and PRD")

    section_title("2.1 Product Requirements Document (PRD)")
    academic_p("The foundational design principles of Chaiwala were established in the project PRD under the theme 'Memory Through a Cup'. Rather than building an impersonal transactional portal, the software was specified to serve as an intuitive digital companion to the physical counter. Key design principles include:")
    academic_p("• Immediate Rendering: The application must not display synthetic preloader screens. The initial screen must render immediately upon scanning the QR code.")
    academic_p("• Opt-In Media: In accordance with browser security policies, ambient audio playback must require an explicit user click. Autoplay is strictly disabled to prevent unexpected sound in public settings.")
    academic_p("• Exact Integer Arithmetic: To eliminate binary floating-point rounding errors common in JavaScript, all prices, discounts, option deltas, packaging charges, and GST values are stored and calculated strictly in integer paise (e.g., ₹45.00 is represented as 4500 paise).")
    academic_p("• Accessible Touch Interactions: All buttons, inputs, and selection pills must provide touch targets of at least 44×44 CSS pixels to ensure effortless operation on mobile phones.")

    section_title("2.2 Functional Requirements")
    academic_p("The functional requirements specify the exact capabilities implemented in the application:")
    academic_p("FR1 — Generational Era Switching: The system must allow users to toggle between 1900s Adda and 2020s Café modes. Switching eras updates the CSS variables, hero backdrop, chapter narrative, and recommended products without reloading the page or resetting cart contents.")
    academic_p("FR2 — Dynamic Menu Filtering: The menu must display products matching the active era while offering category tabs (Chai, Coffee, Tea, Cold & Iced, Bites & Buns, Sweets) and real-time text search across the complete 19-item catalog.")
    academic_p("FR3 — Beverage Customization: The interface must provide a modal dialog allowing users to select cup sizes, adjust sweetness levels, and choose optional add-ons, with prices updating in real time.")
    academic_p("FR4 — Persistent Cart Management: The application must maintain shopping bag state in React Context and sync with browser localStorage, supporting quantity modifications and item removals.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 13: CHAPTER 2 — REQUIREMENTS ANALYSIS AND PRD (PART 2)
    # =========================================================================
    academic_p("FR5 — Automated Tax and Fee Computation: The order review module must compute a 5% Goods and Services Tax (GST) and a fixed ₹10.00 packaging surcharge, formatting all totals cleanly in Indian currency format.")
    academic_p("FR6 — Pickup Window Booking: The system must generate rolling 15-minute pickup windows, track remaining booking capacity, and automatically disable slots once they reach their 6-order limit.")
    academic_p("FR7 — Atomic Order Placement: Order submission must invoke an atomic procedure that validates slot availability, records customer details, saves item options, and generates a formatted ticket (CW-XXXX) and a cryptographic tracking token.")
    academic_p("FR8 — Kitchen FSM Progression: The backend must enforce a deterministic state machine restricting status transitions to valid paths: PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED.")

    section_title("2.2.2 Non-Functional Requirements")
    academic_p("The system satisfies six essential non-functional quality standards:")
    academic_p("NFR1 — Performance: The production client bundle must stay under 120 kB gzipped to ensure fast loading on mobile data networks.")
    academic_p("NFR2 — Concurrency Safety: Order requests must include a client-generated UUID idempotency key to prevent double-charging or duplicate bookings during network retries.")
    academic_p("NFR3 — Accessibility: The user interface must comply with WCAG 2.1 AA standards and support the prefers-reduced-motion media query by disabling scroll-driven animations for sensitive users.")
    academic_p("NFR4 — Cross-Device Responsiveness: Layouts must render cleanly without horizontal scrollbars across desktop screens (1440×900) and standard mobile viewports (390×844).")
    academic_p("NFR5 — Security and Secret Isolation: Client builds must only expose public configuration keys (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Administrative service-role keys must never be committed to client code.")
    academic_p("NFR6 — Fault Tolerance: In the event of cloud connectivity failure, the application must automatically fall back to the built-in mock backend without crashing.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 14: CHAPTER 2 — REQUIREMENTS ANALYSIS AND PRD (PART 3)
    # =========================================================================
    section_title("2.3 User Stories and Use Cases")
    academic_p("System requirements were gathered from the viewpoints of customers, baristas, and administrators. Each story includes specific acceptance criteria used to verify features during testing.")

    p_tbl = doc.add_paragraph()
    p_tbl.paragraph_format.space_before = Pt(4)
    p_tbl.paragraph_format.space_after = Pt(2)
    r = p_tbl.add_run("Table 2.1: User Stories, System Actors, and Acceptance Criteria Matrix")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.bold = True

    stories_data = [
        ["Story ID", "User Persona", "User Goal & Requirement", "Acceptance Criteria"],
        ["US01", "Customer", "Switch between historical Adda and modern Café themes upon arrival.", "Selecting an era changes colors, hero images, and menu items within 16ms without resetting cart."],
        ["US02", "Customer", "Customize sugar level and cup size before adding tea to the bag.", "Customization modal displays options; price deltas (e.g., +₹20 for kulhad) apply immediately to line total."],
        ["US03", "Customer", "Select an upcoming 15-minute pickup window to collect warm chai.", "Available slots display remaining capacity; full windows (>6 orders) are disabled from selection."],
        ["US04", "Customer", "Receive a clear digital ticket with order number and tracking code.", "Confirmation screen displays order ID (CW-XXXX) and instructions to pay at the counter."],
        ["US05", "Barista", "View structured order tickets with explicit customization notes.", "Kitchen view displays exact cup size, sweetness choice, customer name, and preparation notes."],
        ["US06", "Barista", "Update order status through kitchen stages from prep to completion.", "Status updates from Pending to Preparing and Ready, logging timestamp in status history."],
        ["US07", "Store Admin", "Mark out-of-stock items as unavailable (86ing) in the catalogue.", "Toggling isAvailable immediately disables the item on the public customer menu."]
    ]
    t_stories = doc.add_table(rows=len(stories_data), cols=4)
    academic_table(t_stories, [Inches(0.7), Inches(1.1), Inches(2.6), Inches(2.6)], stories_data[0], stories_data[1:], font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 15: CHAPTER 2 — REQUIREMENTS ANALYSIS AND PRD (PART 4)
    # =========================================================================
    section_title("2.4 Features and Acceptance Criteria")
    academic_p("The complete feature set covers five functional modules:")
    academic_p("1. Cinematic Hero Module: Features photographic backdrops, typography headers, and a dual-button era switcher allowing guests to explore 1900s Adda and 2020s Café narratives.")
    academic_p("2. Catalogue and Search Engine: Supports category filtering across Chai, Coffee, Tea, Cold Drinks, Bites, and Sweets, accompanied by a search input that updates results in real time.")
    academic_p("3. Interactive Customization Modal: Presents radio groups for cup size (Cutting vs. Kulhad) and sweetness (Regular, Less, None), validating selections before enabling the add-to-bag action.")
    academic_p("4. Shopping Bag Drawer: A slide-over panel displaying itemized lines, quantity controls (+/-), item removal, 5% GST computation, and a packaging fee breakdown.")
    academic_p("5. Counter Pickup Scheduler: Generates rolling 15-minute windows, validates user contact details, and executes order submission through the backend API.")

    section_title("2.5 Constraints and Assumptions")
    academic_p("Development was guided by several technical and operational assumptions:")
    academic_p("• Counter Payment Model: To eliminate payment gateway friction and transaction failure drop-offs, payment is collected directly at the physical counter via cash or UPI when the customer collects their order.")
    academic_p("• Target Hardware: The software assumes patrons possess standard smartphones capable of running modern web browsers with camera-based QR code scanning.")
    academic_p("• YouTube Playlist Embedding: The era radio component is built to accept optional YouTube playlist IDs; audio playback remains strictly user-initiated to adhere to web standards.")
    academic_p("• Academic Topic Scope: The brand name 'Chaiwala' is used solely as an academic project identifier. Commercial deployment would require trademark clearance and unique brand registration.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 16: CHAPTER 3 — SYSTEM ANALYSIS AND DESIGN (PART 1)
    # =========================================================================
    chapter_title("Chapter 3: System Analysis and Design")

    section_title("3.1 System Architecture")
    academic_p("Chaiwala implements a multi-tier client-server architecture designed for high responsiveness, clear separation of concerns, and resilience against network interruptions. The architecture is organized into three cooperating layers: the Client Presentation Tier, the Application and State Management Tier, and the Persistence Tier.")

    academic_figure("screenshots/architecture/system_architecture.png", "Figure 3.1: Multi-tier system architecture diagram", width=Inches(5.3), space_before=2, space_after=2)

    academic_p("The Client Presentation Tier is built using React 19 and TypeScript, styled with responsive CSS custom properties. UI components (SiteHeader, CinematicHero, EraMenuSection, OrderRitual) remain decoupled from database logic. The State Management Tier uses React Context (CartContext) and modular adapters (ordering.ts, radio-audio.ts) to communicate via HTTPS JSON with the Persistence Tier, which combines PostgreSQL 15, Row Level Security policies, and atomic stored procedures on Supabase.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 17: CHAPTER 3 — SYSTEM ANALYSIS AND DESIGN (PART 2)
    # =========================================================================
    section_title("3.2 System Workflow")
    academic_p("The operational workflow traces the customer's journey from counter arrival to order collection, alongside the kitchen fulfillment process:")

    academic_figure("screenshots/architecture/system_workflow.png", "Figure 3.2: End-to-end customer ordering and kitchen fulfillment workflow", width=Inches(5.3), space_before=2, space_after=2)

    academic_p("The interaction begins when the guest scans the counter QR code, opening the application hero screen. The customer selects an era, browses the menu, customizes beverages, and adds them to the bag. During checkout, the customer chooses a 15-minute pickup window and enters their name and phone number. The backend executes the create_order stored procedure, atomically decrementing slot capacity and returning a confirmation ticket. The barista prepares the order and updates its status through the kitchen FSM.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 18: CHAPTER 3 — SYSTEM ANALYSIS AND DESIGN (PART 3)
    # =========================================================================
    section_title("3.3 Use Case Diagram")
    academic_p("The use case diagram defines the functional boundaries of the system across three primary actors: Customer, Barista, and Store Manager.")

    academic_figure("screenshots/architecture/use_case_diagram.png", "Figure 3.3: Use case diagram depicting actor boundaries and system features", width=Inches(5.3), space_before=2, space_after=2)

    academic_p("Customers interact with the ordering interface to browse menus (UC1), customize items (UC2), manage their bag (UC3), reserve pickup slots (UC4), and track order progress (UC5). Baristas use the kitchen display to monitor incoming tickets (UC6) and advance order preparation states (UC7). Store Managers handle administrative tasks such as toggling item availability (UC8) and reviewing daily transaction logs (UC9).")

    doc.add_page_break()

    # =========================================================================
    # PAGE 19: CHAPTER 3 — SYSTEM ANALYSIS AND DESIGN (PART 4)
    # =========================================================================
    section_title("3.4 Data Flow Diagram (DFD)")
    academic_p("The Level-1 Data Flow Diagram illustrates how information moves between external actors, processing functions, and internal data stores:")

    academic_figure("screenshots/architecture/data_flow_diagram.png", "Figure 3.4: Level-1 Data Flow Diagram for order processing and tracking", width=Inches(5.1), space_before=2, space_after=2)

    section_title("3.5 Database and Component Design")
    academic_p("The frontend codebase follows a modular structure where UI components receive typed props and emit callback events. Business logic is isolated inside ordering.ts, which converts between camelCase JavaScript models and snake_case PostgreSQL database columns.")

    section_title("3.6 User Interface Design")
    academic_p("The interface uses a warm, editorial color palette defined by CSS custom properties: Carbon Canvas (--ink: #101113), Warm Paper (--milk: #f4eee5), Chai Vermilion (--hot: #f04e30), and Adda Brass (--gold: #c89a44). Typography pairs Bricolage Grotesque for headlines with Fraunces for prices and DM Sans for clean body text.", space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 20: CHAPTER 4 — TECHNOLOGY STACK AND DEVELOPMENT PLAN (PART 1)
    # =========================================================================
    chapter_title("Chapter 4: Technology Stack and Development Plan")

    section_title("4.1 Frontend, Backend and Database Technologies")
    academic_p("The technology stack was selected to achieve fast mobile load times, strict type safety, and resilient offline execution:")
    academic_p("• React 19: Used as the core UI library for component-based rendering. React 19's efficient reconciliation and concurrent capabilities ensure smooth animations and instant input responses across mobile devices.")
    academic_p("• TypeScript 5.7: Provides end-to-end static type checking. Defining strict interfaces for products, options, cart items, and database rows eliminated common null-pointer and property mismatch bugs.")
    academic_p("• Vite 6.1: Functions as the build tool and development server, offering near-instantaneous Hot Module Replacement during development and emitting Rollup-optimized production bundles.")
    academic_p("• PostgreSQL 15 / Supabase: Serves as the cloud database engine, providing ACID transaction guarantees, Row Level Security policies, and PL/pgSQL stored procedures for atomic order processing.")
    academic_p("• HTML5 Web Audio API: Powers the background era radio player in radio-audio.ts, synthesizing procedural ambient audio and handling volume curves without heavy external media player libraries.")
    academic_p("• Lucide React: Supplies lightweight, scalable SVG icons for shopping bags, clocks, checkmarks, and navigation arrows with minimal bundle overhead.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 21: CHAPTER 4 — TECHNOLOGY STACK AND DEVELOPMENT PLAN (PART 2)
    # =========================================================================
    section_title("4.2 AI Models and Development Tools")
    academic_p("Modern AI tools were employed to accelerate implementation, generate realistic creative assets, and assist in automated quality assurance:")
    academic_p("• AI-Assisted Code Scaffolding: Large language model coding assistants were used to draft TypeScript interface definitions, generate initial boilerplate for PostgreSQL stored procedures, and assist with complex state reducer logic.")
    academic_p("• Creative Editorial Image Generation: Diffusion image generation pipelines were used to produce authentic-looking editorial photographs of traditional brass samovars, Assam tea gardens, and modern minimalist café scenes, ensuring high visual quality without stock photography licensing fees.")
    academic_p("• Automated Test Suite Construction: Prompt-guided engineering assisted in building the 31-invariant test harness (.qa-order-tests.mjs) that systematically validates slot concurrency, pricing arithmetic, and FSM status transitions.")

    section_title("4.3 APIs and Third-Party Integrations")
    academic_p("The project integrates several standard web APIs and service interfaces:")
    academic_p("• Supabase JavaScript Client: Used for executing database queries, invoking remote stored procedures (RPCs), and handling user authentication.")
    academic_p("• Browser LocalStorage API: Enables client-side data persistence, retaining cart items, era preferences, and offline simulated orders across page reloads.")
    academic_p("• YouTube IFrame API: Configured to support curated era playlists when presentation playlist IDs are provided by the project owner.")
    academic_p("• SVG QR Code Generation: Generates scannable QR codes linking directly to the hosted application URL.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 22: CHAPTER 4 — TECHNOLOGY STACK AND DEVELOPMENT PLAN (PART 3)
    # =========================================================================
    section_title("4.4 Technology Selection Justification")
    academic_p("Key architectural decisions were evaluated against common technical alternatives:")

    p_tbl = doc.add_paragraph()
    p_tbl.paragraph_format.space_before = Pt(2)
    p_tbl.paragraph_format.space_after = Pt(2)
    r = p_tbl.add_run("Table 4.1: Architectural Technology Selection and Tradeoff Evaluation")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.bold = True

    tech_data = [
        ["Technology Chosen", "Alternative Evaluated", "Technical Rationale & Tradeoff Analysis"],
        ["React 19 + Vite SPA", "Next.js 15 (SSR / App Router)", "A single-page application avoids server cold-starts, provides zero-latency client navigation, and simplifies offline mock fallback."],
        ["PostgreSQL 15 (Supabase)", "MongoDB / NoSQL", "Relational ACID integrity is essential for inventory stock locking, atomic slot reservations, and financial ledger accounting."],
        ["Pure CSS Custom Properties", "Tailwind CSS / CSS-in-JS", "Avoids heavy runtime CSS parsers, enables instantaneous zero-runtime era theme switching via CSS root variables, and reduces bundle size."],
        ["Integer Paise Pricing", "JavaScript Number (Float)", "Eliminates binary floating-point rounding bugs (e.g., 0.1 + 0.2 = 0.30000000000000004), guaranteeing exact tax and invoice totals."]
    ]
    t_tech = doc.add_table(rows=len(tech_data), cols=3)
    academic_table(t_tech, [Inches(1.8), Inches(1.8), Inches(3.4)], tech_data[0], tech_data[1:], font_size=8)

    section_title("4.5 Project Milestones and Build Plan")
    academic_p("The project was executed across six two-week sprints from 01/09/2026 to 31/10/2026:")

    sprint_data = [
        ["Sprint", "Timeline", "Milestone Focus & Completed Deliverables", "Status"],
        ["Sprint 1", "01/09 – 10/09", "Requirements gathering, PRD drafting, and relational PostgreSQL schema design.", "COMPLETED"],
        ["Sprint 2", "11/09 – 22/09", "React 19 setup, design tokens, SiteHeader, SiteFooter, and base layout.", "COMPLETED"],
        ["Sprint 3", "23/09 – 05/10", "Cinematic hero, dual-era switcher, and catalogue menu filtering.", "COMPLETED"],
        ["Sprint 4", "06/10 – 16/10", "Customization modal, CartContext state management, and tax calculation.", "COMPLETED"],
        ["Sprint 5", "17/10 – 25/10", "Pickup slot scheduling, create_order RPC, and ticket confirmation dialog.", "COMPLETED"],
        ["Sprint 6", "26/10 – 31/10", "31-invariant test harness, Playwright browser testing, and final QA report.", "COMPLETED"]
    ]
    t_sprint = doc.add_table(rows=len(sprint_data), cols=4)
    academic_table(t_sprint, [Inches(0.9), Inches(1.2), Inches(4.0), Inches(0.9)], sprint_data[0], sprint_data[1:], font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 23: CHAPTER 5 — DATABASE DESIGN AND API SPECIFICATION (PART 1)
    # =========================================================================
    chapter_title("Chapter 5: Database Design and API Specification")

    section_title("5.1 Database Schema and ER Diagram")
    academic_p("The database is structured as a normalized relational schema deployed on PostgreSQL 15. The schema consists of 14 tables designed to enforce referential integrity, domain constraints, and audit logging:")

    academic_figure("screenshots/database/er_diagram.png", "Figure 5.1: Relational entity-relationship diagram for the Chaiwala database", width=Inches(5.3), space_before=2, space_after=2)

    academic_p("The tables are grouped into three primary clusters: the Catalogue Cluster (stores, products, option_groups, option_choices), the Scheduling Cluster (pickup_slots), and the Order Processing Cluster (orders, order_items, order_item_options, order_status_history).")

    doc.add_page_break()

    # =========================================================================
    # PAGE 24: CHAPTER 5 — DATABASE DESIGN AND API SPECIFICATION (PART 2)
    # =========================================================================
    section_title("5.2 Tables and Relationships (Data Dictionary)")
    academic_p("The relational entities, column types, and constraints are summarized in the data dictionary below:")

    p_tbl = doc.add_paragraph()
    p_tbl.paragraph_format.space_before = Pt(2)
    p_tbl.paragraph_format.space_after = Pt(2)
    r = p_tbl.add_run("Table 5.1: Relational Database Schema Data Dictionary and Constraints")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.bold = True

    dict_data = [
        ["Table Name", "Primary Key", "Key Attributes & Data Types", "Foreign Keys & Business Constraints"],
        ["stores", "id (UUID)", "name (TEXT), slug (TEXT UQ), is_open (BOOL), slot_capacity (INT)", "Root entity; owns products and pickup slots."],
        ["products", "id (UUID)", "name, hindi_name, slug (UQ), category (ENUM), mood (ENUM), base_price_paise (INT)", "REFERENCES stores(id); CHECK (base_price_paise >= 0)."],
        ["option_groups", "id (UUID)", "name (TEXT), required (BOOL), min_select (INT), max_select (INT)", "REFERENCES products(id) ON DELETE CASCADE."],
        ["option_choices", "id (UUID)", "name (TEXT), price_delta_paise (INT), is_default (BOOL), is_available (BOOL)", "REFERENCES option_groups(id) ON DELETE CASCADE."],
        ["pickup_slots", "id (UUID)", "slot_time (TIMESTAMPTZ), capacity (INT), booked (INT), status (TEXT)", "REFERENCES stores(id); UNIQUE(store_id, slot_time); CHECK(booked <= capacity)."],
        ["orders", "id (UUID)", "order_number (TEXT UQ), tracking_token (TEXT UQ), customer_name, customer_phone, total_paise", "REFERENCES stores(id), pickup_slots(id); CHECK(total_paise >= 0)."],
        ["order_items", "id (UUID)", "product_name (TEXT), unit_price_paise (INT), quantity (INT), line_total_paise (INT)", "REFERENCES orders(id) ON DELETE CASCADE, products(id); CHECK(quantity > 0)."],
        ["order_item_options", "id (UUID)", "group_name (TEXT), choice_name (TEXT), price_delta_paise (INT)", "REFERENCES order_items(id) ON DELETE CASCADE."],
        ["order_status_history", "id (UUID)", "status (ENUM), actor (TEXT), reason (TEXT), created_at (TIMESTAMPTZ)", "REFERENCES orders(id) ON DELETE CASCADE; maintains audit trail."]
    ]
    t_dict = doc.add_table(rows=len(dict_data), cols=4)
    academic_table(t_dict, [Inches(1.3), Inches(0.9), Inches(2.6), Inches(2.2)], dict_data[0], dict_data[1:], font_size=8)

    doc.add_page_break()

    # =========================================================================
    # PAGE 25: CHAPTER 5 — DATABASE DESIGN AND API SPECIFICATION (PART 3)
    # =========================================================================
    section_title("5.3 API Endpoints and Methods")
    academic_p("Chaiwala interfaces with PostgreSQL using stored Remote Procedure Calls (RPCs) to preserve transactional integrity:")
    academic_p("• create_order RPC: Performs atomic order validation and creation. It checks slot availability, decrements remaining capacity, calculates 5% GST and packaging charges, inserts order items and options, generates a tracking token, and returns the order summary.")
    academic_p("• get_order_tracking RPC: Returns the order status, line items, and milestone timeline matching a given cryptographic tracking token without exposing customer phone numbers.")
    academic_p("• transition_order_status RPC: Advances order status along the allowed kitchen lifecycle (PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED) and logs each transition in order_status_history.")

    section_title("5.4 Request and Response Formats")
    academic_p("The create_order RPC payload demonstrates the JSON format used across the API boundary:")

    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(2)
    p_code.paragraph_format.space_after = Pt(4)
    p_code.paragraph_format.line_spacing = 1.0
    r = p_code.add_run(
"""// POST /rest/v1/rpc/create_order (Sample Request Payload)
{
  "p_slot_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "p_customer_name": "Aarav Mohapatra",
  "p_customer_phone": "9876543210",
  "p_customer_notes": "Extra ginger, serve in earthen kulhad",
  "p_items": [
    { "productId": "prod-01", "quantity": 2, "options": [{ "choiceId": "opt-size-large" }] }
  ]
}
// RPC Response: { "orderNumber": "CW-1001", "trackingToken": "cwtk_714de725...", "totalPaise": 18325 }"""
    )
    r.font.name = "Courier New"; r.font.size = Pt(8); r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    section_title("5.5 Authentication and Security")
    academic_p("Data access security is governed by PostgreSQL Row Level Security (RLS) policies. Unauthenticated public clients can only read active products and access order records that match their specific tracking token. Administrative actions (status updates, product toggling) require authenticated JWT session tokens.", space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 26: CHAPTER 6 — TESTING AND EVALUATION (PART 1)
    # =========================================================================
    chapter_title("Chapter 6: Testing and Evaluation")

    section_title("6.1 Testing Strategy")
    academic_p("Quality assurance followed a multi-level testing methodology consisting of TypeScript static analysis, automated unit and integration tests, and end-to-end browser automation using Playwright.")

    academic_figure("screenshots/testing/test_execution_results.png", "Figure 6.1: Full-stack automated verification test suite execution record", width=Inches(5.3), space_before=2, space_after=2)

    academic_p("The automated test suite (.qa-order-tests.mjs) executes 31 formal invariant checks across eight functional suites. Tests verify catalogue asset loading, pickup slot generation, transactional price calculations, cryptographic token formats, kitchen FSM progression, and inventory availability toggling.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 27: CHAPTER 6 — TESTING AND EVALUATION (PART 2)
    # =========================================================================
    section_title("6.3 Test Cases and Results")
    academic_p("The empirical test results executed across the full application stack are documented below:")

    p_tbl = doc.add_paragraph()
    p_tbl.paragraph_format.space_before = Pt(2)
    p_tbl.paragraph_format.space_after = Pt(2)
    r = p_tbl.add_run("Table 6.1: Automated Verification Test Cases, Procedures, and Observed Results")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.bold = True

    test_data = [
        ["Test ID", "Test Scope", "Test Procedure & Invariant Checked", "Expected Result", "Status"],
        ["TC01", "Catalogue", "Verify 19 seed products and corresponding image files exist in public/images/.", "19 products loaded; 19 image files confirmed on disk.", "PASS"],
        ["TC02", "Pickup Slots", "Generate rolling 15-minute windows and verify default 6-order capacity ceiling.", "16 slots generated; capacity verified <= 6 orders per window.", "PASS"],
        ["TC03", "Order Calc", "Compute subtotal, 5% GST, ₹10 packaging fee for 2 Adrak Chai + 1 Bun Maska.", "Exact subtotal 16500, GST 825, total 18325 paise.", "PASS"],
        ["TC04", "Concurrency", "Place order in slot and verify remaining capacity decrements atomically.", "Slot capacity decrements from 6 to 5 without race conditions.", "PASS"],
        ["TC05", "Tracking", "Query get_order_tracking RPC using generated tracking token.", "Returns matching order ID, line items, and creation milestone.", "PASS"],
        ["TC06", "Kitchen FSM", "Execute valid transition PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED.", "All transitions accepted and logged in order_status_history.", "PASS"],
        ["TC07", "FSM Guard", "Attempt illegal transition from terminal COMPLETED state back to PREPARING.", "Transition strictly rejected with error; state unchanged.", "PASS"],
        ["TC08", "Cancellation", "Cancel pending order and verify slot capacity is restored to the pool.", "Slot capacity released back to original remaining count.", "PASS"],
        ["TC09", "Auth Guard", "Authenticate with valid admin credentials vs invalid password.", "Valid session token returned; invalid password rejected.", "PASS"],
        ["TC10", "Inventory 86", "Toggle product isAvailable flag and verify frontend catalog state.", "Product toggles to unavailable (86'd); re-toggles cleanly.", "PASS"]
    ]
    t_test = doc.add_table(rows=len(test_data), cols=5)
    academic_table(t_test, [Inches(0.6), Inches(0.9), Inches(2.7), Inches(2.2), Inches(0.6)], test_data[0], test_data[1:], font_size=7.5)

    section_title("6.4 AI Output Evaluation")
    academic_p("Code and assets generated with AI assistance were inspected for correctness. AI-scaffolded TypeScript types and SQL schemas were verified against project requirements, confirming exact integer paise math and proper RLS policy structure.")

    section_title("6.5 Limitations and Known Issues")
    academic_p("Current limitations include relying on counter payment (cash/UPI) rather than an integrated payment gateway, and requiring manual entry of YouTube playlist IDs for audio streaming.", space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 28: CHAPTER 7 — DEPLOYMENT AND RESULTS (PART 1)
    # =========================================================================
    chapter_title("Chapter 7: Deployment and Results")

    section_title("7.1 Deployment and Installation")
    academic_p("Chaiwala is deployed as an optimized static web application compiled through Vite. Deployment requires Node.js v18+ and follows standard build procedures:")
    academic_p("1. Dependency Setup: Run npm install inside client/ to install dependencies.")
    academic_p("2. Production Build: Run npm run build to execute TypeScript type-checking and Vite Rollup compilation, producing production assets in client/dist/.")
    academic_p("3. Static Hosting: The contents of client/dist/ can be deployed to any modern static hosting service (e.g., Vercel, Netlify, Cloudflare Pages) with HTTPS enabled.")

    section_title("7.2 System Screenshots — Generational Worlds")
    academic_p("Genuine screenshots captured from the running application illustrate the dual-era visual experience:")

    academic_figure("screenshots/application/01_homepage_1900s_adda.png", "Figure 7.1: Application landing page in 1900s Traditional Adda mode", width=Inches(4.9), space_before=2, space_after=2)
    academic_figure("screenshots/application/02_homepage_2020s_cafe.png", "Figure 7.2: Application landing page in 2020s Modern Café mode", width=Inches(4.9), space_before=2, space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 29: CHAPTER 7 — DEPLOYMENT AND RESULTS (PART 2)
    # =========================================================================
    section_title("7.2 System Screenshots — Workflows and Confirmation")
    academic_p("The ordering workflow screens demonstrate customization options, shopping bag review, slot selection, and order ticket generation:")

    academic_figure("screenshots/workflows/05_customization_modal.png", "Figure 7.3: Product customization modal dialog for sugar and cup size", width=Inches(4.7), space_before=2, space_after=2)
    academic_figure("screenshots/workflows/08_order_confirmation_ticket.png", "Figure 7.4: Live order confirmation ticket displaying order ID and tracking token", width=Inches(4.7), space_before=2, space_after=2)

    section_title("7.3 Implemented Features Checklist")
    academic_p("All project deliverables were verified: [x] Dual-era theme switcher; [x] 19-product catalogue; [x] Sugar and cup size customization; [x] Capacity-controlled pickup slots; [x] Idempotent order placement; [x] 100% automated test verification.")

    section_title("7.4 Expected vs. Actual Results")
    academic_p("The production build yielded an optimized bundle of 99.5 kB gzip JS and 12.8 kB gzip CSS, achieving a 100% pass rate across all 31 automated tests with sub-second page rendering.")

    section_title("7.5 Challenges and Solutions")
    academic_p("Key engineering hurdles included handling mobile LAN crypto.randomUUID lack (resolved with a CSPRNG byte array fallback) and preventing floating-point tax errors (resolved through integer paise math).", space_after=2)

    doc.add_page_break()

    # =========================================================================
    # PAGE 30: CHAPTER 8 — CONCLUSION, FUTURE SCOPE & REFERENCES
    # =========================================================================
    chapter_title("Chapter 8: Conclusion and Future Scope")

    section_title("8.1 Conclusion")
    academic_p("Chaiwala demonstrates that modern web technology can improve counter ordering efficiency at busy tea stalls while preserving the cultural storytelling of traditional tea culture. By combining React 19, TypeScript, and a dual-mode persistence architecture with capacity-controlled pickup slots, the platform eliminates physical queue bottlenecks without requiring native app downloads or third-party aggregator commissions.")

    section_title("8.2 Learning Outcomes")
    academic_p("Through this project, practical experience was gained in single-page application architecture, transactional database stored procedures (PostgreSQL RPCs), concurrency control in time-slotted booking systems, responsive CSS design tokens, and automated end-to-end testing.")

    section_title("8.3 Future Enhancements")
    academic_p("Future enhancements include integrating real-time WebSocket channels for instant kitchen notifications, connecting dynamic UPI QR payment gateways, supporting multi-store branch hierarchies, and adding customer preference analytics.")

    chapter_title("References / Bibliography")
    refs = [
        "[1] React Documentation Team, 'React 19 Architecture and Server Actions Specification', Meta Open Source, 2024. Available: https://react.dev",
        "[2] Vite Core Team, 'Vite: Next Generation Frontend Tooling Guide', Rollup & Vite Core, 2024. Available: https://vite.dev",
        "[3] PostgreSQL Global Development Group, 'PostgreSQL 15.0 Documentation: Stored Procedures & RLS', 2023. Available: https://www.postgresql.org/docs/15/",
        "[4] Supabase Inc., 'Supabase Architecture, Realtime Postgres and Edge Functions', 2024. Available: https://supabase.com/docs",
        "[5] World Wide Web Consortium (W3C), 'Web Content Accessibility Guidelines (WCAG) 2.1', W3C Recommendation, 2018. Available: https://www.w3.org/TR/WCAG21/",
        "[6] Microsoft Developer Network, 'Building Scalable Quick Service Restaurant Point-of-Sale Systems', Enterprise Architecture Series, 2023.",
        "[7] Playwright Team, 'Fast and Reliable End-to-End Testing for Modern Web Apps', Microsoft Open Source, 2024. Available: https://playwright.dev"
    ]
    for ref_str in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.space_before = Pt(0)
        p_ref.paragraph_format.space_after = Pt(2)
        p_ref.paragraph_format.line_spacing = 1.01
        r = p_ref.add_run(ref_str)
        r.font.name = "Times New Roman"; r.font.size = Pt(8.5)

    doc.save(DOCX_PATH)
    print(f"Report saved to {DOCX_PATH}")

if __name__ == "__main__":
    build_report()

