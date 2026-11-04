import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)
DOCX_PATH = os.path.join(OUTPUT_DIR, "IBST_Mini_Project_Report.docx")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_styled_heading(doc, text, level=1, space_before=6, space_after=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    if level == 1:
        run.font.size = Pt(14)
        run.bold = True
        run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    elif level == 2:
        run.font.size = Pt(12)
        run.bold = True
        run.font.color.rgb = RGBColor(0x1f, 0x29, 0x37)
    else:
        run.font.size = Pt(11)
        run.bold = True
        run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
    return p

def add_body_p(doc, text, bold_prefix="", italic_suffix="", space_after=3, line_spacing=1.05, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.font.name = "Times New Roman"
        r_b.font.size = Pt(10.5)
        r_b.bold = True
    if text:
        r_t = p.add_run(text)
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(10.5)
    if italic_suffix:
        r_i = p.add_run(italic_suffix)
        r_i.font.name = "Times New Roman"
        r_i.font.size = Pt(10.5)
        r_i.italic = True
    return p

def add_bullet_p(doc, bold_title, text, space_after=2):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.05
    r_b = p.add_run(bold_title + " ")
    r_b.font.name = "Times New Roman"
    r_b.font.size = Pt(10)
    r_b.bold = True
    r_t = p.add_run(text)
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(10)
    return p

def add_figure_image(doc, img_path, caption_text, width=Inches(5.4), space_before=4, space_after=4):
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
    c_run = cp.add_run(caption_text)
    c_run.font.name = "Times New Roman"
    c_run.font.size = Pt(9.5)
    c_run.bold = True
    c_run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    return cp

def format_clean_table(tbl, col_widths, headers, data, font_size=9):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1E293B")
        set_cell_margins(hdr_cells[i], top=60, bottom=60, left=80, right=80)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        r = p.runs[0]
        r.font.name = "Times New Roman"
        r.font.size = Pt(font_size)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    # Data rows
    for r_idx, row_data in enumerate(data):
        row_cells = tbl.rows[r_idx + 1].cells
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_col)
            set_cell_margins(row_cells[c_idx], top=40, bottom=40, left=70, right=70)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            r = p.runs[0]
            r.font.name = "Times New Roman"
            r.font.size = Pt(font_size - 0.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    
    # Set widths
    for row in tbl.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

print("Helper functions defined successfully")

