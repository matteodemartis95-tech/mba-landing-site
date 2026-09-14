/* =====================================================================
   T&LD DASHBOARD V3 — COURSES & PROGRAMMES (V3 only)
   ---------------------------------------------------------------------
   One entry per course / programme run by the T&LD practice.
   - trained: people trained so far (or users activated, see "unit")
   - target:  the target number; leave null while not confirmed (shown as "TBC")
   - unit:    what is counted, e.g. "people trained", "users activated"
   - status:  one short line shown on the box (e.g. next milestone)
   - nextDate: "YYYY-MM-DD" of the next milestone, shown in "Coming up"; "" if none
   - targetPeriod: e.g. "per year" (shown next to the target)
   - description / audience / objectives / modules: the quick description on the PMO page
   - cohorts: [{ label, start "YYYY-MM-DD", end, participants, note, status: "planned" | "running" | "completed" }]
   - cohortsDone / cohortsTotal: cohorts delivered so far / planned in total (optional)
   - kpis: extra figures shown on the PMO page, e.g. [{ label: "Attendance rate", value: "39%" }]
   Easiest way to update: Edit mode in V3 → Edit on a course → "Copy tld.js",
   then paste over this file on GitHub.
   ===================================================================== */
const COURSES = [
  {
    "id": "media-training",
    "name": "Media Training",
    "fullName": "Media training programme for MOD leaders",
    "trained": 0,
    "target": 100,
    "unit": "people trained",
    "status": "First cohort starts 21 Sep 2026",
    "nextDate": "2026-09-21",
    "nextLabel": "First cohort · 23 participants",
    "notes": "",
    "targetPeriod": "per year",
    "description": "Requested by H.E. the MDA to enhance media awareness with a more proactive approach, drawing on lessons learned from recent events. A regular cadence of media training for MOD leaders: expert-led masterclasses with applied practice, delivered by Arabic-speaking experts with an established media partner (IMI Media Academy). The first cohort is delivered in September at the National Defence College and IMI Media.",
    "audience": "Cohorts of 20–25 MOD senior officers: Heads of Functions / Authority and senior military and civilian personnel at Brigadier and Colonel level.",
    "objectives": [
      "Strengthen understanding of clarity and message discipline",
      "Demonstrate confidence and control in interviews, panels and press briefings",
      "Build confidence in communicating in high-pressure media situations",
      "Understand how to navigate and engage local, regional and global media"
    ],
    "modules": [
      {
        "title": "Media Foundation & Confidence",
        "summary": "Understand the modern media landscape and build executive presence with media"
      },
      {
        "title": "Strategic Messaging & Soft Power",
        "summary": "Frame communication as an instrument of soft power; clear, consistent messages across audiences"
      },
      {
        "title": "UAE National Narrative",
        "summary": "Embed national priorities in institutional messaging and communicate the national narrative with clarity"
      },
      {
        "title": "Crisis Communication",
        "summary": "Maintain message discipline under pressure; manage hostile questions and high-stakes scenarios"
      },
      {
        "title": "Capstone Assessment",
        "summary": "Television interview simulation, individual assessment and development recommendations"
      }
    ],
    "programmeFormat": "Progressive five-day programme",
    "cohorts": [
      {
        "label": "Cohort 1",
        "start": "2026-09-21",
        "end": "",
        "participants": 23,
        "note": "Colonel level and above · 18 MOD, 5 NDC · National Defence College and IMI Media",
        "status": "planned"
      }
    ],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": []
  },
  {
    "id": "eap",
    "name": "EAP",
    "fullName": "",
    "trained": 34,
    "target": null,
    "unit": "people trained",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "",
    "audience": "",
    "programmeFormat": "",
    "targetPeriod": "",
    "objectives": [],
    "modules": [],
    "cohorts": [],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": []
  },
  {
    "id": "ruwaad",
    "name": "Ruwaad",
    "fullName": "Change management and institutional transformation programme",
    "trained": 325,
    "target": 840,
    "unit": "people trained",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "Cohort size reduced from 50 to 30 participants; target adjusted to 840.",
    "description": "Programme building incremental change management and institutional transformation.",
    "audience": "",
    "programmeFormat": "Two-day cohorts",
    "targetPeriod": "",
    "objectives": [],
    "modules": [],
    "cohorts": [
      {
        "label": "Cohort 5 (April cohort)",
        "start": "2026-10-19",
        "end": "2026-10-20",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 6 (April cohort)",
        "start": "2026-10-21",
        "end": "2026-10-22",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 15",
        "start": "2026-10-26",
        "end": "2026-10-27",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 16",
        "start": "2026-10-28",
        "end": "2026-10-29",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 17",
        "start": "2026-11-23",
        "end": "2026-11-24",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 18",
        "start": "2026-11-25",
        "end": "2026-11-26",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 19",
        "start": "2026-12-07",
        "end": "2026-12-08",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      },
      {
        "label": "Cohort 20",
        "start": "2026-12-09",
        "end": "2026-12-10",
        "participants": null,
        "status": "planned",
        "note": "Multi-purpose Rooms 1&2"
      }
    ],
    "cohortsDone": 12,
    "cohortsTotal": 20,
    "kpis": [
      {
        "label": "Attendance rate",
        "value": "39%"
      },
      {
        "label": "Satisfaction",
        "value": "93%"
      }
    ]
  },
  {
    "id": "ldp",
    "name": "LDP",
    "fullName": "Leadership Development Programme · Leadership Bootcamp with HNI",
    "trained": 450,
    "target": 1000,
    "unit": "people trained",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "Arabic-delivered Leadership Bootcamp, run with HNI, to accelerate leadership readiness across the MOD workforce by building both self-leadership and people-leadership capabilities. Each cohort follows a 4.5-day face-to-face journey: Leading Self (2 days), Leading Others (2 days) and a half-day integration and reflection session, delivered by certified Arabic-speaking facilitators through simulations, role-plays and reflection circles.",
    "audience": "MOD employees across the organisation; 1,000 participants in rotating cohorts.",
    "programmeFormat": "4.5-day cohorts, Monday to Friday",
    "targetPeriod": "",
    "objectives": [],
    "modules": [
      {
        "title": "Leading Self",
        "summary": "Self-leadership, ownership and growth mindset; self-awareness (Personal SWOT); communication with clarity, confidence and presence (2 days)"
      },
      {
        "title": "Leading Others",
        "summary": "Team dynamics and performance stages; constructive feedback (CEDAR); team goals aligned with the MOD mission; trust, accountability and conflict resolution (2 days)"
      },
      {
        "title": "Integration & Reflection",
        "summary": "Experiential group activities connecting both modules to real workplace scenarios; leadership commitments and improvement plans (half day)"
      }
    ],
    "cohorts": [
      {
        "label": "Cohort 21",
        "start": "2026-09-14",
        "end": "2026-09-18",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC) · dates to be confirmed"
      },
      {
        "label": "Cohort 22",
        "start": "2026-09-21",
        "end": "2026-09-25",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Cohort 23",
        "start": "2026-09-21",
        "end": "2026-09-25",
        "participants": null,
        "status": "planned",
        "note": "MOD Dubai"
      },
      {
        "label": "Cohort 25",
        "start": "2026-10-05",
        "end": "2026-10-09",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Cohort 26",
        "start": "2026-10-12",
        "end": "2026-10-16",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC) · dates to be confirmed"
      },
      {
        "label": "Cohort 27",
        "start": "2026-10-19",
        "end": "2026-10-23",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Cohort 28",
        "start": "2026-11-02",
        "end": "2026-11-06",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Cohort 29",
        "start": "2026-11-09",
        "end": "2026-11-13",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Dubai cohort",
        "start": "2026-11-09",
        "end": "2026-11-13",
        "participants": null,
        "status": "planned",
        "note": "MOD Dubai"
      },
      {
        "label": "Cohort 30",
        "start": "2026-11-16",
        "end": "2026-11-20",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC) · dates to be confirmed"
      },
      {
        "label": "Cohort 31",
        "start": "2026-12-14",
        "end": "2026-12-18",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC) · dates to be confirmed"
      },
      {
        "label": "Cohort 32",
        "start": "2026-12-21",
        "end": "2026-12-25",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      },
      {
        "label": "Cohort 33",
        "start": "2027-01-18",
        "end": "2027-01-22",
        "participants": null,
        "status": "planned",
        "note": "National Defence College (NDC)"
      }
    ],
    "cohortsDone": 20,
    "cohortsTotal": 33,
    "kpis": [
      {
        "label": "Attendance rate",
        "value": "75%"
      }
    ]
  },
  {
    "id": "mbzuai-ai-for-all",
    "name": "MBZUAI AI for All",
    "fullName": "",
    "trained": 231,
    "target": null,
    "unit": "users activated",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "",
    "audience": "",
    "programmeFormat": "",
    "targetPeriod": "",
    "objectives": [],
    "modules": [],
    "cohorts": [],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": []
  },
  {
    "id": "functional-capability",
    "name": "Functional Capability",
    "fullName": "",
    "trained": 30,
    "target": null,
    "unit": "people trained",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "",
    "audience": "",
    "programmeFormat": "",
    "targetPeriod": "",
    "objectives": [],
    "modules": [],
    "cohorts": [],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": []
  }
];

/* Do not edit below this line. */
window.TLD_DATA = { COURSES };
