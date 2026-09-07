/* =====================================================================
   JAHIZOUN MBA TRACKER — DATA FILE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update the dashboard.
   You can also edit everything in the browser (Edit mode) and then use
   "Export data.js" to download this file with your changes, and replace
   it in the repository.

   HOW TO READ THIS FILE
   - Every candidate is one object inside CANDIDATES.
   - programme: "Jahizoun" or "EDGE". Teams are only shown for Jahizoun.
   - photo: path to a picture inside the /photos folder (e.g. "photos/saoud-alkaabi.jpg").
            Leave "" while there is no picture yet — a placeholder circle is shown.
   - intake: the MBA class the candidate is applying for.
   - applications: one entry per school. "status" must be one of the STATUS keys below.
   - interview.date: "YYYY-MM-DD" (or a list of dates "2026-09-15, 2026-09-16").
                     Leave "" when no interview is scheduled — the dashboard shows "Pending".
   - Dates are always written as YYYY-MM-DD.
   ===================================================================== */

/* Application stages, in order. The key on the left is what you write in "status". */
const STATUSES = {
  considering:  { label: "Going to apply",        stage: 0, tone: "muted" },
  drafting:     { label: "Drafting essays",       stage: 1, tone: "muted" },
  essays_final: { label: "Essays finalised",      stage: 2, tone: "info" },
  submitted:    { label: "Submitted",             stage: 3, tone: "info" },
  invited:      { label: "Interview invited",     stage: 4, tone: "warning" },
  scheduled:    { label: "Interview scheduled",   stage: 5, tone: "warning" },
  interviewed:  { label: "Interviewed",           stage: 6, tone: "info" },
  admitted:     { label: "Admitted",              stage: 7, tone: "good" },
  waitlisted:   { label: "Waitlisted",            stage: 7, tone: "warning" },
  rejected:     { label: "Not admitted",          stage: 7, tone: "critical" },
  withdrawn:    { label: "Withdrawn",             stage: 7, tone: "muted" }
};

/* Schools. "logo" is a file in /logos. */
const SCHOOLS = {
  INSEAD: { name: "INSEAD",                          short: "INSEAD", logo: "Logos/Insead.jpg",  url: "https://www.insead.edu/master-programmes/master-business-administration/admissions" },
  HEC:    { name: "HEC Paris",                       short: "HEC",    logo: "Logos/HEC Logo.png",     url: "https://www.hec.edu/en/mba-programs/mba/admissions/application-deadlines" },
  IMD:    { name: "IMD Lausanne",                    short: "IMD",    logo: "Logos/IMD Logo.png",     url: "https://www.imd.org/degree/mba/admissions/admission-process/" },
  CBS:    { name: "Columbia Business School",        short: "CBS",    logo: "Logos/CBS.svg",     url: "https://academics.business.columbia.edu/admissions/mba/options-deadlines" },
  NYUAD:  { name: "NYU Stern at NYU Abu Dhabi",      short: "NYUAD",  logo: "Logos/NYU Abu Dhabi.png",   url: "https://stern.nyuad.nyu.edu/programs-admissions/mba-program/admissions/application-deadlines/" },
  BOCCONI:{ name: "SDA Bocconi",                     short: "Bocconi",logo: "Logos/SDA Bocconi.png", url: "https://www.sdabocconi.it/en/programs/full-time-mba" }
};

/* =====================================================================
   PUBLISHED DEADLINES (per school, per intake, per round)
   Source: the schools' published admissions calendars, collected 7 Sep 2026.
   "approx" = the school publishes a rule (e.g. "5 weeks after the deadline")
   rather than a fixed date; the date shown is computed from that rule.
   Always double-check against the school website before relying on a date.
   ===================================================================== */
