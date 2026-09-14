/* =====================================================================
   T&LD DASHBOARD V3 — COURSES & PROGRAMMES (V3 only)
   ---------------------------------------------------------------------
   One entry per course / programme run by the T&LD practice.
   - category: boxes are grouped by category on the T&LD page (e.g. "Development programmes", "Baseline competency programmes")
   - docs: links shown top-right of the PMO page, e.g. [{ label: "Curriculum", url: "https://..." }] (a link without url is hidden)
   - budget / steps / vendors / ownership: optional PMO sections (see the HR Capability Development Programme)
   - color: the programme colour used on its box, bar, page and calendar entries (hex, e.g. "#2a78d6")
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
   - subProgrammes: for a partnership box with several programmes (e.g. MBZUAI): each has its own
     name, trained, completed (optional), target, unit, description, kpis and milestones [{ label, date }]
   Easiest way to update: Edit mode in V3 → Edit on a course → "Copy tld.js",
   then paste over this file on GitHub.
   ===================================================================== */
const COURSES = [
  {
    "id": "media-training",
    "name": "Media Training",
    "fullName": "Media training programme for MOD leaders",
    "color": "#2a78d6",
    "trained": 0,
    "target": 100,
    "unit": "people trained",
    "status": "",
    "nextDate": "2026-09-21",
    "nextLabel": "First cohort · 23 participants",
    "notes": "",
    "targetPeriod": "per year",
    "description": "Media training for MOD leaders, requested by H.E. the MDA to build a proactive approach to media awareness. Expert-led masterclasses with applied practice, delivered in Arabic with IMI Media Academy at the National Defence College.",
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
        "note": "18 from MOD and 5 from NDC · Colonel level and above · National Defence College and IMI Media",
        "status": "planned"
      }
    ],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": [],
    "category": "Development programmes",
    "docs": [
      {
        "label": "Media Training curriculum",
        "url": ""
      }
    ]
  },
  {
    "id": "eap",
    "name": "EAP",
    "fullName": "Enterprise Accelerator Programme",
    "color": "#eb6834",
    "trained": 34,
    "target": 60,
    "unit": "participants",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "Capability-building programme strengthening core enterprise skills across MoD teams, from problem solving to stakeholder management and executive communication. Two streams, mid-level and senior leader, each delivered through two one-week bootcamps with on-the-job application in between, closing with a graduation in mid-November.",
    "audience": "Mid-level and senior leaders across MoD teams; 15 participants per cohort, two cohorts per stream.",
    "programmeFormat": "Two 1-week bootcamps per stream, on-the-job application in between",
    "targetPeriod": "",
    "objectives": [],
    "modules": [
      {
        "title": "Mid-level stream",
        "summary": "Foundational enterprise skills applied directly to participants' day-to-day work"
      },
      {
        "title": "Senior leader stream",
        "summary": "Same approaches and frameworks along a more advanced track: role-modelling consistency, guiding team members, decision-making and leadership application"
      }
    ],
    "cohorts": [
      {
        "label": "Mid-level cohort 1 · Bootcamp 1",
        "start": "2026-08-31",
        "end": "2026-09-04",
        "participants": 14,
        "status": "completed",
        "note": "14 of 15 attended (93%)"
      },
      {
        "label": "Senior cohort 1 · Bootcamp 1",
        "start": "2026-09-07",
        "end": "2026-09-11",
        "participants": 8,
        "status": "completed",
        "note": "8 of 15 attended (53%)"
      },
      {
        "label": "Mid-level cohort 2 · Bootcamp 1",
        "start": "2026-09-14",
        "end": "2026-09-18",
        "participants": 12,
        "status": "running",
        "note": "12 of 15 (80%) · additional participants to be confirmed"
      },
      {
        "label": "Senior cohort 2 · Bootcamp 1",
        "start": "2026-09-21",
        "end": "2026-09-25",
        "participants": null,
        "status": "planned",
        "note": "Participants to be confirmed"
      },
      {
        "label": "Mid-level cohort 1 · Bootcamp 2",
        "start": "2026-10-05",
        "end": "2026-10-09",
        "participants": null,
        "status": "planned",
        "note": ""
      },
      {
        "label": "Senior cohort 1 · Bootcamp 2",
        "start": "2026-10-12",
        "end": "2026-10-16",
        "participants": null,
        "status": "planned",
        "note": ""
      },
      {
        "label": "Mid-level cohort 2 · Bootcamp 2",
        "start": "2026-10-26",
        "end": "2026-10-30",
        "participants": null,
        "status": "planned",
        "note": ""
      },
      {
        "label": "Senior cohort 2 · Bootcamp 2",
        "start": "2026-11-02",
        "end": "2026-11-06",
        "participants": null,
        "status": "planned",
        "note": ""
      },
      {
        "label": "Celebration and graduation",
        "start": "2026-11-16",
        "end": "",
        "participants": null,
        "status": "planned",
        "note": "Mid-November, exact date to be confirmed"
      }
    ],
    "cohortsDone": 0,
    "cohortsTotal": 4,
    "kpis": [
      {
        "label": "Cohorts started",
        "value": "3 of 4"
      },
      {
        "label": "Mid-level cohort 1",
        "value": "14 / 15 (93%)"
      },
      {
        "label": "Mid-level cohort 2",
        "value": "12 / 15 (80%)"
      },
      {
        "label": "Senior cohort 1",
        "value": "8 / 15 (53%)"
      }
    ],
    "category": "Development programmes"
  },
  {
    "id": "ruwaad",
    "name": "Ruwaad",
    "fullName": "Change management and institutional transformation programme",
    "color": "#1baf7a",
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
    ],
    "category": "Development programmes"
  },
  {
    "id": "ldp",
    "name": "LDP",
    "fullName": "Leadership Development Programme · Leadership Bootcamp with HNI",
    "color": "#4a3aa7",
    "trained": 450,
    "target": 1000,
    "unit": "people trained",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "Arabic-delivered Leadership Bootcamp, run with HNI, to accelerate leadership readiness across the MOD workforce by building both self-leadership and people-leadership capabilities. Each cohort follows a 4.5-day face-to-face journey: Leading Self (2 days), Leading Others (2 days) and a half-day integration and reflection session, delivered by certified Arabic-speaking facilitators through simulations, role-plays and reflection circles.",
    "audience": "MOD employees",
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
    ],
    "category": "Development programmes"
  },
  {
    "id": "mbzuai",
    "name": "MBZUAI",
    "fullName": "Mohamed bin Zayed University of Artificial Intelligence · partnership",
    "color": "#e87ba4",
    "trained": 237,
    "target": null,
    "unit": "participants across both programmes",
    "status": "",
    "nextDate": "",
    "nextLabel": "",
    "notes": "",
    "description": "Two programmes delivered with MBZUAI: the online AI for All course, rolled out at scale across the Executive Office, and the Global AI Leadership Programme, an executive programme completed by six Executive Office leaders.",
    "audience": "",
    "programmeFormat": "",
    "targetPeriod": "",
    "objectives": [],
    "modules": [],
    "cohorts": [],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": [],
    "subProgrammes": [
      {
        "id": "ai-for-all",
        "name": "AI for All",
        "format": "Online, self-paced",
        "trained": 231,
        "target": null,
        "unit": "active users",
        "description": "Online course on the MBZUAI learning platform: four modules and about six learning hours of video lectures, interactive materials, activities and module-based assessments. Each user has two months of access from activation.",
        "kpis": [
          {
            "label": "Licences ordered",
            "value": "125 (order of 12 May 2026)"
          }
        ],
        "milestones": [
          {
            "label": "Subscription effective",
            "date": "2026-05-12"
          },
          {
            "label": "Access window closes (order of 12 May)",
            "date": "2026-07-12"
          }
        ],
        "completed": 82
      },
      {
        "id": "gailp",
        "name": "Global AI Leadership Programme",
        "format": "5-day executive programme at MBZUAI",
        "trained": 6,
        "target": null,
        "unit": "leaders completed",
        "description": "Five-day executive programme at the MBZUAI Academy in Abu Dhabi blending AI strategy, ethics and hands-on practice: sessions with AI scientists, site visits and workshops, and practical frameworks to drive AI initiatives and inspire teams. Aimed at C-level executives, government leaders and advisors; no technical background required, delivered in English.",
        "kpis": [
          {
            "label": "Executive Office participants",
            "value": "6 completed"
          },
          {
            "label": "Fee",
            "value": "AED 45,000 per participant, incl. VAT"
          },
          {
            "label": "Admissions",
            "value": "Rolling; apply at least six weeks before the start"
          }
        ],
        "milestones": [
          {
            "label": "Next edition (5–9 April 2027)",
            "date": "2027-04-05"
          }
        ]
      }
    ],
    "category": "Development programmes"
  },
  {
    "id": "hr-capability",
    "name": "HR Capability Development Programme",
    "fullName": "Baseline competency · HR",
    "color": "#eda100",
    "category": "Baseline competency programmes",
    "trained": 0,
    "target": 160,
    "targetPeriod": "",
    "unit": "HR personnel assessed or trained",
    "status": "Vendor selection pending approval",
    "programmeFormat": "~6-month programme",
    "description": "Assess the technical HR capability of 130 HR personnel across 11 domains, from workforce planning to HR analytics, and close the gaps through a pilot training for 30 FTEs.",
    "audience": "130 HR personnel for the assessment; 30 FTEs for the pilot training.",
    "objectives": [],
    "modules": [],
    "cohorts": [],
    "cohortsDone": null,
    "cohortsTotal": null,
    "kpis": [],
    "budget": [
      {
        "label": "Assessment of 130 FTEs",
        "amount": "AED 1.8 Mn"
      },
      {
        "label": "Training of 30 FTEs",
        "amount": "AED 3.5 Mn"
      },
      {
        "label": "Total",
        "amount": "AED 5.3 Mn",
        "total": true
      }
    ],
    "steps": [
      {
        "label": "Identify need & scope of work",
        "status": "done"
      },
      {
        "label": "Launch request for proposal",
        "status": "done"
      },
      {
        "label": "Evaluate & select vendor",
        "status": "current",
        "note": "Selection pending approval"
      },
      {
        "label": "Mobilise and start",
        "status": "pending"
      }
    ],
    "vendors": {
      "issued": [
        "Aon",
        "Mercer",
        "Deloitte",
        "CIPD",
        "Korn Ferry",
        "EY",
        "KPMG",
        "PwC"
      ],
      "received": [
        "Aon",
        "Mercer",
        "Deloitte",
        "Korn Ferry",
        "EY"
      ],
      "note": "Selection pending approval"
    },
    "ownership": [
      {
        "owner": "MOD",
        "item": "Programme ownership"
      },
      {
        "owner": "MOD",
        "item": "Funding"
      },
      {
        "owner": "Executive Office",
        "item": "Procurement & contracting"
      },
      {
        "owner": "Vendor awarded",
        "item": "Programme delivery"
      },
      {
        "owner": "Executive Office + MOD",
        "item": "Performance oversight"
      }
    ],
    "nextDate": "",
    "nextLabel": "",
    "notes": ""
  }
];

/* Do not edit below this line. */
window.TLD_DATA = { COURSES };
