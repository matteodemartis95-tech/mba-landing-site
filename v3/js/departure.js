/* Pre-departure tracking for the Jahizoun / EDGE candidates going to an MBA (V3 only).
   DEPARTURE_META: exchange rates to AED (edit the rate and date by hand), the four checklist items, the onboarding note.
   JOURNEYS: programme phases per school. DEPARTURE[candidate id]: school, deposit and the status of each item.
   Statuses: done · progress · todo · na. */

const DEPARTURE_META = {
  rates: { EUR: 4.25, CHF: 4.60, USD: 3.6725 },
  ratesDate: "2026-11-04",
  items: [
    { key: "deposit", label: "Deposit", owner: "T&LD / Finance" },
    { key: "visa", label: "Visa", owner: "Candidate · T&LD" },
    { key: "insurance", label: "Health insurance", owner: "T&LD" },
    { key: "housing", label: "Housing", owner: "Military attachés" }
  ],
  onboarding: "Pre-departure onboarding will be delivered in a single day by MOD Education and Training.",
  statuses: { done: "Done", progress: "In progress", todo: "To launch", na: "Not required" }
};

const JOURNEYS = {
  INSEAD: {
    label: "INSEAD MBA · January 2027 intake",
    phases: [
      { label: "Periods 1–3", place: "Fontainebleau, France", start: "2027-01", end: "2027-06", color: "#1b1810" },
      { label: "Summer internship", place: "EDGE, France", start: "2027-07", end: "2027-08", color: "#eb6834" },
      { label: "Periods 4–5", place: "Singapore", start: "2027-09", end: "2027-12", color: "#887952" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: "#1baf7a" }
    ]
  },
  HEC: {
    label: "HEC Paris MBA · January 2027 intake",
    phases: [
      { label: "MBA", place: "Jouy-en-Josas, France", start: "2027-01", end: "2027-12", color: "#1b1810", note: "phase dates to be confirmed" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: "#1baf7a" }
    ]
  },
  IMD: {
    label: "IMD MBA · January 2027 intake",
    phases: [
      { label: "MBA", place: "Lausanne, Switzerland", start: "2027-01", end: "2027-12", color: "#1b1810" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: "#1baf7a" }
    ]
  },
  NYUAD: {
    label: "NYU Stern at NYU Abu Dhabi MBA · January 2027 intake",
    phases: [
      { label: "MBA", place: "Abu Dhabi", start: "2027-01", end: "2027-12", color: "#1b1810" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: "#1baf7a" }
    ]
  },
  CBS: {
    label: "Columbia Business School MBA · January 2027 (J-Term)",
    phases: [
      { label: "MBA", place: "New York, USA", start: "2027-01", end: "2027-12", color: "#1b1810", note: "16-month programme, end date to be confirmed" },
      { label: "Return", place: "EO Secondment, Abu Dhabi", start: "2028-01", end: "", color: "#1baf7a" }
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
  "saoud-alkaabi": { school: "HEC", deposit: { status: "done", amount: 9000, currency: "EUR" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } },
  "mohamed-al-naqabi": { school: "HEC", deposit: { status: "todo", amount: 9000, currency: "EUR" }, visa: { status: "todo" }, insurance: { status: "todo" }, housing: { status: "todo" } }
};

/* Do not edit below this line. */
window.DEPARTURE_DATA = { DEPARTURE_META, JOURNEYS, DEPARTURE };