const DEADLINES = [
  {
    school: "INSEAD", intake: "January 2027",
    rounds: [
      { round: "Round 4", application: "2026-08-04", interviewDecision: "2026-09-04", finalDecision: "2026-10-09" }
    ],
    note: "Applications are reviewed on a rolling basis within a round; the dates are the latest by which candidates hear back."
  },
  {
    school: "INSEAD", intake: "August 2027",
    rounds: [
      { round: "Round 1", application: "2026-09-15", interviewDecision: "2026-10-16", interviewDecisionApprox: true, finalDecision: "2026-11-20" },
      { round: "Round 2", application: "2026-11-03", interviewDecision: "2026-12-04", interviewDecisionApprox: true, finalDecision: "2027-01-22", finalDecisionApprox: true },
      { round: "Round 3", application: "2027-01-19", interviewDecision: "2027-02-19", interviewDecisionApprox: true, finalDecision: "2027-03-19" },
      { round: "Round 4", application: "2027-03-09", interviewDecision: "2027-04-09", interviewDecisionApprox: true, finalDecision: "2027-05-07" }
    ],
    note: "INSEAD informs candidates of the interview (pre-selection) decision about one month after the round closes. INSEAD calls this the August 2027 intake."
  },
  {
    school: "HEC", intake: "January 2027",
    rounds: [
      { round: "16 Aug deadline", application: "2026-08-16", interviewDecision: "2026-09-06", interviewDecisionApprox: true, finalDecision: "2026-09-20", finalDecisionApprox: true },
      { round: "20 Sep deadline", application: "2026-09-20", interviewDecision: "2026-10-11", interviewDecisionApprox: true, finalDecision: "2026-10-25", finalDecisionApprox: true },
      { round: "18 Oct deadline", application: "2026-10-18", interviewDecision: "2026-11-08", interviewDecisionApprox: true, finalDecision: "2026-11-22", finalDecisionApprox: true },
      { round: "15 Nov deadline", application: "2026-11-15", interviewDecision: "2026-12-06", interviewDecisionApprox: true, finalDecision: "2026-12-20", finalDecisionApprox: true }
    ],
    note: "Rolling admissions with monthly deadlines. Interviews take place in the two weeks before the Admissions Jury; the admission decision comes about five weeks after the deadline."
  },
  {
    school: "IMD", intake: "January 2027",
    rounds: [
      { round: "Round 4", application: "2026-07-14", interviewDecision: "", finalDecision: "" },
      { round: "Round 5", application: "2026-09-15", interviewDecision: "", finalDecision: "" },
      { round: "Round 6", application: "2026-10-13", interviewDecision: "", finalDecision: "" }
    ],
    note: "Shortlisted candidates are invited to an Assessment Day linked to their round (virtual or in Lausanne). IMD does not publish fixed interview or decision dates; decisions usually follow within a few weeks of the Assessment Day."
  },
  {
    school: "CBS", intake: "January 2027 (J-Term)",
    rounds: [
      { round: "Round 1", application: "2026-06-17", interviewDecision: "2026-07-31", interviewDecisionApprox: true, finalDecision: "2026-07-31" },
      { round: "Round 2", application: "2026-08-13", interviewDecision: "2026-10-01", interviewDecisionApprox: true, finalDecision: "2026-10-01" }
    ],
    note: "Rolling within each round: interview invitations (or a deny) are released as soon as possible and no later than the round's decision date."
  },
  {
    school: "NYUAD", intake: "January 2027",
    rounds: [
      { round: "Deadline 1", application: "2026-06-04", interviewDecision: "", finalDecision: "" },
      { round: "Final deadline", application: "2026-08-06", interviewDecision: "", finalDecision: "" }
    ],
    note: "Applications are reviewed on an ongoing basis. Candidates receive an initial notification (interview invitation, waitlist or deny) by the notification date of their deadline; Stern at NYUAD does not publish that date on its public pages."
  }
];

/* =====================================================================
   CANDIDATES
   ===================================================================== */
