# Jahizoun MBA Tracker

Internal dashboard to follow the MBA applications of the Jahizoun and EDGE candidates on EO secondment.

It is a static site (plain HTML, CSS and JavaScript, no build step). Everything it shows comes from one file: **`js/data.js`**.

## Pages

- **Candidates** (`index.html#/`): one card per candidate with photo, Jahizoun / EDGE badge, EO team (Jahizoun only), the schools with a status dot, and the next interview date or *Pending*. Stat tiles at the top double as filters; you can also filter by programme, school and team, search by name and sort.
- **Profile** (`#/candidate/<id>`): one block per school with the stage bar, the interview date (or *Pending*), the published interview-decision and final-decision deadlines for the round the candidate is in, notes, and a "Key dates" timeline.
- **Deadlines** (`#/deadlines`): all published rounds per school and intake, with the current round highlighted and the candidates concerned.

## How to update the dashboard

### Option A: edit in the browser (easiest)

1. Open the dashboard and click **Edit mode** (top right).
2. Open a candidate and click **Edit** (or use **+ Add candidate**). Change statuses, interview dates, notes, photo, team, and save.
3. Changes are stored in *your* browser only. To publish them for everyone, click **Export data.js**: a new `data.js` is downloaded.
4. In GitHub, open `js/data.js`, click the pencil (edit), paste the content of the downloaded file over the old one, and commit. The site updates within a minute or two.
5. After committing, click **Discard local changes** in the banner so your browser shows the published version again.

### Option B: edit `js/data.js` directly

The file is commented. Each candidate looks like this:

```js
{
  id: "saoud-alkaabi",          // unique, used in the profile link
  name: "Saoud AlKaabi",
  programme: "Jahizoun",        // "Jahizoun" or "EDGE"
  team: "TBC",                  // shown for Jahizoun only
  photo: "",                    // e.g. "photos/saoud-alkaabi.jpg"; "" = placeholder circle
  intake: "January 2027",       // target MBA intake
  notes: "",
  applications: [
    { school: "HEC", status: "scheduled", interview: { date: "2026-09-10", note: "" }, notes: "" }
  ]
}
```

Status values (in order): `considering`, `drafting`, `essays_final`, `submitted`, `invited`, `scheduled`, `interviewed`, `admitted`, `waitlisted`, `rejected`, `withdrawn`.

Interview dates are `YYYY-MM-DD`. Several dates can be listed with commas (`"2026-09-15, 2026-09-16"`). An empty date shows **Pending**.

### Photos

Put the picture in the `photos/` folder (for example `photos/saoud-alkaabi.jpg`, square crops look best) and set `photo: "photos/saoud-alkaabi.jpg"` on the candidate. In Edit mode you can also pick a file directly; it is embedded in the exported `data.js`, resized to 320 px.

### Deadlines

The `DEADLINES` block in `js/data.js` holds the published application, interview-decision and final-decision dates per school and intake. Entries marked `interviewDecisionApprox` / `finalDecisionApprox` are computed from a rule the school publishes (e.g. "decision five weeks after the deadline") rather than a fixed date, and show as *approx.* in the dashboard. Update them from the school websites when new rounds are published.

Logos live in `Logos/`. `Logos/CBS.svg` is a placeholder wordmark; replace it with the official Columbia Business School logo file when available (keep the same file name or update `SCHOOLS` in `js/data.js`).

## Publishing with GitHub Pages

1. In the GitHub repository go to **Settings → Pages**.
2. Under *Build and deployment* choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
3. The dashboard will be available at `https://<owner>.github.io/mba-landing-site/`.

Note: a GitHub Pages site from a public repository is publicly reachable by anyone with the link (search engines are told not to index it). If the repository is private, GitHub Pages requires a paid plan to keep the site private.

## Running locally

Open `index.html` in a browser, or serve the folder (for example `python3 -m http.server`) so that *Export data.js* can download a complete file.
