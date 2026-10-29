#!/usr/bin/env python3
"""Import a 'Jahizoun - Quarterly Competence Evaluation' Excel file into v2/js/evaluation.js.

Usage:  python3 tools/import-evaluation.py <file.xlsx> <candidate-id> <quarter e.g. "2026 Q2"> [options]
  --sheet "<name>"     worksheet to read (default: 'Quarterly conversations', else the first sheet)
  --cols F,G           rating and comment columns to read (default: the columns under the
                       'Line Manager Evaluation' header, or J,K when no header is found)
  --manager "<name>"   line manager name when the sheet leaves it blank (default: deck line manager)

Reads the line-manager rating and comment per competency, writes them under
EVALUATIONS[<id>].quarterly[<quarter>] and updates the rating grid for that quarter.
Requires: pip install openpyxl
"""
import sys, re, json, subprocess, openpyxl
from openpyxl.utils import column_index_from_string

COMPETENCIES = ["Effective Communication & Influence", "Initiative", "Decision-Making & Accountability", "Capability Development", "Inspirational Leadership", "Strategic Thinking", "Adaptability", "Systemic Analysis & Planning"]
KEYS = [("communication", COMPETENCIES[0]), ("initiative", COMPETENCIES[1]), ("decision", COMPETENCIES[2]), ("capability", COMPETENCIES[3]), ("inspirational", COMPETENCIES[4]), ("strategic", COMPETENCIES[5]), ("adaptab", COMPETENCIES[6]), ("systemic", COMPETENCIES[7]), ("systematic", COMPETENCIES[7])]
RATINGS = {"strong": "strong", "effective": "effective", "developing": "developing", "n/a": "na", "na": "na"}

def comp_of(label):
    l = (label or "").lower()
    for k, c in KEYS:
        if k in l: return c
    return None

