#!/usr/bin/env python3
"""Bundles the app source into public/snippet-studio-source.pdf for the in-app download button."""
import os
import subprocess
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "snippet-studio-source.pdf"

INCLUDE_DIRS = ["src", "docs", "scripts"]
INCLUDE_FILES = [
    "package.json",
    "bunfig.toml",
    "components.json",
    "eslint.config.js",
    "tsconfig.json",
    "vite.config.ts",
    "README.md",
    "AGENTS.md",
    "public/robots.txt",
]
SKIP_SUFFIXES = {".zip", ".pdf", ".ico", ".png", ".jpg", ".jpeg", ".webp", ".lock"}


def font(name: str, query: str) -> str:
    path = subprocess.check_output(["fc-match", "-f", "%{file}", query], text=True).strip()
    pdfmetrics.registerFont(TTFont(name, path))
    return name


SANS = font("Body", "DejaVu Sans")
SANS_B = font("BodyBold", "DejaVu Sans:bold")
MONO = font("Code", "DejaVu Sans Mono")


def collect() -> list[Path]:
    files: list[Path] = []
    for d in INCLUDE_DIRS:
        for path in sorted((ROOT / d).rglob("*")):
            if path.is_file() and path.suffix.lower() not in SKIP_SUFFIXES:
                files.append(path)
    for f in INCLUDE_FILES:
        p = ROOT / f
        if p.is_file():
            files.append(p)
    return files


def wrap(line: str, width: int = 96) -> list[str]:
    line = line.replace("\t", "    ").rstrip()
    if not line:
        return [""]
    out = []
    while len(line) > width:
        out.append(line[:width])
        line = "  " + line[width:]
    out.append(line)
    return out


def main() -> None:
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "T", parent=styles["Title"], fontName=SANS_B, fontSize=24, leading=30
    )
    h = ParagraphStyle(
        "H", parent=styles["Heading2"], fontName=SANS_B, fontSize=12, leading=16,
        spaceBefore=0, spaceAfter=6, textColor="#111111",
    )
    body = ParagraphStyle("B", parent=styles["Normal"], fontName=SANS, fontSize=9.5, leading=14)
    code = ParagraphStyle(
        "C", parent=styles["Code"], fontName=MONO, fontSize=6.6, leading=8.4,
        leftIndent=0, textColor="#1a1a1a",
    )

    files = collect()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=12 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Snippet Studio — Source Code",
        author="Snippet Studio",
    )

    flow = [
        Paragraph("Snippet Studio", title),
        Spacer(1, 6),
        Paragraph("Complete source code bundle", body),
        Spacer(1, 14),
        Paragraph(f"{len(files)} files included:", body),
        Spacer(1, 6),
    ]
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        flow.append(Paragraph(rel, ParagraphStyle("I", parent=code, fontSize=8, leading=11)))
    flow.append(PageBreak())

    for i, path in enumerate(files):
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8", errors="replace")
        lines: list[str] = []
        for n, line in enumerate(text.splitlines(), start=1):
            for j, chunk in enumerate(wrap(line)):
                lines.append(f"{n if j == 0 else '':>4} | {chunk}")
        flow.append(Paragraph(rel, h))
        flow.append(Preformatted("\n".join(lines) or "(empty file)", code, maxLineLength=200))
        if i < len(files) - 1:
            flow.append(PageBreak())

    def footer(canvas, _doc):
        canvas.saveState()
        canvas.setFont(MONO, 7)
        canvas.setFillColorRGB(0.45, 0.45, 0.45)
        canvas.drawRightString(A4[0] - 12 * mm, 8 * mm, str(canvas.getPageNumber()))
        canvas.restoreState()

    doc.build(flow, onFirstPage=footer, onLaterPages=footer)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB, {len(files)} files)")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
