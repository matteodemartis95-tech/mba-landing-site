/* =====================================================================
   T&LD DASHBOARD V3 — COURSES & PROGRAMMES (V3 only)
   ---------------------------------------------------------------------
   One entry per course / programme run by the T&LD practice.
   - trained: people trained so far (or users activated, see "unit")
   - target:  the target number; leave null while not confirmed (shown as "TBC")
   - unit:    what is counted, e.g. "people trained", "users activated"
   - status:  one short line shown on the box (e.g. next milestone)
   - nextDate: "YYYY-MM-DD" of the next milestone, shown in "Coming up"; "" if none
   Easiest way to update: Edit mode in V3 → Edit on a course → "Copy tld.js",
   then paste over this file on GitHub.
   ===================================================================== */
const COURSES = [
  { id: "media-training",       name: "Media Training",       fullName: "",  trained: 0,   target: null, unit: "people trained",  status: "First training starts 21 Sep 2026", nextDate: "2026-09-21", nextLabel: "First Media Training session", notes: "" },
  { id: "eap",                  name: "EAP",                  fullName: "",  trained: 34,  target: null, unit: "people trained",  status: "", nextDate: "", nextLabel: "", notes: "" },
  { id: "ruwaad",               name: "Ruwaad",               fullName: "",  trained: 325, target: null, unit: "people trained",  status: "", nextDate: "", nextLabel: "", notes: "" },
  { id: "ldp",                  name: "LDP",                  fullName: "Leadership Development Programme", trained: 450, target: null, unit: "people trained", status: "", nextDate: "", nextLabel: "", notes: "" },
  { id: "mbzuai-ai-for-all",    name: "MBZUAI AI for All",    fullName: "",  trained: 231, target: null, unit: "users activated", status: "", nextDate: "", nextLabel: "", notes: "" },
  { id: "functional-capability",name: "Functional Capability",fullName: "",  trained: 30,  target: null, unit: "people trained",  status: "", nextDate: "", nextLabel: "", notes: "" }
];

/* Do not edit below this line. */
window.TLD_DATA = { COURSES };
