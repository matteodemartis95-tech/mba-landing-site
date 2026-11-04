/* Pre-departure tracking for the Jahizoun / EDGE candidates going to an MBA (V3 only).
   DEPARTURE_META: exchange rates to AED (edit the rate and date by hand), the four checklist items, the onboarding note.
   JOURNEYS: programme phases per school. DEPARTURE[candidate id]: school, deposit and the status of each item.
   Statuses: done · progress · todo · na. */

const DEPARTURE_META = {
  rates: { EUR: 4.25, CHF: 4.60, USD: 3.6725 },
  ratesDate: "2026-11-04",
  items: [
    { key: "deposit", label: "Deposit", owner: "T&LD" },
    { key: "visa", label: "Visa", owner: "MOD E&T" },
    { key: "insurance", label: "Health insurance", owner: "MOD E&T" },
    { key: "housing", label: "Housing", owner: "MOD E&T" }
  ],
  onboarding: "Pre-departure onboarding will be delivered in a single day by MOD Education and Training.",
  statuses: { done: "Done", progress: "In progress", todo: "To launch", na: "Not required" }
};

/* Journey colours: a green scale, dark to light; "text" is the text colour on that segment. */
const G1 = "#0f4c35", G2 = "#1b7a4e", G3 = "#35a86a", G4 = "#cfe9d9";
const JOURNEYS = {
  INSEAD: {
    start: "2027-01-07",
    label: "INSEAD MBA · January 2027 intake",
    phases: [
      { label: "Periods 1–3 · Campus", place: "Fontainebleau, France", start: "2027-01", end: "2027-07", color: G1 },
      { label: "Internship experience", place: "EDGE, France", start: "2027-07", end: "2027-08", color: G2 },
      { label: "Periods 4–5 · Campus", place: "Singapore", start: "2027-09", end: "2027-12", color: G3 },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: G4, text: "#0f4c35" }
    ]
  },
  HEC: {
    start: "2027-01-04",
    label: "HEC Paris MBA · January 2027 intake",
    phases: [
      { label: "MBA · Campus", place: "Jouy-en-Josas, France", start: "2027-01", end: "2027-12", color: G1, note: "phase dates to be confirmed" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: G4, text: "#0f4c35" }
    ]
  },
  IMD: {
    start: "2027-01-07",
    label: "IMD MBA · January 2027 intake",
    phases: [
      { label: "MBA · Campus", place: "Lausanne, Switzerland", start: "2027-01", end: "2027-12", color: G1 },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: G4, text: "#0f4c35" }
    ]
  },
  NYUAD: {
    start: "2027-01-15",
    label: "NYU Stern at NYU Abu Dhabi MBA · January 2027 intake",
    phases: [
      { label: "MBA · Campus", place: "Abu Dhabi", start: "2027-01", end: "2027-12", color: G1 },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: G4, text: "#0f4c35" }
    ]
  },
  CBS: {
    start: "2027-01-11",
    label: "Columbia Business School MBA · January 2027 (J-Term)",
    phases: [
      { label: "MBA · Campus", place: "New York, USA", start: "2027-01", end: "2027-12", color: G1, note: "16-month programme, end date to be confirmed" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: G4, text: "#0f4c35" }
    ]
  }
};

const insead = (extra) => Object.assign({ school: "INSEAD", deposit: { status: "todo", amount: 12000, currency: "EUR", due: "2026-11-22" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } }, extra || {});
const DEPARTURE = {
  "haneen-aljneibi": insead(),
  "mohamed-al-hameli": insead(),
  "theyab-almeqbaali": insead({ internship: "UAE Embassy, Washington DC" }),
  "abdulrahman-almarzooqi": insead(),
  "fatima-balnoub": { school: "IMD", deposit: { status: "done", amount: 10000, currency: "CHF" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } },
  "waleed-almansoori": { school: "IMD", deposit: { status: "todo", amount: 10000, currency: "CHF" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } },
  "saeed-al-sereidi": { school: "NYUAD", deposit: { status: "done", amount: 2000, currency: "USD" }, visa: { status: "na" }, insurance: { status: "na" }, housing: { status: "na" } },
  "mouza-al-zaabi": { school: "NYUAD", deposit: { status: "done", amount: 2000, currency: "USD" }, visa: { status: "na" }, insurance: { status: "na" }, housing: { status: "na" } },
  "mohammed-al-mahri": { school: "NYUAD", deposit: { status: "done", amount: 2000, currency: "USD" }, visa: { status: "na" }, insurance: { status: "na" }, housing: { status: "na" } },
  "khalifa-al-mansoori": { school: "CBS", deposit: { status: "done", amount: 3000, currency: "USD" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } },
  "saoud-alkaabi": { school: "HEC", deposit: { status: "done", amount: 9000, currency: "EUR", due: "2026-11-23" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } },
  "mohamed-al-naqabi": { school: "HEC", deposit: { status: "todo", amount: 9000, currency: "EUR", due: "2026-11-23" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } }
};

/* Do not edit below this line. */
window.DEPARTURE_DATA = { DEPARTURE_META, JOURNEYS, DEPARTURE };
