/* =====================================================================
   JAHIZOUN MBA TRACKER V2 — EVALUATION DATA (V2 only)
   ---------------------------------------------------------------------
   Source: Jahizoun Profile Cards deck (T&LD, August 2026).
   The MBA data stays in the shared ../js/data.js. This file adds, for V2 only:
   - EXTRA_CANDIDATES: people who are in the profile cards but not in the MBA tracker
   - NAME_OVERRIDES: names spelled as in the deck (V2 display only)
   - EVALUATIONS: professional snapshot, competency ratings per quarter, timeline
     phases and the commentary, keyed by candidate id.
   Easiest way to update: Edit mode in V2 → "Edit evaluation" → "Copy evaluation.js",
   then paste over this file on GitHub.
   Ratings: "strong", "effective", "developing", "na" (not assessed). Quarters "YYYY Qn".
   ===================================================================== */
const EVAL_META = {
  competencies: ["Effective Communication & Influence", "Initiative", "Decision-Making & Accountability", "Capability Development", "Systemic Analysis & Planning"],
  quarters: ["2025 Q4", "2026 Q1", "2026 Q2", "2026 Q3", "2026 Q4", "2027 Q1", "2027 Q2", "2027 Q3", "2027 Q4", "2028 Q1", "2028 Q2", "2028 Q3", "2028 Q4"],
  ratings: { strong: "Strong", effective: "Effective", developing: "Developing", na: "Not assessed" },
  phases: ["Corporate Exchange", "EO Secondment", "MBA"],
  commentaryTitle: "Commentary as of 1st Quarterly Evaluation",
  commentaryDate: "August 2026",
  /* Quarterly evaluation cycle (every 3 months). status: "completed" or "planned". */
  quarterlyEvaluations: [
    { label: "1st", date: "2026-08-31", status: "completed" },
    { label: "2nd", date: "2026-09-30", status: "planned" },
    { label: "3rd", date: "2026-12-31", status: "planned" },
    { label: "4th", date: "2027-03-31", status: "planned" },
    { label: "5th", date: "2027-06-30", status: "planned" },
    { label: "6th", date: "2027-09-30", status: "planned" },
    { label: "7th", date: "2027-12-31", status: "planned" },
    { label: "8th", date: "2028-03-31", status: "planned" },
    { label: "9th", date: "2028-06-30", status: "planned" }
  ]
};

const EXTRA_CANDIDATES = [
  {
    "id": "surour-al-kaabi",
    "name": "Surour Al Kaabi",
    "programme": "Jahizoun",
    "team": "Al-Emad",
    "photo": "",
    "intake": "",
    "test": "GMAT 675",
    "mbaPlanned": false,
    "notes": "No MBA planned at the moment.",
    "applications": []
  },
  {
    "id": "waood-alhammadi",
    "name": "Waood Yosuf Alhammadi",
    "programme": "Jahizoun",
    "team": "T&LD",
    "photo": "",
    "intake": "",
    "test": "",
    "mbaPlanned": false,
    "notes": "No MBA planned at the moment.",
    "applications": []
  },
  {
    "id": "buti-al-suwaidi",
    "name": "Buti Al Suwaidi",
    "programme": "Jahizoun",
    "team": "Human Resources",
    "photo": "",
    "intake": "",
    "test": "",
    "mbaPlanned": false,
    "notes": "No MBA planned at the moment.",
    "applications": []
  },
  {
    "id": "abdulaziz-al-yafei",
    "name": "Abdulaziz Al Yafei",
    "programme": "Jahizoun",
    "team": "Digital & AI",
    "photo": "",
    "intake": "January 2027",
    "test": "",
    "mbaPlanned": true,
    "notes": "",
    "applications": [
      {
        "school": "HEC",
        "status": "applying",
        "interview": {
          "date": "",
          "note": ""
        },
        "notes": ""
      },
      {
        "school": "IMD",
        "status": "applying",
        "interview": {
          "date": "",
          "note": ""
        },
        "notes": ""
      }
    ]
  }
];

const NAME_OVERRIDES = {
  "theyab-almeqbaali": "Theyab Al Meqbaali",
  "khaled-alteneiji": "Khaled Al Teniji",
  "khalifa-al-mansoori": "Khalifa Al Mansoori",
  "mohamed-al-hameli": "Mohamed Al Hameli",
  "haneen-aljneibi": "Haneen Aljneibi",
  "mohamed-al-naqabi": "Mohamed Al Naqbi",
  "mohammed-al-mahri": "Mohamed Al Mahri",
  "fatima-balnoub": "Fatima Balnoub",
  "saif-al-hammadi": "Saif Al Hammadi",
  "saoud-alkaabi": "Saoud Al Kaabi",
  "saeed-al-sereidi": "Saeed Al Sereidi"
};

