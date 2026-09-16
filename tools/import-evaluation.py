#!/usr/bin/env python3
"""Import a 'Jahizoun - Quarterly Competence Evaluation' Excel file into v2/js/evaluation.js.

Usage:  python3 tools/import-evaluation.py <file.xlsx> <candidate-id> <quarter e.g. "2026 Q2">

Reads the line-manager rating and comment per competency (columns J and K of the
'Quarterly conversations' sheet), writes them under EVALUATIONS[<id>].quarterly[<quarter>]
and updates the rating grid for that quarter. Requires: pip install openpyxl
"""
import sys, re, json, subprocess, openpyxl

COMPETENCIES = ["Effective Communication & Influence", "Initiative", "Decision-Making & Accountability", "Capability Development", "Systemic Analysis & Planning"]
KEYS = [("communication", COMPETENCIES[0]), ("initiative", COMPETENCIES[1]), ("decision", COMPETENCIES[2]), ("capability", COMPETENCIES[3]), ("systemic", COMPETENCIES[4]), ("systematic", COMPETENCIES[4])]
RATINGS = {"strong": "strong", "effective": "effective", "developing": "developing"}

def comp_of(label):
    l = (label or "").lower()
    for k, c in KEYS:
        if k in l: return c
    return None

def main(path, cid, quarter):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Quarterly conversations"] if "Quarterly conversations" in wb.sheetnames else wb.worksheets[0]
    rows = {}
    for r in range(12, 40):
        label = ws.cell(r, 2).value
        if isinstance(label, str) and label.startswith("Comments"): break   # end of the competency table
        if not isinstance(label, str) or len(label) > 60: continue          # skip the definitions block
        c = comp_of(label)
        if not c: continue
        rating = RATINGS.get(str(ws.cell(r, 10).value or "").strip().lower())
        comment = str(ws.cell(r, 11).value or "").strip()
        rows[c] = {"rating": rating, "comment": comment}
    # the manager often writes all five comments in the first cell: split it by competency headings
    first = next((rows[c]["comment"] for c in COMPETENCIES if c in rows and rows[c]["comment"]), "")
    if first and sum(1 for c in COMPETENCIES if c in rows and rows[c]["comment"]) == 1:
        parts = re.split(r"\n\s*\n", first)
        for p in parts:
            head = p.split("-", 1)[0] if "-" in p[:60] else p[:40]
            c = comp_of(head)
            if c and c in rows:
                body = p.split("-", 1)[1].strip() if "-" in p[:60] else p.strip()
                rows[c]["comment"] = body
    manager = None
    for r in range(1, 12):
        if ws.cell(r, 2).value == "Line Manager": manager = ws.cell(r, 4).value
    out = {"quarter": quarter, "manager": manager, "competencies": rows}
    # merge into evaluation.js via node
    js = """
const fs=require('fs'), vm=require('vm');
const [cid, payload] = process.argv.slice(1); const data = JSON.parse(payload);
const p='v2/js/evaluation.js'; const src=fs.readFileSync(p,'utf8'); const ctx={window:{}}; vm.runInNewContext(src,ctx);
const E=ctx.window.MBA_EVAL; const ev=E.EVALUATIONS[cid]; if(!ev) throw new Error('unknown candidate '+cid);
ev.quarterly = ev.quarterly || {}; ev.quarterly[data.quarter] = { manager: data.manager || ev.lineManager, competencies: data.competencies };
for (const [c, v] of Object.entries(data.competencies)) { if (v.rating) { ev.ratings[c] = ev.ratings[c] || {}; ev.ratings[c][data.quarter] = v.rating; } }
const start=src.indexOf('const EXTRA_CANDIDATES = ['), end=src.indexOf('/* Do not edit below this line. */');
fs.writeFileSync(p, src.slice(0,start)+'const EXTRA_CANDIDATES = '+JSON.stringify(E.EXTRA_CANDIDATES,null,2)+';\\n\\nconst NAME_OVERRIDES = '+JSON.stringify(E.NAME_OVERRIDES,null,2)+';\\n\\nconst EVALUATIONS = '+JSON.stringify(E.EVALUATIONS,null,2)+';\\n\\n'+src.slice(end));
console.log('imported', cid, data.quarter, Object.keys(data.competencies).length, 'competencies; manager:', data.manager);
"""
    subprocess.run(["node", "-e", js, cid, json.dumps(out)], check=True)
    for c in COMPETENCIES:
        v = rows.get(c, {})
        print(f"  {c}: {v.get('rating')} | {(v.get('comment') or '')[:90]}")

if __name__ == "__main__":
    if len(sys.argv) != 4: sys.exit(__doc__)
    main(*sys.argv[1:])