def main(path, cid, quarter, sheet=None, cols=None, manager_override=None):
    wb = openpyxl.load_workbook(path, data_only=True)
    if sheet: ws = wb[sheet]
    else: ws = wb["Quarterly conversations"] if "Quarterly conversations" in wb.sheetnames else wb.worksheets[0]
    rcol, ccol, hdr = 10, 11, 11
    for r in range(1, 13):                       # find the 'Line Manager Evaluation' header
        for c in range(1, ws.max_column + 1):
            v = ws.cell(r, c).value
            if isinstance(v, str) and "line manager evaluation" in v.strip().lower(): rcol, ccol, hdr = c, c + 1, r
    if cols:
        a, b = cols.split(","); rcol, ccol = column_index_from_string(a.strip().upper()), column_index_from_string(b.strip().upper())
    # extra reviewer columns (e.g. a second 'Comments/Rationales' column headed by the reviewers' names)
    extras = []
    for c in range(ccol + 1, ws.max_column + 1):
        sub = ws.cell(hdr + 1, c).value; who = ws.cell(hdr, c).value
        if isinstance(sub, str) and "comment" in sub.lower() and isinstance(who, str) and who.strip(): extras.append((c, who.strip()))
    rows, summary = {}, ""
    for r in range(hdr + 1, ws.max_row + 1):
        label = ws.cell(r, 2).value
        if not isinstance(label, str): continue
        if label.startswith("Comments") or label.startswith("Definitions"): break   # end of the competency table
        if label.lower().startswith("areas of focus"):
            summary = " ".join(str(ws.cell(rr, 2).value).strip() for rr in range(r + 1, r + 7) if ws.cell(rr, 2).value); break
        if len(label) > 60: continue          # skip the definitions block
        c = comp_of(label)
        if not c: continue
        rating = RATINGS.get(str(ws.cell(r, rcol).value or "").strip().lower())
        comment = str(ws.cell(r, ccol).value or "").strip()
        for ec, who in extras:
            ev = str(ws.cell(r, ec).value or "").strip()
            if ev: comment = (comment + "\n\n" if comment else "") + who + ": " + ev
        rows[c] = {"rating": rating, "comment": comment}
    # the manager often writes all five comments in the first cell: split it by competency headings
    unmatched = []
    first = next((rows[c]["comment"] for c in COMPETENCIES if c in rows and rows[c]["comment"]), "")
    if first and sum(1 for c in COMPETENCIES if c in rows and rows[c]["comment"]) == 1:
        for p in re.split(r"\n\s*\n", first):
            p = p.strip()
            if not p: continue
            head, body = None, p
            lines = p.split("\n", 1)
            if len(lines) == 2 and len(lines[0]) <= 60 and (comp_of(lines[0]) or "summary" in lines[0].lower() or "overall" in lines[0].lower()):
                head, body = lines[0], lines[1]                      # "Heading\nText"
            else:
                for sep in (" - ", " – ", ": ", "-"):
                    if sep in p[:60] and comp_of(p.split(sep, 1)[0]):
                        head, body = p.split(sep, 1); break         # "Heading - Text"
            c = comp_of(head) if head else None
            if c and c in rows: rows[c]["comment"] = body.strip()
            elif head and ("summary" in head.lower() or "overall" in head.lower()): summary = body.strip()
            else: unmatched.append(p)
        for c in COMPETENCIES:
            if c in rows and rows[c]["comment"] == first: rows[c]["comment"] = ""   # heading not found: keep nothing rather than the whole cell
        if unmatched: print("WARNING: paragraphs not matched to a competency:", [u[:60] for u in unmatched])
    if not any(v["rating"] or v["comment"] for v in rows.values()):
        sys.exit(f"nothing to import: columns {rcol},{ccol} of sheet '{ws.title}' are empty")
    manager = manager_override
    for r in range(1, 12):
        for c in range(1, ws.max_column + 1):
            if str(ws.cell(r, c).value or "").strip() == "Line Manager" and not manager:
                for cc in range(c + 1, c + 4):
                    v = ws.cell(r, cc).value
                    if isinstance(v, str) and v.strip() and not v.startswith("<") and v.strip().lower() != "position": manager = v.strip(); break
    out = {"quarter": quarter, "manager": manager, "competencies": rows, "summary": summary, "summaryLabel": "Areas of focus" if summary and any(str(ws.cell(r, 2).value or "").lower().startswith("areas of focus") for r in range(1, ws.max_row + 1)) else ""}
    # merge into evaluation.js via node
    js = """
const fs=require('fs'), vm=require('vm');
const [cid, payload] = process.argv.slice(1); const data = JSON.parse(payload);
const p='v2/js/evaluation.js'; const src=fs.readFileSync(p,'utf8'); const ctx={window:{}}; vm.runInNewContext(src,ctx);
const E=ctx.window.MBA_EVAL; const ev=E.EVALUATIONS[cid]; if(!ev) throw new Error('unknown candidate '+cid);
ev.quarterly = ev.quarterly || {}; ev.quarterly[data.quarter] = { manager: data.manager || ev.lineManager, competencies: data.competencies }; if (data.summary) { ev.quarterly[data.quarter].summary = data.summary; ev.quarterly[data.quarter].summaryLabel = data.summaryLabel || ""; }
for (const [c, v] of Object.entries(data.competencies)) { if (v.rating) { ev.ratings[c] = ev.ratings[c] || {}; ev.ratings[c][data.quarter] = v.rating; } }
const start=src.indexOf('const EXTRA_CANDIDATES = ['), end=src.indexOf('/* Do not edit below this line. */');
fs.writeFileSync(p, src.slice(0,start)+'const EXTRA_CANDIDATES = '+JSON.stringify(E.EXTRA_CANDIDATES,null,2)+';\\n\\nconst NAME_OVERRIDES = '+JSON.stringify(E.NAME_OVERRIDES,null,2)+';\\n\\nconst EVALUATIONS = '+JSON.stringify(E.EVALUATIONS,null,2)+';\\n\\n'+src.slice(end));
console.log('imported', cid, data.quarter, Object.keys(data.competencies).length, 'competencies; manager:', data.manager);
"""
    subprocess.run(["node", "-e", js, cid, json.dumps(out)], check=True)
    for c in COMPETENCIES:
        v = rows.get(c, {})
        print(f"  {c}: {v.get('rating')} | {(v.get('comment') or '')[:90]}")
    if summary: print(f"  Summary | {summary[:90]}")

if __name__ == "__main__":
    args, opts = [], {}
    it = iter(sys.argv[1:])
    for a in it:
        if a.startswith("--"): opts[a[2:]] = next(it, None)
        else: args.append(a)
    if len(args) != 3: sys.exit(__doc__)
    main(*args, sheet=opts.get("sheet"), cols=opts.get("cols"), manager_override=opts.get("manager"))