const EVALUATIONS = {
  "surour-al-kaabi": {
    "lineManager": "Shobit Pareek",
    "function": "Al-Emad",
    "corporateExchangeProject": "National IP Strategy",
    "previousFunction": "IT & Telecom inside Presidential Guard",
    "academicQualifications": "Masters in Engineering Management",
    "reportFirm": "",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "EO Secondment",
      "2027 Q2": "EO Secondment",
      "2027 Q3": "EO Secondment"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "strong"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Takes proactive end-to-end ownership across workstreams",
      "Applies Domain expertise effectively, drawing usage of AI tools and expert network",
      "Communicates with clarity and credibility, building strong stakeholder relationships"
    ],
    "improvements": [
      "Improves the structure with clear key messages and “so-what”, then build the storyline top-down",
      "Sharpens written deliverables and slide visuals"
    ],
    "masters": [
      "Weights a Masters in AI/ Technology against an MBA",
      "Applying to INSEAD and SDA Bocconi MBA, September 2027"
    ]
  },
  "waood-alhammadi": {
    "lineManager": "Declan Noone",
    "function": "T&LD",
    "corporateExchangeProject": "National Academy",
    "previousFunction": "National Service & Reserve Staff (GHQ)",
    "academicQualifications": "Masters in Leadership",
    "reportFirm": "",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "EO Secondment",
      "2027 Q2": "EO Secondment",
      "2027 Q3": "EO Secondment"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Communicates effectively, combining deep MOD knowledge with a clear drive to improve how things are done",
      "Learns fast, once she understand the rationale she rarely repets mistakes"
    ],
    "improvements": [
      "Builds confidence in independent decision-making, not just validation-seeking",
      "Deepens systemic analysis and planning",
      "Improves ownership and drive initiative that are a value add to the team"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Weights weather to pursue an MBA in January 2028",
      "Applying to NYU MBA, January 2028"
    ]
  },
  "theyab-almeqbaali": {
    "lineManager": "Naguib Bebawi",
    "function": "Defense Policy",
    "corporateExchangeProject": "UAE Financial Industry Regulatory Entity",
    "previousFunction": "Analysis Staff Officer",
    "academicQualifications": "Masters in Intelligence Analysis",
    "reportFirm": "",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Communicates with confidence and clarity and valued as empathetic by client and team",
      "Spots gaps and acts on them without prompting, using his MOD knowledge to navigate internal processes",
      "Pursues qualification on his own initiative"
    ],
    "improvements": [
      "Plans work, identify dependencies, and deliver reliably against agreed deadlines",
      "Formulates and defends his own hypotheses, rather than stopping at research and summary"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to INSEAD and IMD MBA, January 2027"
    ]
  },
  "khaled-alteneiji": {
    "lineManager": "Rania Roston",
    "function": "Strategic Communications",
    "corporateExchangeProject": "UAE Financial Industry Regulatory Entity",
    "previousFunction": "Head of Monitoring & Control of MOD Network",
    "academicQualifications": "Bachelor's in Information technology",
    "reportFirm": "Kearney",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Builds trusted relationships across MOD stakeholders, balancing candor with diplomacy",
      "Takes initiative leading branch coordination unprompted",
      "Learns fast, embracing Communications from an IT background"
    ],
    "improvements": [
      "Builds structured, forward-looking planning",
      "Shifts from reactive reporting to proactive planning"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to INSEAD MBA, January 2027"
    ]
  },
  "buti-al-suwaidi": {
    "lineManager": "Aleksandra Socevic",
    "function": "Human Resources",
    "corporateExchangeProject": "Organizational Design (OD) Support",
    "previousFunction": "Human Resources Officer",
    "academicQualifications": "Bachelor of Science in Information Systems",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Builds trusted relationships across MOD stakeholders",
      "Sustains positive attitude and energy even through tight timelines"
    ],
    "improvements": [
      "Carries initiatives through from proposal to execution and delivery",
      "Breaks work into clear steps",
      "Improves key messages for senior stakeholders and check before deliver outputs"
    ],
    "masters": [
      "Not planning to attend any Masters/ MBA"
    ]
  },
  "khalifa-al-mansoori": {
    "lineManager": "Gregor Lisjak",
    "function": "Al-Emad",
    "corporateExchangeProject": "Multiple engagements",
    "previousFunction": "Presidential Guard",
    "academicQualifications": "Diploma in Military Science",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "na",
        "2026 Q1": "na",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Engages confidently in client meetings and present his work clearly to senior counterparts",
      "Checks in on his own progress without always being prompted"
    ],
    "improvements": [
      "Accelerates delivery pace to avoid slowing workstream turnaround",
      "Improves the upfront planning of assignments",
      "Strengthens working relationship with the team"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to HEC and IMD MBA, January 2027"
    ]
  },
  "mohamed-al-hameli": {
    "lineManager": "Elvie Lahournere",
    "function": "Strategic Management",
    "corporateExchangeProject": "DGE Survey Management",
    "previousFunction": "Captain in Leadership & Strategic Operations",
    "academicQualifications": "Masters in International Business Law",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Leads initiative end-to-end such as the Procurement Playbook",
      "Seeks involvement beyond his assigned brief, attending expert session and pursuing further qualifications on his own initiative",
      "Contributes substantively on meetings and presents with confidence"
    ],
    "improvements": [
      "Maps the full picture and improve second-order effects before acting",
      "Improves attention to detail on deliverable"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to INSEAD MBA, January 2027"
    ]
  },
  "haneen-aljneibi": {
    "lineManager": "Rania Rostom",
    "function": "Strategic Communications",
    "corporateExchangeProject": "DGE Survey Management",
    "previousFunction": "Information Security Engineer",
    "academicQualifications": "Bach. in Security Technology Engineering",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Owns work with drive, proactively thinking through risks",
      "Learns fast, immersed herself in Communications despite coming from an IT background",
      "Confident, composed communication, navigating stakeholder discussions well"
    ],
    "improvements": [
      "Builds independent decision-making as her functional understanding deepens",
      "Strengthens planning and systemic analysis skills in the new Communications space"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to INSEAD MBA, January 2027"
    ]
  },
  "mohamed-al-naqabi": {
    "lineManager": "Saif Alsiksek",
    "function": "Digital & AI",
    "corporateExchangeProject": "Compliance Level – Sorbonne",
    "previousFunction": "Military",
    "academicQualifications": "Bachelors in Emergency Management",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Upskills proactively and applies new knowledge directly to his work",
      "Delivers steady, dependable performance across communication, decision-making, and analysis",
      "Speaks openly about his capacity constraints and takes ownership of outcomes without deflecting"
    ],
    "improvements": [
      "Rebuilds proactive, unprompted ownership once bandwidth frees up",
      "Improves slide materials with stronger formatting"
    ],
    "masters": [
      "Completed ScorePlus and GuideMe GMAT course",
      "Applying to HEC Paris and IMD MBA, January 2027"
    ]
  },
  "abdulaziz-al-yafei": {
    "lineManager": "Saif Al Siksek",
    "function": "Digital & AI",
    "corporateExchangeProject": "Work Transformation & HR",
    "previousFunction": "Head of National Service Recruitment",
    "academicQualifications": "Bachelors in Financial Management",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "strong"
      },
      "Initiative": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "effective"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "effective"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "strong"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Adapts his style to different audiences, and builds strong stakeholder relations",
      "Upskills proactively and applies new tools, such as AI, to improve the quality of his output",
      "Maintains a positive attitude and works easily across teams and clients"
    ],
    "improvements": [
      "Structures problems and initiatives more clearly",
      "Tends to be not very proactive and wait for directions"
    ],
    "masters": [
      "Completed ScorePlus and GuideMe GMAT course",
      "Applying to HEC and IMD MBA, January 2027"
    ]
  },
  "mohammed-al-mahri": {
    "lineManager": "Elvie Lahournere",
    "function": "Optimization",
    "corporateExchangeProject": "Inst. Transformation of Social Sector",
    "previousFunction": "Officer in Army",
    "academicQualifications": "Bachelor's in Electronic Engineering, HCT",
    "reportFirm": "PwC",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Initiative": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "developing"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Capability Development": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Considers risks before taking decisions and takes accountability for outcomes",
      "Seeks feedback proactively and applies it well",
      "Delivers assigned tasks reliably, with steady and consistent execution"
    ],
    "improvements": [
      "Drives work proactively rather than waiting on direction",
      "Improves end-to-end of deliverables"
    ],
    "masters": [
      "Completed ScorePlus and GuideMe GMAT course",
      "Applying to NYU Abu Dhabi January 2027"
    ]
  },
  "fatima-balnoub": {
    "lineManager": "Declan Noone",
    "function": "T&LD",
    "corporateExchangeProject": "Multiple engagements",
    "previousFunction": "National Defence College",
    "academicQualifications": "Diploma in Military Science",
    "reportFirm": "Oliver Wyman",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "na",
        "2026 Q1": "na",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Takes full ownership of the LDP project and proactively engaged stakeholders to drive delivery",
      "Demonstrates strong emotional intelligence and openness to feedback",
      "Builds genuine client trust across projects"
    ],
    "improvements": [
      "Develops Systemic Analysis & Planning as the key growth area for seeing the full picture",
      "Strengthens attention to detail on deliverable"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to IMD and HEC MBA, January 2027"
    ]
  },
  "saif-al-hammadi": {
    "lineManager": "Juhina Elmajdoub",
    "function": "Al-Emad",
    "corporateExchangeProject": "Khutwa Program",
    "previousFunction": "Trainee",
    "academicQualifications": "Bachelor's in Electrical Engineering",
    "reportFirm": "Oliver Wyman",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "developing"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "developing"
      }
    },
    "strengths": [
      "Well structured written communication",
      "Integrates seamlessly into the team, establishing himself as dependable",
      "Learns with agility and receives feedback openly"
    ],
    "improvements": [
      "Builds proactive communication, share updates and raise blockers without waiting to be asked",
      "Takes full end to end ownership of deliverables, including self review before submission"
    ],
    "masters": [
      "Completed ScorePlus and GuideME GMAT course",
      "Applying to HEC and NYU Abu Dhabi MBA, January 2027"
    ]
  },
  "saoud-alkaabi": {
    "lineManager": "Ansh Karha",
    "function": "Al-Emad",
    "corporateExchangeProject": "Digital Ai Strategy & Transformation",
    "previousFunction": "Presidential Guard",
    "academicQualifications": "Military Diploma in Leadership & Conflict",
    "reportFirm": "Oliver Wyman",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Initiative": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Communicates and listen well in discussions and collaborates effectively",
      "Transfers institutional knowledge to the team",
      "Adapts quickly to unfamiliar ways of working, progressing measurably from contextual input to structured, solution-oriented contribution"
    ],
    "improvements": [
      "Frames clear problem statement and initial hypotheses before moving into solution design",
      "Anticipates needs and raises issues with proposed solutions"
    ],
    "masters": [
      "Completed ScorePlus GMAT course",
      "Applying to HEC and IMD MBA January 2027"
    ]
  },
  "saeed-al-sereidi": {
    "lineManager": "Noura Al Ahbabi",
    "function": "Strategic Management",
    "corporateExchangeProject": "TMO Activation",
    "previousFunction": "NA",
    "academicQualifications": "Bachelor's in Aerospace Engineering",
    "reportFirm": "Oliver Wyman",
    "phases": {
      "2025 Q4": "Corporate Exchange",
      "2026 Q1": "Corporate Exchange",
      "2026 Q2": "EO Secondment",
      "2026 Q3": "EO Secondment",
      "2026 Q4": "EO Secondment",
      "2027 Q1": "MBA",
      "2027 Q2": "MBA",
      "2027 Q3": "MBA",
      "2028 Q1": "EO Secondment",
      "2028 Q2": "EO Secondment",
      "2028 Q3": "EO Secondment",
      "2027 Q4": "MBA"
    },
    "ratings": {
      "Effective Communication & Influence": {
        "2025 Q4": "effective",
        "2026 Q1": "effective",
        "2026 Q2": "developing"
      },
      "Initiative": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Decision-Making & Accountability": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "developing"
      },
      "Capability Development": {
        "2025 Q4": "strong",
        "2026 Q1": "strong",
        "2026 Q2": "effective"
      },
      "Systemic Analysis & Planning": {
        "2025 Q4": "developing",
        "2026 Q1": "developing",
        "2026 Q2": "effective"
      }
    },
    "strengths": [
      "Demonstrates strong ability to create strategic frameworks",
      "Builds high stakeholder trust and transfers his expertise to the team"
    ],
    "improvements": [
      "Builds confidence presenting to senior/varied audiences",
      "Strengthens analytical rigor, weakest area in both review periods"
    ],
    "masters": [
      "Completed ScorePlus and GuideME GMAT course",
      "Applying to NYU Abu Dhabi MBA January 2027"
    ]
  }
};

/* Do not edit below this line. */
window.MBA_EVAL = { EVAL_META, EXTRA_CANDIDATES, NAME_OVERRIDES, EVALUATIONS };
