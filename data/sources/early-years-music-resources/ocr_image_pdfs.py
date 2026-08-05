"""OCR the 13 image-based PDFs (no text layer) to recover their lyrics/actions.

Renders each page with PyMuPDF at 300 DPI, runs RapidOCR, writes one .md
per PDF into song_versions/ with YAML frontmatter, and logs extraction
stats to metadata/ocr_results.json.

Rule: output is the raw OCR text — no classification, no lesson creation.
Frontmatter fields left blank (educational_domain, skill_objective, etc.)
are filled by the QC agent in a later pass.
"""
import os, json, sys, re

sys.path.insert(0, r"C:\Users\jesse\AppData\Local\hermes\hermes-agent\venv\Lib\site-packages")
import fitz  # PyMuPDF
from rapidocr_onnxruntime import RapidOCR

ROOT = r"C:\Users\jesse\OneDrive\Documents\New project\data\sources\early-years-music-resources"

# image-based files identified in round 1 (category folder, filename)
TARGETS = [
    ("01-libraries-agencies", "swanton-public-library-bounce-rhymes.pdf"),
    ("02-educators-publishers", "sc-school-kindergarten-music-movement-activities.pdf"),
    ("03-performers-programs", "jack-hartmann-a-to-z-flash-cards.pdf"),
    ("03-performers-programs", "jack-hartmann-stretchy-word-snake-coloring-activity.pdf"),
    ("03-performers-programs", "mother-goose-club-five-little-monkeys-activity-book.pdf"),
    ("03-performers-programs", "mother-goose-club-five-little-monkeys-lyric-book.pdf"),
    ("03-performers-programs", "mother-goose-club-itsy-bitsy-spider-lyric-book.pdf"),
    ("03-performers-programs", "raffi-baby-beluga-lyrics-arrangement.pdf"),
    ("03-performers-programs", "raffi-down-by-the-bay-lyrics-arrangement.pdf"),
    ("03-performers-programs", "raffi-wheels-on-the-bus-lyrics-arrangement.pdf"),
    ("03-performers-programs", "the-learning-station-tony-chestnut-activity-handout.pdf"),
    ("03-performers-programs", "the-wiggles-dice-roll-activity.pdf"),
    ("03-performers-programs", "the-wiggles-wiggle-and-learn-circus-colouring.pdf"),
]

def ocr_pdf(pdf_path, ocr, dpi=300):
    """Render every page and OCR it. Returns (full_text, per_page_texts)."""
    doc = fitz.open(pdf_path)
    pages = []
    for pno in range(len(doc)):
        page = doc.load_page(pno)
        pix = page.get_pixmap(dpi=dpi)
        png = pix.tobytes("png")
        # save temp then OCR
        tmp = os.path.join(ROOT, "metadata", "_ocr_page.png")
        with open(tmp, "wb") as fh:
            fh.write(png)
        result, _ = ocr(tmp)
        if result:
            # rapidocr item = [box, text, score]; box = [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
            # sort by (y of top-left, x) for reading order
            lines = sorted(result, key=lambda l: (round(l[0][0][1] / 20), l[0][0][0]))
            pages.append("\n".join(line[1] for line in lines))
        else:
            pages.append("")
    doc.close()
    return "\n\n".join(pages), pages

def main():
    ocr = RapidOCR()
    results = {}
    for cat, fname in TARGETS:
        pdf_path = os.path.join(ROOT, cat, "pdf", fname)
        if not os.path.exists(pdf_path):
            print(f"SKIP missing: {cat}/{fname}")
            continue
        try:
            text, pages = ocr_pdf(pdf_path, ocr)
            n_chars = len(text.strip())
            words = len(re.findall(r"[A-Za-z]{3,}", text))
            print(f"{cat}/{fname}: {len(pages)} pages, {n_chars} chars, {words} words")
            # build source_id from filename
            source_id = "ocr-" + fname.rsplit(".", 1)[0]
            # write markdown with frontmatter to song_versions/
            out_name = source_id + ".md"
            out_path = os.path.join(ROOT, "song_versions", out_name)
            # build frontmatter
            frontmatter = f"""---
source_id: "{source_id}"
source_file: "{fname}"
source_category: "{cat}"
page_section: "OCR'd from image PDF ({len(pages)} pages)"
evidence_quote: ""
educational_domain: ""
skill_objective: ""
activity_material: ""
age_range: ""
confidence: 0.85
review_status: "pending_qc"
ocr_words: {words}
ocr_chars: {n_chars}
---

# {fname.replace('-', ' ').replace('.pdf', '').title()}

{text}
"""
            with open(out_path, "w", encoding="utf-8") as fh:
                fh.write(frontmatter)
            results[fname] = {"category": cat, "pages": len(pages), "chars": n_chars,
                              "words": words, "output": out_name, "status": "ok"}
        except Exception as e:
            print(f"ERROR {cat}/{fname}: {e}")
            results[fname] = {"category": cat, "status": "error", "error": str(e)}
    with open(os.path.join(ROOT, "metadata", "ocr_results.json"), "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=1, ensure_ascii=False)
    print("saved metadata/ocr_results.json")

if __name__ == "__main__":
    main()
