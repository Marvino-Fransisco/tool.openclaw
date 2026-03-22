#!/usr/bin/env python3
import json
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
import glob
from reportlab.lib.enums import TA_CENTER, TA_LEFT

INPUT_FILE = "./idea/trade.json"
OUTPUT_FILE = "./idea/trade.pdf"

def load_trade_data(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    if 'valueAreaPairs' in data:
        del data['valueAreaPairs']
    return data

def find_images_in_directory(directory):
    if os.path.exists(directory):
        return sorted(glob.glob(os.path.join(directory, "*.png")))
    return []

def create_pdf(data, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        alignment=TA_CENTER,
        spaceAfter=20,
        textColor=colors.HexColor('#1a1a2e')
    )
    
    label_style = ParagraphStyle(
        'LabelStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#666666'),
        spaceAfter=2
    )
    
    value_style = ParagraphStyle(
        'ValueStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#1a1a2e'),
        spaceAfter=8
    )
    
    text_style = ParagraphStyle(
        'TextStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        leading=14
    )
    
    story = []
    
    story.append(Paragraph("TRADE ANALYSIS", title_style))
    story.append(Spacer(1, 10))
    
    bias = data.get('bias', 'N/A').upper()
    confident = data.get('confident', 'N/A')
    
    bias_color = colors.HexColor('#dc3545') if bias == 'DOWN' else colors.HexColor('#28a745') if bias == 'UP' else colors.HexColor('#6c757d')
    
    header_data = [[
        Paragraph(f"<b>BIAS:</b>", label_style),
        Paragraph(f"<b>CONFIDENCE:</b>", label_style)
    ], [
        Paragraph(f'<font color="{bias_color.hexval()}">{bias}</font>', value_style),
        Paragraph(f'{confident}/10', value_style)
    ]]
    
    header_table = Table(header_data, colWidths=[3.5*inch, 3.5*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    
    current_price = data.get('currentPrice', 'N/A')
    entry = data.get('entry', 'N/A')
    sl = data.get('sl', 'N/A')
    tp1 = data.get('tp1', 'N/A')
    tp2 = data.get('tp2', 'N/A')
    
    trade_data = [
        [Paragraph("<b>CURRENT PRICE</b>", label_style), Paragraph("<b>ENTRY</b>", label_style)],
        [Paragraph(f"{current_price}", value_style), Paragraph(f"{entry}", value_style)],
        [Paragraph("<b>STOP LOSS</b>", label_style), Paragraph("<b>TAKE PROFIT 1</b>", label_style)],
        [Paragraph(f'<font color="#dc3545">{sl}</font>', value_style), Paragraph(f'<font color="#28a745">{tp1}</font>', value_style)],
        [Paragraph("<b>TAKE PROFIT 2</b>", label_style), ""],
        [Paragraph(f'<font color="#28a745">{tp2}</font>', value_style), ""],
    ]
    
    trade_table = Table(trade_data, colWidths=[3.5*inch, 3.5*inch])
    trade_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(trade_table)
    story.append(Spacer(1, 15))
    
    reason = data.get('reason', 'N/A')
    reason_data = [
        [Paragraph("<b>TRADE REASON</b>", label_style)],
        [Paragraph(reason, text_style)]
    ]
    
    reason_table = Table(reason_data, colWidths=[7*inch])
    reason_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))
    story.append(reason_table)
    story.append(Spacer(1, 15))
    
    image_directory = "/home/node/.openclaw/workspace-trade-planner/idea/"
    image_paths = find_images_in_directory(image_directory)
    for img_path in image_paths:
        img = Image(img_path, width=6.5*inch, height=4*inch)
        story.append(img)
        story.append(Spacer(1, 15))
    
    entry_trigger = data.get('entryTrigger', 'N/A')
    sl_reason = data.get('slReason', 'N/A')
    tp1_reason = data.get('tp1Reason', 'N/A')
    tp2_reason = data.get('tp2Reason', 'N/A')
    
    details_data = [
        [Paragraph("<b>ENTRY TRIGGER</b>", label_style)],
        [Paragraph(entry_trigger, text_style)],
        [Paragraph("<b>STOP LOSS REASON</b>", label_style)],
        [Paragraph(sl_reason, text_style)],
        [Paragraph("<b>TP1 REASON</b>", label_style)],
        [Paragraph(tp1_reason, text_style)],
        [Paragraph("<b>TP2 REASON</b>", label_style)],
        [Paragraph(tp2_reason, text_style)],
    ]
    
    details_table = Table(details_data, colWidths=[7*inch])
    details_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))
    story.append(details_table)
    
    doc.build(story)
    print(f"PDF generated: {output_path}")

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file not found: {INPUT_FILE}")
        return 1
    
    data = load_trade_data(INPUT_FILE)
    create_pdf(data, OUTPUT_FILE)
    return 0

if __name__ == "__main__":
    exit(main())