const CANDIDATES = [
  {
    id: "fatima-balnoub",
    name: "Fatima Balnoub",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "HEC", status: "drafting", interview: { date: "", note: "" }, notes: "Awaiting HEC drafts." },
      { school: "IMD", status: "essays_final", interview: { date: "", note: "" }, notes: "IMD final essays sent." }
    ]
  },
  {
    id: "mohamed-al-naqabi",
    name: "Mohamed Al Naqabi",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "HEC", status: "submitted", interview: { date: "", note: "" }, notes: "HEC submitted." },
      { school: "IMD", status: "drafting", interview: { date: "", note: "" }, notes: "IMD under final review with an alumnus." }
    ]
  },
  {
    id: "abdulrahman-almarzooqi",
    name: "Abdulrahman Almarzooqi",
    programme: "EDGE",
    team: "",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "HEC", status: "drafting", interview: { date: "", note: "" }, notes: "Awaiting HEC drafts." },
      { school: "IMD", status: "drafting", interview: { date: "", note: "" }, notes: "IMD under editing." }
    ]
  },
  {
    id: "waleed-almansoori",
    name: "Waleed Almansoori",
    programme: "EDGE",
    team: "",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "HEC", status: "drafting", interview: { date: "", note: "" }, notes: "Awaiting HEC drafts." },
      { school: "IMD", status: "drafting", interview: { date: "", note: "" }, notes: "IMD under editing." }
    ]
  },
  {
    id: "mohamed-al-hameli",
    name: "Mohamed Al Hameli",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "INSEAD", status: "invited", interview: { date: "", note: "Interview invite received; date to be confirmed." }, notes: "" },
      { school: "HEC", status: "drafting", interview: { date: "", note: "" }, notes: "HEC under editing." },
      { school: "IMD", status: "drafting", interview: { date: "", note: "" }, notes: "Awaiting IMD drafts." }
    ]
  },
  {
    id: "theyab-ali",
    name: "Theyab Ali",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "Waiting for the INSEAD outcome before deciding on IMD.",
    applications: [
      { school: "INSEAD", status: "submitted", interview: { date: "", note: "" }, notes: "Awaiting INSEAD outcome." }
    ]
  },
  {
    id: "saoud-alkaabi",
    name: "Saoud AlKaabi",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "Interview prep sessions held on Saturday 5 Sep and Monday 7 Sep.",
    applications: [
      { school: "HEC", status: "scheduled", interview: { date: "2026-09-10", note: "Two HEC alumni interviews this week; one on 10 Sep, second date to be confirmed." }, notes: "" },
      { school: "IMD", status: "invited", interview: { date: "", note: "" }, notes: "" },
      { school: "CBS", status: "invited", interview: { date: "", note: "" }, notes: "" }
    ]
  },
  {
    id: "khalifa-al-mansoori",
    name: "Khalifa Al Mansoori",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "Interview prep sessions held on Saturday 5 Sep and Monday 7 Sep.",
    applications: [
      { school: "HEC", status: "invited", interview: { date: "", note: "Two HEC alumni interviews this week; dates to be confirmed." }, notes: "" },
      { school: "IMD", status: "invited", interview: { date: "", note: "" }, notes: "" },
      { school: "CBS", status: "invited", interview: { date: "", note: "" }, notes: "" }
    ]
  },
  {
    id: "khaled-alteneiji",
    name: "Khaled Alteneiji",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "INSEAD", status: "scheduled", interview: { date: "2026-09-15, 2026-09-16", note: "Two alumni interviews." }, notes: "" }
    ]
  },
  {
    id: "hamad-alkhazeeri",
    name: "Hamad Alkhazeeri",
    programme: "EDGE",
    team: "",
    photo: "",
    intake: "September 2027",
    notes: "Applying for the 2027 class. Met on 7 Sep to discuss the application.",
    applications: [
      { school: "INSEAD", status: "drafting", interview: { date: "", note: "" }, notes: "INSEAD August 2027 intake (Round 1 deadline 15 Sep 2026, Round 2 deadline 3 Nov 2026)." }
    ]
  },
  {
    id: "mouza-al-zaabi",
    name: "Mouza Al Zaabi",
    programme: "EDGE",
    team: "",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "NYUAD", status: "submitted", interview: { date: "", note: "" }, notes: "Interview decision pending." }
    ]
  },
  {
    id: "haneen-aljneibi",
    name: "Haneen Aljneibi",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "INSEAD", status: "submitted", interview: { date: "", note: "" }, notes: "Interview decision pending." }
    ]
  },
  {
    id: "mohammed-al-mahri",
    name: "Mohammed Al Mahri",
    programme: "Jahizoun",
    team: "TBC",
    photo: "",
    intake: "January 2027",
    notes: "",
    applications: [
      { school: "INSEAD", status: "submitted", interview: { date: "", note: "" }, notes: "Interview decision pending." },
      { school: "CBS", status: "submitted", interview: { date: "", note: "" }, notes: "Interview decision pending." },
      { school: "NYUAD", status: "submitted", interview: { date: "", note: "" }, notes: "Interview decision pending." }
    ]
  }
];

/* Do not edit below this line. */
window.MBA_DATA = { STATUSES, SCHOOLS, DEADLINES, CANDIDATES };
