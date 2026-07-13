import React, { useState, useEffect, useMemo } from "react";
import { Compass, Target, LayoutGrid, NotebookPen, Home, Calendar, Lightbulb, RefreshCw, FileDown, HelpCircle, Plus, Check, ChevronRight, ChevronLeft, Trash2, Pencil, Circle, CircleDot, CheckCircle2, PauseCircle, Sparkles, ArrowRight, Copy, X } from "lucide-react";

/* =========================================================================
   IDP Studio — internal prototype
   Three modes: Discover (where do I want to grow?), Plan (the IDP itself),
   Track (progress dashboard). Data persists via window.storage.
   ========================================================================= */

// ---- Content library: roles → relevant competencies → concrete actions ----
const COMPETENCIES = {
  mastery: {
    label: "Mastery in Current Role",
    blurb: "Growth isn't only a promotion. Getting genuinely excellent at the role you're in is real, valuable development.",
    goalIdeas: [
      "Become the person others come to in my area",
      "Raise the quality bar on the work I already do",
      "Master a part of my role I currently just get by on",
    ],
    actions: [
      "List the core responsibilities of my role and honestly rate myself on each",
      "Pick the lowest-rated one and set a focused month of deliberate practice",
      "Ask my manager and a peer what 'great' looks like in my role, and close the gap",
    ],
    learning: ["Developing Your Expertise", "Deliberate Practice", "Skill Development"],
  },
  communication: {
    label: "Communication",
    blurb: "Getting ideas across clearly — writing, speaking, listening, influencing.",
    goalIdeas: [
      "Get more comfortable speaking up in larger meetings",
      "Write clearer updates that people actually read and act on",
      "Learn to tailor how I explain things to different audiences",
    ],
    actions: [
      "Volunteer to present at the next team meeting and ask a peer for written feedback",
      "Take a structured writing or storytelling course and apply it to one real document",
      "Shadow someone known for clear communication and debrief what they do differently",
    ],
    learning: ["Communication Foundations", "Communicating with Confidence", "Writing in Plain Language"],
  },
  leadership: {
    label: "Leadership & Influence",
    blurb: "Guiding people and decisions without always relying on formal authority.",
    goalIdeas: [
      "Build influence without having formal authority",
      "Get more confident making and owning a decision",
      "Learn to lead a project, not just contribute to one",
    ],
    actions: [
      "Lead a small cross-functional project end to end",
      "Find a mentor one level above your target role and meet monthly",
      "Run a retro for your team and own the follow-through on action items",
    ],
    learning: ["Leadership Foundations", "New Manager Foundations", "Leading without Authority"],
  },
  problemSolving: {
    label: "Problem Solving",
    blurb: "Breaking down ambiguous problems and reasoning toward good decisions.",
    goalIdeas: [
      "Get better at breaking big, vague problems into steps",
      "Build confidence tackling problems without a clear playbook",
      "Learn a decision-making framework I can lean on",
    ],
    actions: [
      "Take on one problem currently outside your comfort zone with manager check-ins",
      "Document your decision process on a real call, then review it with someone you trust",
      "Study a framework (e.g. root-cause analysis) and use it on a live issue",
    ],
    learning: ["Critical Thinking", "Problem Solving Techniques", "Decision Making"],
  },
  technical: {
    label: "Technical Depth",
    blurb: "Deepening the core craft your role is built on.",
    goalIdeas: [
      "Go from competent to genuinely strong in one core skill",
      "Close a specific knowledge gap I keep running into",
      "Learn a new tool or method that levels up my work",
    ],
    actions: [
      "Pick one tool or skill central to your role and complete a focused certification",
      "Pair with a senior colleague on something you'd normally avoid",
      "Rebuild or improve one existing piece of work using a new technique you learned",
    ],
    learning: ["<AREA> fundamentals", "Learning the basics", "Advanced techniques"],
  },
  collaboration: {
    label: "Collaboration",
    blurb: "Working well across people, teams, and disagreement.",
    goalIdeas: [
      "Work more smoothly with a team I find tricky",
      "Get better at navigating disagreement without friction",
      "Build stronger relationships outside my immediate team",
    ],
    actions: [
      "Partner with a team you rarely work with on one shared deliverable",
      "Practice giving structured peer feedback and ask for it in return",
      "Facilitate a working session and gather input on how it landed",
    ],
    learning: ["Teamwork Foundations", "Cross-Functional Collaboration", "Working with Difficult People"],
  },
  timeManagement: {
    label: "Time & Priorities",
    blurb: "Managing focus, workload, and competing demands.",
    goalIdeas: [
      "Feel more in control of a heavy workload",
      "Get better at protecting time for deep, focused work",
      "Learn to say no or renegotiate when I'm overloaded",
    ],
    actions: [
      "Track where your time goes for two weeks, then cut or delegate the bottom 20%",
      "Try time-blocking and review what actually stuck after a month",
      "Align with your manager on top 3 priorities and revisit weekly",
    ],
    learning: ["Time Management Fundamentals", "Productivity Tips", "Managing Your Focus"],
  },
  strategy: {
    label: "Strategic Thinking",
    blurb: "Seeing the bigger picture and connecting work to outcomes.",
    goalIdeas: [
      "Connect my day-to-day work to the bigger goals",
      "Get better at spotting what actually matters most",
      "Learn to think a few steps ahead, not just react",
    ],
    actions: [
      "Map how your work ladders up to a company goal and share it with your manager",
      "Sit in on planning conversations one level up and take notes on what's weighed",
      "Write a one-page 'where could this go in a year' for an area you own",
    ],
    learning: ["Strategic Thinking", "Business Strategy Foundations", "Thinking Like a Leader"],
  },
  people: {
    label: "People Development",
    blurb: "Growing others through coaching, feedback, and delegation.",
    goalIdeas: [
      "Get comfortable giving honest, helpful feedback",
      "Learn to delegate without micromanaging",
      "Mentor someone for the first time",
    ],
    actions: [
      "Onboard or mentor a newer team member with a light structure",
      "Practice delegating something you'd normally keep, and coach rather than correct",
      "Read one book on coaching and try one technique in your next 1:1",
    ],
    learning: ["Coaching and Developing Employees", "Giving and Receiving Feedback", "Delegating Tasks"],
  },
  publicSpeaking: {
    label: "Public Speaking",
    blurb: "Presenting with clarity and confidence to groups of any size.",
    goalIdeas: [
      "Get comfortable presenting to my own team",
      "Speak more confidently in larger or higher-stakes meetings",
      "Learn to handle questions on the spot without getting flustered",
    ],
    actions: [
      "Volunteer to present at an upcoming team meeting and ask a peer for specific feedback",
      "Join a Toastmasters group or take a structured public-speaking course",
      "Record myself presenting, watch it back, and pick one concrete thing to improve",
    ],
    learning: ["Public Speaking Foundations", "Overcoming Speaking Anxiety", "Presentation Skills"],
  },
  coaching: {
    label: "Coaching",
    blurb: "Helping others find their own answers through good questions, not just advice.",
    goalIdeas: [
      "Learn to coach rather than jump straight to giving answers",
      "Get better at asking questions that unlock someone's thinking",
      "Build a repeatable structure for my coaching conversations",
    ],
    actions: [
      "Learn the GROW model and use it to structure your next coaching conversation",
      "Practice active listening: in your next 1:1, spend more time asking than telling",
      "Find someone to coach regularly and ask them what's most helpful",
    ],
    learning: ["Coaching Skills for Leaders", "The GROW Coaching Model", "Active Listening"],
  },
  projectManagement: {
    label: "Project Management",
    blurb: "Planning, coordinating, and delivering work on time and across people.",
    goalIdeas: [
      "Lead a project end to end with confidence",
      "Get better at scoping work and setting realistic timelines",
      "Keep stakeholders aligned without endless status meetings",
    ],
    actions: [
      "Own a small project and run it with a simple plan: scope, milestones, owners, dates",
      "Learn a method or tool (e.g. Kanban, RACI, a project tracker) and apply it to real work",
      "Run a project retro at the end and capture what to do differently next time",
    ],
    learning: ["Project Management Foundations", "Agile Foundations", "Managing Small Projects"],
  },
};

// Role archetypes → which competencies tend to matter. Spans the whole company.
const ROLES = {
  "Individual contributor (early career)": ["technical", "communication", "timeManagement", "collaboration"],
  "Individual contributor (senior)": ["technical", "problemSolving", "strategy", "communication"],
  "Team lead / Manager": ["leadership", "people", "communication", "strategy"],
  "Director / Senior leader": ["strategy", "leadership", "people", "communication"],
  "Sales / Client-facing": ["communication", "collaboration", "problemSolving", "strategy"],
  "Operations / Support": ["problemSolving", "timeManagement", "collaboration", "communication"],
  "Creative / Design": ["technical", "collaboration", "communication", "strategy"],
  "Other / Not sure": ["communication", "problemSolving", "timeManagement", "collaboration"],
};

// Discovery prompts — for people who don't know where to grow.
const DISCOVERY = [
  { q: "When you picture loving your work a year from now, what's different?", weights: { strategy: 2, leadership: 1 }, options: [
    { t: "I'm trusted with bigger, more ambiguous problems", w: { problemSolving: 2, strategy: 1 }, path: "broader" },
    { t: "I'm guiding or growing other people", w: { people: 2, leadership: 2 }, path: "broader" },
    { t: "I'm genuinely excellent at my core craft", w: { technical: 3 }, path: "deeper" },
    { t: "I'm calmer and more in control of my workload", w: { timeManagement: 3 }, path: "deeper" },
  ]},
  { q: "What most often gets in your way right now?", weights: {}, options: [
    { t: "Getting my ideas heard or understood", w: { communication: 3 }, path: "deeper" },
    { t: "Too much to do, not enough focus", w: { timeManagement: 3 }, path: "deeper" },
    { t: "Friction working across teams", w: { collaboration: 3 }, path: "broader" },
    { t: "Knowing which problems are worth solving", w: { strategy: 2, problemSolving: 1 }, path: "broader" },
  ]},
  { q: "Which kind of feedback would you be proudest to hear?", weights: {}, options: [
    { t: "\"You made everyone around you better\"", w: { people: 2, leadership: 1 }, path: "broader" },
    { t: "\"You're the person we go to for the hard stuff\"", w: { problemSolving: 2, technical: 1 }, path: "deeper" },
    { t: "\"You communicate so clearly\"", w: { communication: 3 }, path: "deeper" },
    { t: "\"You always see the bigger picture\"", w: { strategy: 3 }, path: "broader" },
  ]},
  { q: "Pick the kind of task you'd happily lose an afternoon to.", weights: {}, options: [
    { t: "Going deep to master a tricky tool or skill", w: { technical: 3 }, path: "deeper" },
    { t: "Untangling a messy project between teams", w: { collaboration: 2, leadership: 1 }, path: "broader" },
    { t: "Shaping a rough idea into a clear plan", w: { strategy: 2, communication: 1 }, path: "broader" },
    { t: "Helping a teammate get unstuck", w: { people: 3 }, path: "broader" },
  ]},
  { q: "When you take a real step forward, what usually made it happen?", weights: {}, options: [
    { t: "Someone coached or sponsored me", w: { people: 1, leadership: 2 }, path: "broader" },
    { t: "I pushed past something that scared me", w: { problemSolving: 2, leadership: 1 }, path: "broader" },
    { t: "I finally explained my thinking well", w: { communication: 3 }, path: "deeper" },
    { t: "I got organized and protected my focus", w: { timeManagement: 3 }, path: "deeper" },
  ]},
];

const STATUS = {
  notStarted: { label: "Not started", icon: Circle, color: "var(--muted)" },
  inProgress: { label: "In progress", icon: CircleDot, color: "var(--accent)" },
  onHold: { label: "On hold", icon: PauseCircle, color: "var(--gold)" },
  done: { label: "Complete", icon: CheckCircle2, color: "var(--success)" },
};
const STATUS_ORDER = ["notStarted", "inProgress", "onHold", "done"];

const uid = () => Math.random().toString(36).slice(2, 9);

// ── Vumedi growth philosophy: lattice, not ladder ──
// The two directions growth can take (from the Expert / Mobility framing).
const GROWTH_PATHS = [
  {
    key: "deeper",
    label: "Go Deeper",
    tag: "The Expert Path",
    blurb: "Growth by mastery. Becoming genuinely excellent at your craft — the person others turn to with the hard problems. Reputation grows through expertise, not a change of title.",
    soundsLike: "\"I want to get really good at this.\"",
    looksLike: "Leading the trickiest projects in your area, mentoring others in your craft, and becoming the go-to expert in your function.",
  },
  {
    key: "broader",
    label: "Go Broader",
    tag: "The Mobility Path",
    blurb: "Growth by breadth. Stretching sideways into new scope, new stakeholders, or leading people and projects. Your range grows by taking on something different.",
    soundsLike: "\"I want to try something new / lead.\"",
    looksLike: "A stretch assignment on another team, a cross-functional project, a job rotation, or a move into an adjacent function.",
  },
];

// The three pillars — a lens for what KIND of growth someone is reaching for.
const GROWTH_PILLARS = [
  {
    key: "skill",
    label: "Skill Development",
    blurb: "Getting better at the craft of your role — deepening capability and quality.",
    soundsLike: "\"I want to get stronger at…\"",
  },
  {
    key: "experience",
    label: "Experience Expansion",
    blurb: "New scope, exposure, or challenge — stretch and breadth.",
    soundsLike: "\"I want to try something new.\"",
  },
  {
    key: "performance",
    label: "Performance Growth",
    blurb: "Closing a gap in your current role before the next step — consistency and reliability.",
    soundsLike: "\"Consistency & reliability first.\"",
  },
];


const HOME_PROMPTS = [
  "What's one thing you did this week that you're proud of?",
  "Where did you feel most energized at work recently, and why?",
  "What's a skill you wish you had more time to build?",
  "Think of someone you admire professionally. What do they do that you'd like to learn?",
  "What's a recent challenge that taught you something about yourself?",
  "If you could master one part of your role in the next 90 days, what would it be?",
  "What feedback have you received lately that stuck with you?",
  "What's something you're avoiding that might actually be worth tackling?",
  "When did you last feel stretched in a good way? What made it work?",
  "What would make next quarter feel like real growth for you?",
  "What's a strength of yours that others rely on? How could you deepen it?",
  "What's one assumption about your career you've started to question?",
  "Where do you want more responsibility, and what's holding you back?",
  "What does 'great' look like in your role, and how close are you?",
  "What's a small habit that would compound into a big difference over a year?",
  // Lattice-inspired: drawn from Vumedi's growth-conversation questions
  "What areas of your work help you grow the most?",
  "What skills would you like to continue developing?",
  "Where would you like to expand your impact?",
  "What experiences or projects would help you grow?",
  "Right now, do you want to go deeper in your craft, or broader into something new?",
  "Is there a gap in your current role you'd like to close before your next step?",
  "What would 'getting really good at this' look like for you this year?",
  "What's something new you'd like to try or lead?",
];

// Date helpers for action deadlines
function parseDate(s) { if (!s) return null; const d = new Date(s + "T00:00:00"); return isNaN(d) ? null : d; }
function fmtDate(s) { const d = parseDate(s); return d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""; }
function daysUntil(s) { const d = parseDate(s); if (!d) return null; const now = new Date(); now.setHours(0,0,0,0); return Math.round((d - now) / 86400000); }
function dateStatus(s, completed) {
  const n = daysUntil(s);
  if (n === null) return null;
  if (completed) return { kind: "done", label: fmtDate(s) };
  if (n < 0) return { kind: "overdue", label: `${Math.abs(n)}d overdue` };
  if (n === 0) return { kind: "due", label: "Due today" };
  if (n <= 14) return { kind: "soon", label: `${n}d left` };
  return { kind: "future", label: fmtDate(s) };
}

// ---- storage helpers (graceful if unavailable) ----
const store = {
  async get(key) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); } catch {}
  },
};

const TAB_GUIDE = [
  { icon: Home, label: "Home", desc: "Your starting point — a daily reflection prompt, what's coming up, and gentle nudges." },
  { icon: Compass, label: "Discover", desc: "Not sure where to grow? A few quick questions point you toward areas worth exploring." },
  { icon: Target, label: "My plan", desc: "Build your focus areas — each with a goal, concrete actions, and target dates." },
  { icon: LayoutGrid, label: "Progress", desc: "Track how your actions are moving along, with a timeline and status for each." },
  { icon: NotebookPen, label: "Reflect", desc: "A dated journal for the bigger-picture thinking that isn't tied to one goal." },
];

function WelcomeCard({ onDismiss, firstTime, setTab }) {
  return (
    <div className="modal-bg" onClick={onDismiss}>
      <div className="modal welcomemodal" onClick={(e) => e.stopPropagation()}>
        <div className="modalhead">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{firstTime ? "Welcome" : "Quick tour"}</div>
            <h2 className="serif" style={{ fontSize: "1.4rem", margin: 0 }}>{firstTime ? "Welcome to your development plan" : "What each tab does"}</h2>
          </div>
          <button className="iconbtn" onClick={onDismiss} style={{ color: "var(--muted)" }}><X size={20} /></button>
        </div>
        <p className="ideanote" style={{ marginTop: 0, marginBottom: 16 }}>
          This is a private space to think about your growth — everything you enter stays in your browser. Here's what you'll find:
        </p>
        <div className="tabguide">
          {TAB_GUIDE.map((t) => (
            <div className="tabguiderow" key={t.label}>
              <div className="tabguideicon"><t.icon size={18} /></div>
              <div>
                <div className="tabguidelabel">{t.label}</div>
                <div className="tabguidedesc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }} onClick={onDismiss}>
          {firstTime ? "Got it — let's start" : "Got it"}
        </button>
        <p className="ideanote" style={{ textAlign: "center", marginTop: 10, marginBottom: 0 }}>You can reopen this anytime with the <HelpCircle size={12} style={{ verticalAlign: "-2px" }} /> icon up top.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState({ name: "", title: "", role: "", vision: "" });
  const [goals, setGoals] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [discover, setDiscover] = useState(null); // { ranked: [keys], date, ts }
  const [welcomeSeen, setWelcomeSeen] = useState(true); // default true to avoid flash before load
  const [showWelcome, setShowWelcome] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await store.get("idp:profile");
      const g = await store.get("idp:goals");
      const r = await store.get("idp:reflections");
      const d = await store.get("idp:discover");
      const w = await store.get("idp:welcomeSeen");
      if (p) setProfile(p);
      if (g) setGoals(g);
      if (r) setReflections(r);
      if (d) setDiscover(d);
      if (!w) setShowWelcome(true); // first visit: show the welcome card
      setWelcomeSeen(!!w);
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) store.set("idp:profile", profile); }, [profile, loaded]);
  useEffect(() => { if (loaded) store.set("idp:goals", goals); }, [goals, loaded]);
  useEffect(() => { if (loaded) store.set("idp:reflections", reflections); }, [reflections, loaded]);
  useEffect(() => { if (loaded) store.set("idp:discover", discover); }, [discover, loaded]);

  const dismissWelcome = () => { setShowWelcome(false); setWelcomeSeen(true); store.set("idp:welcomeSeen", true); };

  const css = `
    :root{
      --ink:#000024; --ink-soft:#3a4554; --muted:#8a99a0;
      --paper:#f7f9f9; --card:#ffffff; --line:#e2e8e8;
      --accent:#3c6c78; --accent-soft:#e4eced; --accent-deep:#2a525c;
      --sage:#90a8a8; --sage-soft:#eef2f2; --sage-deep:#5f7878;
      --gold:#d99a2b; --gold-soft:#faf0db;
      --success:#3c7878;
    }
    *{box-sizing:border-box}
    .wrap{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--paper);min-height:100vh}
    .serif{font-family:'Fraunces','Georgia',serif}
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid var(--line);background:var(--card);position:sticky;top:0;z-index:20}
    .brand{display:flex;align-items:center;gap:11px}
    .mark{width:34px;height:34px;flex-shrink:0;display:block}
    .brandname{font-family:'Fraunces',serif;font-size:1.18rem;font-weight:600;letter-spacing:-.01em}
    .brandsub{font-size:.7rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
    .nav{display:flex;gap:4px;background:var(--paper);padding:4px;border-radius:11px;border:1px solid var(--line)}
    .navwrap{display:flex;align-items:center;gap:10px}
    .helpbtn{width:36px;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--card);color:var(--muted);display:grid;place-items:center;cursor:pointer;flex-shrink:0;transition:.15s}
    .helpbtn:hover{color:var(--accent-deep);border-color:var(--accent);background:var(--accent-soft)}
    .welcomemodal{max-width:520px}
    .tabguide{display:flex;flex-direction:column;gap:3px}
    .tabguiderow{display:flex;align-items:flex-start;gap:13px;padding:11px 12px;border-radius:11px;transition:.15s}
    .tabguiderow:hover{background:var(--paper)}
    .tabguideicon{width:36px;height:36px;border-radius:9px;background:var(--accent-soft);color:var(--accent-deep);display:grid;place-items:center;flex-shrink:0}
    .tabguidelabel{font-weight:600;font-size:.95rem;color:var(--ink);margin-bottom:2px}
    .tabguidedesc{font-size:.85rem;color:var(--ink-soft);line-height:1.45}
    .navbtn{display:flex;align-items:center;gap:7px;padding:8px 14px;border:0;background:transparent;color:var(--ink-soft);border-radius:8px;font-size:.86rem;font-weight:500;cursor:pointer;font-family:inherit;transition:.15s}
    .navbtn:hover{color:var(--ink)}
    .navbtn.on{background:var(--card);color:var(--accent-deep);box-shadow:0 1px 3px rgba(0,0,0,.06);font-weight:600}
    .main{max-width:920px;margin:0 auto;padding:36px 28px 80px}
    .eyebrow{font-size:.72rem;letter-spacing:.13em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:10px}
    h1.title{font-family:'Fraunces',serif;font-size:2.1rem;font-weight:600;letter-spacing:-.02em;margin:0 0 8px;line-height:1.1}
    .lede{color:var(--ink-soft);font-size:1.02rem;max-width:620px;line-height:1.55;margin:0 0 30px}
    .card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px}
    .field{margin-bottom:16px}
    .field label{display:block;font-size:.78rem;font-weight:600;color:var(--ink-soft);margin-bottom:6px;letter-spacing:.01em}
    .input,.select,.ta{width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:10px;font-family:inherit;font-size:.92rem;color:var(--ink);background:var(--paper);transition:.15s}
    .input:focus,.select:focus,.ta:focus{outline:0;border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px var(--accent-soft)}
    .ta{resize:vertical;min-height:74px;line-height:1.5}
    .row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    @media(max-width:640px){.row2{grid-template-columns:1fr}}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:10px;border:0;font-family:inherit;font-size:.9rem;font-weight:600;cursor:pointer;transition:.15s}
    .btn-primary{background:var(--accent);color:#fff}
    .btn-primary:hover{background:var(--accent-deep)}
    .btn-ghost{background:transparent;color:var(--accent-deep);border:1px solid var(--line)}
    .btn-ghost:hover{border-color:var(--accent);background:var(--accent-soft)}
    .btn-gold{background:var(--gold-soft);color:#9a6a1a;border:1px solid #ecdcc0}
    .btn-gold:hover{border-color:var(--gold);background:#f5e7cc}
    .goalcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin-bottom:14px;transition:.15s}
    .goalcard:hover{border-color:#d8d2c6;box-shadow:0 2px 10px rgba(0,0,0,.04)}
    .goalhead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .pill{display:inline-block;font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px;background:var(--accent-soft);color:var(--accent-deep);letter-spacing:.02em}
    .goaltitle{font-family:'Fraunces',serif;font-size:1.12rem;font-weight:600;margin:9px 0 6px}
    .goaldesc{color:var(--ink-soft);font-size:.9rem;line-height:1.5}
    .actionlist{margin:14px 0 0;padding:0;list-style:none;border-top:1px dashed var(--line);padding-top:13px}
    .actionitem{display:flex;align-items:flex-start;gap:9px;font-size:.86rem;color:var(--ink-soft);padding:5px 0;line-height:1.45}
    .actionitem svg{flex-shrink:0;margin-top:1px;color:var(--accent)}
    .meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:13px;font-size:.8rem;color:var(--muted)}
    .meta b{color:var(--ink-soft);font-weight:600}
    .statusbtn{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:8px;border:1px solid var(--line);background:var(--paper);font-size:.78rem;font-weight:600;cursor:pointer;font-family:inherit;color:var(--ink-soft)}
    .iconbtn{background:transparent;border:0;cursor:pointer;color:var(--muted);padding:4px;border-radius:6px;display:grid;place-items:center}
    .iconbtn:hover{color:#c0392b;background:#fbeae8}
    .empty{text-align:center;padding:52px 24px;border:1.5px dashed var(--line);border-radius:16px;color:var(--muted)}
    .empty .serif{font-size:1.25rem;color:var(--ink-soft);margin:14px 0 6px}
    /* discovery */
    .q{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:600;line-height:1.25;margin:0 0 20px}
    .opt{display:flex;align-items:center;gap:13px;width:100%;text-align:left;padding:16px 18px;border:1px solid var(--line);border-radius:13px;background:var(--card);font-family:inherit;font-size:.96rem;color:var(--ink);cursor:pointer;margin-bottom:11px;transition:.15s}
    .opt:hover{border-color:var(--accent);background:var(--accent-soft);transform:translateX(2px)}
    .optnum{width:26px;height:26px;border-radius:7px;background:var(--sage-soft);color:var(--sage-deep);display:grid;place-items:center;font-weight:700;font-size:.8rem;flex-shrink:0}
    .progressdots{display:flex;gap:7px;margin-bottom:26px}
    .dot{height:5px;flex:1;border-radius:3px;background:var(--line)}
    .dot.on{background:var(--accent)}
    .reco{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 18px;border:1px solid var(--line);border-radius:13px;margin-bottom:11px;background:var(--card)}
    .recorank{font-family:'Fraunces',serif;font-size:1.5rem;font-weight:600;color:var(--gold);width:34px}
    .recobody{flex:1}
    .reconame{font-weight:600;font-size:1rem;margin-bottom:2px}
    .recoblurb{font-size:.84rem;color:var(--muted);line-height:1.4}
    /* dashboard */
    .statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px}
    @media(max-width:640px){.statgrid{grid-template-columns:1fr}}
    .stat{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px}
    .statnum{font-family:'Fraunces',serif;font-size:2.4rem;font-weight:600;line-height:1;color:var(--accent-deep)}
    .statlabel{font-size:.8rem;color:var(--muted);margin-top:7px;letter-spacing:.02em}
    .bar{height:11px;border-radius:6px;background:var(--line);overflow:hidden;margin-top:8px}
    .barfill{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--accent),var(--success));transition:width .6s ease}
    .dashgoal{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}
    .dashgoal:last-child{border-bottom:0}
    .ring{width:42px;height:42px;flex-shrink:0}
    .modal-bg{position:fixed;inset:0;background:rgba(28,37,48,.4);backdrop-filter:blur(2px);display:grid;place-items:center;z-index:50;padding:20px}
    .modal{background:var(--card);border-radius:18px;padding:26px;max-width:540px;width:100%;max-height:88vh;overflow:auto}
    .modalhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
    .chip{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border:1px solid var(--line);border-radius:9px;font-size:.84rem;cursor:pointer;background:var(--paper);margin:0 8px 8px 0;font-family:inherit;color:var(--ink-soft);font-weight:500}
    .chip.on{background:var(--accent);color:#fff;border-color:var(--accent)}
    .addaction{display:flex;gap:8px;margin-top:8px}
    .ideabox{background:var(--gold-soft);border:1px solid #ecdcc0;border-radius:11px;padding:13px 14px;margin-bottom:11px}
    .ideahead{display:flex;align-items:center;gap:6px;font-size:.76rem;font-weight:600;color:var(--gold);margin-bottom:9px;letter-spacing:.01em}
    .ideachip{display:block;width:100%;text-align:left;padding:9px 12px;background:#fff;border:1px solid #ecdcc0;border-radius:8px;font-family:inherit;font-size:.86rem;color:var(--ink);cursor:pointer;margin-bottom:7px;transition:.13s;line-height:1.35}
    .ideachip:last-child{margin-bottom:0}
    .ideachip:hover{border-color:var(--gold);background:#fffdf8;transform:translateX(2px)}
    .lllist{display:flex;flex-direction:column;gap:8px}
    .lltoggle{display:flex;align-items:center;gap:10px;width:100%;padding:11px 13px;background:var(--card);border:1px solid var(--line);border-radius:9px;font-family:inherit;font-size:.88rem;font-weight:600;color:var(--accent-deep);cursor:pointer;transition:.13s}
    .lltoggle:hover{border-color:var(--accent);background:var(--accent-soft)}
    .llchip{display:flex;align-items:center;gap:10px;padding:11px 13px;background:var(--accent-soft);border:1px solid #cfe0e2;border-radius:9px;font-size:.88rem;color:var(--ink);text-decoration:none;transition:.13s}
    .llchip:hover{border-color:var(--accent);background:#d7e7ea;transform:translateX(2px)}
    .ideanote{font-size:.74rem;color:var(--muted);margin-top:6px}
    .linkbtn{background:none;border:0;color:var(--accent);font-family:inherit;font-size:inherit;font-weight:600;cursor:pointer;text-decoration:underline;padding:0}
    .aihelp{margin-top:14px;padding-top:14px;border-top:1px dashed var(--line)}
    .promptbox{background:var(--paper);border:1px solid var(--line);border-radius:11px;padding:12px 13px;margin-top:4px}
    .prompthead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;font-size:.74rem;font-weight:700;letter-spacing:.02em;color:var(--ink-soft);text-transform:uppercase}
    .copybtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border:1px solid var(--accent);border-radius:7px;background:var(--card);color:var(--accent-deep);font-family:inherit;font-size:.76rem;font-weight:600;cursor:pointer;white-space:nowrap;text-transform:none;letter-spacing:0}
    .copybtn:hover{background:var(--accent-soft)}
    .prompttext{margin:0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:.78rem;line-height:1.5;color:var(--ink-soft);white-space:pre-wrap;word-break:break-word;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:11px 12px;max-height:220px;overflow:auto}
    .homeprompt{background:linear-gradient(135deg,#ffffff,var(--sage-soft) 60%,var(--accent-soft));border:1px solid #d6e4e4}
    .homeprompthead{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
    .homepromptq{font-size:1.35rem;font-weight:600;line-height:1.3;color:var(--ink);margin-bottom:14px}
    .savedmsg{display:flex;align-items:center;gap:8px;font-size:.9rem;font-weight:600;color:var(--success);padding:10px 0}
    .homenext{display:flex;align-items:center;gap:12px;padding:11px 10px;margin:0 -10px;border-radius:10px;cursor:pointer;transition:.15s}
    .homenext:hover{background:var(--paper)}
    .nudge{display:flex;align-items:center;gap:12px;padding:13px 12px;margin:0 -12px 2px;border-radius:11px;cursor:pointer;transition:.15s}
    .nudge:hover{background:var(--paper)}
    .archivehead{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:0;cursor:pointer;font-family:inherit;padding:0}
    .lattice{border-left:3px solid var(--gold)}
    .pathgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    @media(max-width:640px){.pathgrid{grid-template-columns:1fr}}
    .pathcard{border-radius:12px;padding:15px 16px}
    .path-deeper{background:var(--accent);color:#fff}
    .path-broader{background:var(--gold);color:#3a2c10}
    .pathdim{opacity:.42;filter:saturate(.7)}
    .pathtag{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.85;margin-bottom:3px}
    .pathlabel{font-size:1.15rem;font-weight:600;margin-bottom:8px}
    .pathblurb{font-size:.86rem;line-height:1.5;opacity:.95;margin-bottom:9px}
    .pathmeta{font-size:.8rem;line-height:1.45;opacity:.92;margin-top:5px}
    .pathmeta b{font-weight:700}
    .pillargrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    @media(max-width:640px){.pillargrid{grid-template-columns:1fr}}
    .pillarcard{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:15px}
    .pillarnum{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:.85rem;margin-bottom:9px}
    .pillar-0{background:#6d94c4}
    .pillar-1{background:var(--sage-deep)}
    .pillar-2{background:var(--gold)}
    .pillarlabel{font-weight:600;font-size:.95rem;color:var(--ink);margin-bottom:5px}
    .pillarblurb{font-size:.82rem;color:var(--ink-soft);line-height:1.5;margin-bottom:8px}
    .pillarsounds{font-size:.8rem;font-style:italic;color:var(--muted)}
    .exporthead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;font-size:.74rem;font-weight:700;letter-spacing:.02em;color:var(--ink-soft);text-transform:uppercase}
    .exporttext{margin:0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:.78rem;line-height:1.55;color:var(--ink);white-space:pre-wrap;word-break:break-word;background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:14px;max-height:340px;overflow:auto}
    .timingrow{display:flex;align-items:center;gap:9px;padding:9px 14px;background:var(--accent-soft);border:1px solid var(--accent);border-top:0;border-bottom-left-radius:13px;border-bottom-right-radius:13px}
    .timingbox{display:flex;flex-direction:column}
    .timingbox .timingrow{border-radius:0}
    .timingbox .timingrow:last-child{border-bottom-left-radius:13px;border-bottom-right-radius:13px;padding-top:0;padding-bottom:11px}
    .timinglabel{font-size:.74rem;font-weight:600;color:var(--accent-deep);white-space:nowrap;flex-shrink:0;min-width:92px}
    .timinginput{padding:7px 10px;font-size:.82rem;background:#fff}
    .timinginput.needdate{border-color:var(--gold);background:var(--gold-soft)}
    .actiontiming{display:inline-block;margin-left:8px;font-size:.74rem;font-weight:600;color:var(--sage-deep);background:var(--sage-soft);padding:2px 8px;border-radius:6px;white-space:nowrap}
    .actiondate{display:inline-block;margin-left:8px;font-size:.74rem;font-weight:600;color:var(--accent-deep);background:var(--accent-soft);padding:2px 8px;border-radius:6px;white-space:nowrap}
    .timeline{position:relative;padding-left:6px}
    .tlitem{position:relative;display:flex;gap:14px;padding-bottom:18px}
    .tlitem:last-child{padding-bottom:0}
    .tlitem:not(:last-child)::before{content:"";position:absolute;left:8px;top:20px;bottom:-2px;width:2px;background:var(--line)}
    .tldot{width:18px;height:18px;border-radius:50%;flex-shrink:0;margin-top:1px;background:var(--card);border:2px solid var(--muted);display:grid;place-items:center;color:#fff;z-index:1}
    .tldot.done{background:var(--success);border-color:var(--success)}
    .tldot.overdue{background:#c0392b;border-color:#c0392b}
    .tldot.due{background:var(--gold);border-color:var(--gold)}
    .tldot.soon{background:var(--sage);border-color:var(--sage)}
    .tldot.future{border-color:var(--accent)}
    .tlbody{flex:1;min-width:0}
    .tldate{font-size:.72rem;font-weight:700;color:var(--muted);letter-spacing:.02em}
    .tlaction{font-size:.9rem;color:var(--ink);line-height:1.4;margin:1px 0 4px}
    .tlaction.tldone{text-decoration:line-through;color:var(--muted)}
    .tlmeta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .tlarea{font-size:.74rem;font-weight:600;color:var(--accent-deep);background:var(--accent-soft);padding:2px 9px;border-radius:20px}
    .tlbadge{font-size:.72rem;font-weight:700;padding:2px 9px;border-radius:6px}
    .tlbadge.overdue{color:#c0392b;background:#fbeae8}
    .tlbadge.due{color:#9a6a1a;background:var(--gold-soft)}
    .tlbadge.soon{color:var(--sage-deep);background:var(--sage-soft)}
    .tlbadge.future{color:var(--muted);background:var(--paper)}
    .tlbadge.done{color:var(--success);background:#e7f3ec}
    .editbtn:hover{color:var(--accent)!important;background:var(--accent-soft)!important}
    .customrow{margin-top:14px;padding-top:14px;border-top:1px dashed var(--line)}
    .aiload{display:flex;align-items:center;gap:10px;font-size:.86rem;color:var(--accent-deep);background:var(--accent-soft);padding:12px 14px;border-radius:11px}
    .spinner{width:16px;height:16px;border:2px solid var(--accent-soft);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
    @keyframes spin{to{transform:rotate(360deg)}}
    .dashrow-wrap{border-bottom:1px solid var(--line)}
    .dashrow-wrap:last-child{border-bottom:0}
    .dashrow-wrap .dashgoal{border-bottom:0}
    .dashgoal:hover{background:var(--paper)}
    .dashpanel{padding:4px 0 18px 56px;animation:fade .2s ease}
    @keyframes fade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
    .panellabel{font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
    .checkrow{display:flex;align-items:flex-start;gap:10px;padding:7px 0;cursor:pointer;line-height:1.4}
    .checkrow:hover span{color:var(--ink)}
    .noteadd{margin-bottom:14px}
    .notelog{display:flex;flex-direction:column;gap:0}
    .noteentry{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-top:1px solid var(--line)}
    .noteentry:hover .iconbtn{opacity:1}
    .noteentry .iconbtn{opacity:0;transition:.15s}
    .notedate{flex-shrink:0;font-size:.72rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:3px 9px;border-radius:6px;white-space:nowrap;margin-top:1px;letter-spacing:.01em}
    .notetext{flex:1;font-size:.88rem;color:var(--ink-soft);line-height:1.5;white-space:pre-wrap}
    .statuswrap{position:relative;flex-shrink:0}
    .statusmenu{position:absolute;right:0;top:calc(100% + 5px);background:#fff;border:1px solid var(--line);border-radius:11px;box-shadow:0 8px 24px rgba(28,37,48,.13);padding:5px;z-index:30;min-width:160px}
    .statusopt{display:flex;align-items:center;gap:9px;width:100%;text-align:left;padding:9px 11px;border:0;background:transparent;border-radius:8px;font-family:inherit;font-size:.84rem;font-weight:500;color:var(--ink);cursor:pointer;white-space:nowrap}
    .statusopt:hover{background:var(--paper)}
    .statusopt.on{font-weight:600}
    .reflcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:13px;transition:.15s}
    .reflcard:hover{border-color:#d8d2c6;box-shadow:0 2px 10px rgba(0,0,0,.04)}
    .reflcard:hover .iconbtn{opacity:1}
    .reflcard .iconbtn{opacity:0;transition:.15s}
    .reflhead{display:flex;align-items:center;gap:10px;margin-bottom:9px}
    .refldate{font-size:.74rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:4px 10px;border-radius:7px;white-space:nowrap}
    .reflprompt{font-size:.74rem;font-weight:600;color:var(--gold);background:var(--gold-soft);padding:4px 10px;border-radius:7px}
    .refltext{font-size:.93rem;color:var(--ink-soft);line-height:1.6;white-space:pre-wrap}
    .reflprompts{display:flex;flex-direction:column;gap:5px}
    .promptline{font-family:'Fraunces',serif;font-size:1.02rem;color:var(--ink);padding-left:14px;border-left:2px solid var(--accent);line-height:1.4}
    .yourtag{font-size:.66rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--accent-deep);background:var(--accent-soft);padding:3px 8px;border-radius:6px;white-space:nowrap;flex-shrink:0}`;

  return (
    <div className="wrap">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`}</style>
      <style>{css}</style>

      <div className="topbar">
        <div className="brand">
          <svg className="mark" viewBox="0 0 100 100" width="34" height="34" aria-label="Vumedi">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#3c6c78" strokeWidth="9" strokeDasharray="63 188" strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="butt" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#d99a2b" strokeWidth="9" strokeDasharray="40 211" strokeDashoffset="-63" transform="rotate(-90 50 50)" strokeLinecap="butt" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#000024" strokeWidth="9" strokeDasharray="63 188" strokeDashoffset="-103" transform="rotate(-90 50 50)" strokeLinecap="butt" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#90a8a8" strokeWidth="9" strokeDasharray="85 166" strokeDashoffset="-166" transform="rotate(-90 50 50)" strokeLinecap="butt" />
            <path d="M34 36 L50 66 L66 36" fill="none" stroke="#000024" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="brandname">Vumedi</div>
            <div className="brandsub">Individual Development Plan</div>
          </div>
        </div>
        <div className="navwrap">
          <nav className="nav">
            {[
              ["home", "Home", Home],
              ["discover", "Discover", Compass],
              ["plan", "My plan", Target],
              ["track", "Progress", LayoutGrid],
              ["reflect", "Reflect", NotebookPen],
            ].map(([k, label, Icon]) => (
              <button key={k} className={`navbtn ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <button className="helpbtn" onClick={() => setShowWelcome(true)} title="What's here?" aria-label="What's here?">
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {showWelcome && <WelcomeCard onDismiss={dismissWelcome} firstTime={!welcomeSeen} setTab={setTab} />}

      <div className="main">
        {tab === "home" && <HomeTab profile={profile} goals={goals} reflections={reflections} discover={discover}
          setTab={setTab}
          onAddReflection={(entry) => setReflections([entry, ...reflections])} />}
        {tab === "discover" && <Discover savedResult={discover} onSaveResult={setDiscover}
          onPick={() => setTab("plan")} setSeed={(c) => { setTab("plan"); window.__seedComp = c; }} />}
        {tab === "plan" && <Plan profile={profile} setProfile={setProfile} goals={goals} setGoals={setGoals} />}
        {tab === "track" && <Track goals={goals} setGoals={setGoals} profile={profile} onStart={() => setTab("plan")} />}
        {tab === "reflect" && <Reflect reflections={reflections} setReflections={setReflections} />}
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */
function LatticeIntro() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card lattice" style={{ marginBottom: 22 }}>
      <button className="archivehead" onClick={() => setOpen(!open)}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>How we think about growth at Vumedi</div>
          <div className="serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>A lattice, not a ladder</div>
        </div>
        <ChevronRight size={20} style={{ color: "var(--muted)", transform: open ? "rotate(90deg)" : "none", transition: ".2s", flexShrink: 0 }} />
      </button>
      <p style={{ fontSize: ".92rem", color: "var(--ink-soft)", lineHeight: 1.6, margin: "12px 0 0" }}>
        Growth isn't only a promotion. A ladder has one direction — up. A lattice has many: you can grow by getting deeper in your craft, or broader across new experiences, without a title change. Both are real growth.
      </p>
      {open && (
        <div style={{ marginTop: 18 }}>
          <div className="pathgrid">
            {GROWTH_PATHS.map((p) => (
              <div key={p.key} className={`pathcard path-${p.key}`}>
                <div className="pathtag">{p.tag}</div>
                <div className="pathlabel serif">{p.label}</div>
                <div className="pathblurb">{p.blurb}</div>
                <div className="pathmeta"><b>Sounds like:</b> {p.soundsLike}</div>
                <div className="pathmeta"><b>Can look like:</b> {p.looksLike}</div>
              </div>
            ))}
          </div>
          <div className="eyebrow" style={{ margin: "20px 0 10px" }}>Three kinds of growth to reach for</div>
          <div className="pillargrid">
            {GROWTH_PILLARS.map((p, i) => (
              <div key={p.key} className="pillarcard">
                <div className={`pillarnum pillar-${i}`}>{i + 1}</div>
                <div className="pillarlabel">{p.label}</div>
                <div className="pillarblurb">{p.blurb}</div>
                <div className="pillarsounds">{p.soundsLike}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeTab({ profile, goals, reflections, discover, setTab, onAddReflection }) {
  const [exportOpen, setExportOpen] = useState(false);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const [promptIdx, setPromptIdx] = useState(dayIndex % HOME_PROMPTS.length);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const prompt = HOME_PROMPTS[promptIdx];

  const firstName = profile.name ? profile.name.split(" ")[0] : "";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const upcoming = [];
  goals.forEach((g) => {
    if (g.status === "done") return;
    const dates = g.actionDates || {};
    const checked = g.checkedActions || [];
    (g.actions || []).forEach((a) => {
      if (dates[a] && !checked.includes(a)) {
        upcoming.push({ area: g.customLabel || COMPETENCIES[g.comp]?.label || g.comp, action: a, date: dates[a] });
      }
    });
  });
  upcoming.sort((x, y) => parseDate(x.date) - parseDate(y.date));
  const nextUp = upcoming.slice(0, 3);

  const activeCount = goals.filter((g) => g.status !== "done").length;
  const overdue = upcoming.filter((u) => daysUntil(u.date) < 0).length;

  const lastReflection = reflections[0];
  const daysSinceReflection = lastReflection ? daysUntil(new Date(lastReflection.ts).toISOString().slice(0,10)) : null;
  const reflectionStale = !lastReflection || (daysSinceReflection !== null && daysSinceReflection <= -14);
  const discoverStale = !discover || (discover.ts && (Date.now() - discover.ts) > 1000*60*60*24*90);

  const saveAnswer = () => {
    const text = answer.trim();
    if (!text) return;
    onAddReflection({
      id: uid(),
      text,
      prompt,
      date: new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      ts: Date.now(),
    });
    setAnswer(""); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const newPrompt = () => { setPromptIdx((promptIdx + 1) % HOME_PROMPTS.length); setSaved(false); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div className="eyebrow">Home</div>
          <h1 className="title">{greeting}{firstName ? `, ${firstName}` : ""}.</h1>
        </div>
        {goals.length > 0 && (
          <button className="btn btn-gold" style={{ marginTop: 6, whiteSpace: "nowrap" }} onClick={() => setExportOpen(true)}>
            <FileDown size={15} /> Export for Lattice
          </button>
        )}
      </div>
      <p className="lede">{profile.vision || "Small, steady steps add up. Here's where things stand and a moment to reflect."}</p>

      {exportOpen && <ExportModal profile={profile} goals={goals} reflections={reflections} onClose={() => setExportOpen(false)} />}

      <LatticeIntro />

      <div className="card homeprompt" style={{ marginBottom: 22 }}>
        <div className="homeprompthead">
          <span className="eyebrow" style={{ margin: 0, color: "var(--accent-deep)" }}><Lightbulb size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />Reflection of the day</span>
          <button className="copybtn" onClick={newPrompt} style={{ textTransform: "none" }}><RefreshCw size={13} /> New prompt</button>
        </div>
        <div className="homepromptq serif">{prompt}</div>
        {saved ? (
          <div className="savedmsg"><Check size={15} /> Saved to your Reflect tab.</div>
        ) : (
          <>
            <textarea className="ta" style={{ minHeight: 80 }} value={answer}
              placeholder="Take a moment… (optional, but worth it)"
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveAnswer(); }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9 }}>
              <span className="ideanote" style={{ margin: 0 }}>{answer.trim() ? "Saves to Reflect with today's date." : ""}</span>
              <button className="btn btn-primary" onClick={saveAnswer} disabled={!answer.trim()} style={{ opacity: answer.trim() ? 1 : .5 }}>
                <Plus size={15} /> Save reflection
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 className="serif" style={{ fontSize: "1.1rem", margin: 0 }}><Calendar size={16} style={{ verticalAlign: "-3px", marginRight: 7, color: "var(--accent)" }} />What's next</h2>
          {overdue > 0 && <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#c0392b" }}>{overdue} overdue</span>}
        </div>
        {nextUp.length === 0 ? (
          <div style={{ fontSize: ".9rem", color: "var(--muted)" }}>
            {activeCount === 0
              ? <>No focus areas yet. <button className="linkbtn" onClick={() => setTab("plan")}>Start your plan</button> or <button className="linkbtn" onClick={() => setTab("discover")}>explore where to grow</button>.</>
              : "No upcoming dated actions — open a focus area to add target dates."}
          </div>
        ) : nextUp.map((u, i) => {
          const ds = dateStatus(u.date, false);
          return (
            <div className="homenext" key={i} onClick={() => setTab("track")}>
              <div className={`tldot ${ds?.kind || ""}`} style={{ width: 14, height: 14 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: ".9rem", color: "var(--ink)" }}>{u.action}</div>
                <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{u.area}</div>
              </div>
              <span className={`tlbadge ${ds?.kind || ""}`}>{ds?.label}</span>
            </div>
          );
        })}
      </div>

      {(reflectionStale || discoverStale || activeCount === 0) && (
        <div className="card">
          <h2 className="serif" style={{ fontSize: "1.1rem", margin: "0 0 12px" }}>A couple of gentle nudges</h2>
          {discoverStale && (
            <div className="nudge" onClick={() => setTab("discover")}>
              <Compass size={18} style={{ color: "var(--sage-deep)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{discover ? "It's been a while since your last Discover check-in" : "Not sure where to focus?"}</div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>{discover ? "Priorities shift as you grow — take it again to see what's changed." : "Answer a few quick questions to find areas worth developing."}</div>
              </div>
              <ArrowRight size={16} style={{ color: "var(--muted)" }} />
            </div>
          )}
          {reflectionStale && (
            <div className="nudge" onClick={() => setTab("reflect")}>
              <NotebookPen size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{lastReflection ? "It's been a couple of weeks since you reflected" : "Capture your first reflection"}</div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>A quick note now and then builds a clear picture of your growth over time.</div>
              </div>
              <ArrowRight size={16} style={{ color: "var(--muted)" }} />
            </div>
          )}
          {activeCount === 0 && (
            <div className="nudge" onClick={() => setTab("plan")}>
              <Target size={18} style={{ color: "var(--accent-deep)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: ".9rem" }}>Set your first focus area</div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>Turn intention into a plan with concrete actions and dates.</div>
              </div>
              <ArrowRight size={16} style={{ color: "var(--muted)" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- EXPORT (Lattice-friendly) ---------------- */
function ExportModal({ profile, goals, reflections, onClose }) {
  const [format, setFormat] = useState("weekly");
  const [copied, setCopied] = useState(false);

  const active = goals.filter((g) => g.status !== "done");
  const completed = goals.filter((g) => g.status === "done");
  const statusLabel = (s) => (STATUS[s] || STATUS.notStarted).label;
  const areaOf = (g) => g.customLabel || COMPETENCIES[g.comp]?.label || g.comp;

  // Actions due within the next ~7 days or overdue, not yet checked
  const dueSoon = [];
  goals.forEach((g) => {
    if (g.status === "done") return;
    const dates = g.actionDates || {};
    const checked = g.checkedActions || [];
    (g.actions || []).forEach((a) => {
      if (dates[a] && !checked.includes(a)) {
        const d = daysUntil(dates[a]);
        if (d !== null && d <= 7) dueSoon.push({ area: areaOf(g), action: a, date: dates[a], d });
      }
    });
  });
  dueSoon.sort((x, y) => x.d - y.d);

  // Recently completed actions (checked) for "what moved"
  const recentlyDone = [];
  goals.forEach((g) => {
    const checked = g.checkedActions || [];
    checked.forEach((a) => recentlyDone.push({ area: areaOf(g), action: a }));
  });

  const lastReflection = reflections[0];

  function buildWeekly() {
    const lines = [];
    lines.push(`Development update — ${new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`);
    lines.push("");
    if (recentlyDone.length) {
      lines.push("✅ Progress this period:");
      recentlyDone.slice(0, 6).forEach((r) => lines.push(`  • ${r.action} (${r.area})`));
      lines.push("");
    }
    if (dueSoon.length) {
      lines.push("🎯 Coming up:");
      dueSoon.slice(0, 6).forEach((u) => {
        const tag = u.d < 0 ? `${Math.abs(u.d)}d overdue` : u.d === 0 ? "due today" : `due in ${u.d}d`;
        lines.push(`  • ${u.action} (${u.area}) — ${tag}`);
      });
      lines.push("");
    }
    if (!recentlyDone.length && !dueSoon.length) {
      lines.push("Focus areas in progress:");
      active.forEach((g) => lines.push(`  • ${g.title} (${areaOf(g)}) — ${statusLabel(g.status)}`));
      lines.push("");
    }
    if (lastReflection) {
      lines.push("💭 A recent reflection:");
      lines.push(`  "${lastReflection.text}"`);
    }
    return lines.join("\n").trim();
  }

  function buildOneOnOne() {
    const lines = [];
    lines.push(`Development check-in — ${profile.name || "My plan"}`);
    if (profile.title) lines.push(`Role: ${profile.title}`);
    if (profile.vision) lines.push(`Vision: ${profile.vision}`);
    lines.push("");
    lines.push("CURRENT FOCUS AREAS");
    if (!active.length) lines.push("  (none active)");
    active.forEach((g) => {
      lines.push("");
      lines.push(`• ${g.title}  [${areaOf(g)}] — ${statusLabel(g.status)}`);
      if (g.desc) lines.push(`  Success looks like: ${g.desc}`);
      const checked = g.checkedActions || [];
      (g.actions || []).forEach((a) => {
        const date = (g.actionDates || {})[a];
        const mark = checked.includes(a) ? "[x]" : "[ ]";
        lines.push(`    ${mark} ${a}${date ? ` (by ${fmtDate(date)})` : ""}`);
      });
      if (g.support) lines.push(`  Support needed: ${g.support}`);
    });
    lines.push("");
    lines.push("TO DISCUSS / REFLECTIONS");
    if (lastReflection) {
      reflections.slice(0, 3).forEach((r) => lines.push(`  • (${r.date}) ${r.text}`));
    } else {
      lines.push("  (none yet)");
    }
    return lines.join("\n").trim();
  }

  function buildFull() {
    const lines = [];
    lines.push(`INDIVIDUAL DEVELOPMENT PLAN`);
    if (profile.name) lines.push(profile.name);
    if (profile.title) lines.push(profile.title);
    if (profile.vision) { lines.push(""); lines.push(`Vision: ${profile.vision}`); }
    lines.push("");
    lines.push("═══ ACTIVE FOCUS AREAS ═══");
    active.forEach((g) => {
      lines.push("");
      lines.push(`▸ ${g.title}  [${areaOf(g)}] — ${statusLabel(g.status)}`);
      if (g.desc) lines.push(`  Success: ${g.desc}`);
      const checked = g.checkedActions || [];
      (g.actions || []).forEach((a) => {
        const date = (g.actionDates || {})[a];
        const mark = checked.includes(a) ? "✓" : "○";
        lines.push(`    ${mark} ${a}${date ? ` — by ${fmtDate(date)}` : ""}`);
      });
      if (g.support) lines.push(`  Support: ${g.support}`);
      if (g.due) lines.push(`  Overall target: ${g.due}`);
    });
    if (completed.length) {
      lines.push("");
      lines.push("═══ COMPLETED ═══");
      completed.forEach((g) => lines.push(`  ✓ ${g.title} [${areaOf(g)}]`));
    }
    if (reflections.length) {
      lines.push("");
      lines.push("═══ REFLECTIONS ═══");
      reflections.slice(0, 8).forEach((r) => lines.push(`  • (${r.date}) ${r.text}`));
    }
    return lines.join("\n").trim();
  }

  const text = format === "weekly" ? buildWeekly() : format === "oneonone" ? buildOneOnOne() : buildFull();

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalhead">
          <h2 className="serif" style={{ fontSize: "1.3rem", margin: 0 }}>Export for Lattice</h2>
          <button className="iconbtn" onClick={onClose} style={{ color: "var(--muted)" }}><X size={20} /></button>
        </div>
        <div className="ideanote" style={{ marginTop: 0, marginBottom: 14 }}>
          Pick a format, copy it, and paste into your Lattice update, 1:1 talking points, or review. Nothing is shared automatically — you choose what goes in.
        </div>

        <div style={{ marginBottom: 14 }}>
          {[["weekly", "Weekly update"], ["oneonone", "1:1 / review prep"], ["full", "Full plan"]].map(([k, label]) => (
            <button key={k} className={`chip ${format === k ? "on" : ""}`} onClick={() => setFormat(k)}>{label}</button>
          ))}
        </div>

        <div className="exporthead">
          <span>{format === "weekly" ? "Concise update for your weekly check-in" : format === "oneonone" ? "Structured prep for a 1:1 or review" : "Complete snapshot of your plan"}</span>
          <button className="copybtn" onClick={copy} style={{ textTransform: "none" }}>
            {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
        <pre className="exporttext">{text}</pre>
      </div>
    </div>
  );
}

/* ---------------- DISCOVER ---------------- */
function Discover({ setSeed, savedResult, onSaveResult }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [showSaved, setShowSaved] = useState(!!savedResult);
  const done = step >= DISCOVERY.length;

  const choose = (w) => {
    const next = { ...scores };
    Object.entries(w).forEach(([k, v]) => { next[k] = (next[k] || 0) + v; });
    setScores(next);
    setStep(step + 1);
  };

  const ranked = useMemo(() =>
    Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k),
    [scores]);

  // Save results once the quiz completes
  useEffect(() => {
    if (done && ranked.length) {
      onSaveResult({
        ranked,
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        ts: Date.now(),
      });
    }
  }, [done]);

  // Landing view: if there's a saved result and the user hasn't started a new quiz, show it
  if (showSaved && savedResult && !done && step === 0) {
    return (
      <div>
        <div className="eyebrow">Your last reflection · {savedResult.date}</div>
        <h1 className="title">Where you leaned last time</h1>
        <p className="lede">Here's what your last Discover check-in surfaced. Priorities shift as you grow — when you're ready, take it again to see what's changed.</p>
        {savedResult.ranked.filter((k) => COMPETENCIES[k]).map((k, i) => (
          <div className="reco" key={k}>
            <div className="recorank">{i + 1}</div>
            <div className="recobody">
              <div className="reconame">{COMPETENCIES[k].label}</div>
              <div className="recoblurb">{COMPETENCIES[k].blurb}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => setSeed(k)}>
              Build a goal <ArrowRight size={15} />
            </button>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setShowSaved(false); setStep(0); setScores({}); }}>
          <RefreshCw size={15} /> Take it again
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div className="eyebrow">Your reflection</div>
        <h1 className="title">Here's where you lean</h1>
        <p className="lede">Based on what you told us, these areas would likely be the most energizing to grow in. Nothing here is binding — it's a starting point for a conversation with your manager.</p>
        {ranked.map((k, i) => (
          <div className="reco" key={k}>
            <div className="recorank">{i + 1}</div>
            <div className="recobody">
              <div className="reconame">{COMPETENCIES[k].label}</div>
              <div className="recoblurb">{COMPETENCIES[k].blurb}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => setSeed(k)}>
              Build a goal <ArrowRight size={15} />
            </button>
          </div>
        ))}
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => { setStep(0); setScores({}); }}>
          <ChevronLeft size={15} /> Start over
        </button>
      </div>
    );
  }

  const cur = DISCOVERY[step];
  return (
    <div>
      <div className="eyebrow">Not sure where to grow?</div>
      <h1 className="title">A few quick questions</h1>
      <p className="lede">No wrong answers. This takes about a minute and points you toward areas worth exploring.</p>
      <div className="progressdots">
        {DISCOVERY.map((_, i) => <div key={i} className={`dot ${i <= step ? "on" : ""}`} />)}
      </div>
      <div className="card">
        <p className="q">{cur.q}</p>
        {cur.options.map((o, i) => (
          <button className="opt" key={i} onClick={() => choose(o.w)}>
            <span className="optnum">{String.fromCharCode(65 + i)}</span>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PLAN ---------------- */
function Plan({ profile, setProfile, goals, setGoals }) {
  const [modal, setModal] = useState(false);
  const [seed, setSeedComp] = useState(null);
  const [editing, setEditing] = useState(null); // goal being edited, or null

  useEffect(() => {
    if (window.__seedComp) { setSeedComp(window.__seedComp); setEditing(null); setModal(true); window.__seedComp = null; }
  });

  const suggestedComps = ROLES[profile.role] || [];
  const activeGoals = goals.filter((g) => g.status !== "done");
  const completedCount = goals.filter((g) => g.status === "done").length;

  return (
    <div>
      <div className="eyebrow">Individual development plan</div>
      <h1 className="title">{profile.name ? `${profile.name.split(" ")[0]}'s plan` : "My development plan"}</h1>
      <p className="lede">Start with who you are and where you're headed. Then add a few focus areas — quality over quantity. Each one comes with suggested actions you can keep or swap.</p>

      <div className="card" style={{ marginBottom: 26 }}>
        <div className="row2">
          <div className="field">
            <label>Your name</label>
            <input className="input" value={profile.name} placeholder="e.g. Jordan Rivera"
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Your job title</label>
            <input className="input" value={profile.title || ""} placeholder="e.g. Senior Implementation Specialist"
              onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Role type <span style={{ fontWeight: 400, color: "var(--muted)" }}>— the closest general category</span></label>
          <select className="select" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
            <option value="">Select a role type…</option>
            {Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Development vision <span style={{ fontWeight: 400, color: "var(--muted)" }}>— a sentence on where you want to be</span></label>
          <textarea className="ta" value={profile.vision} placeholder="e.g. I want to grow from doing the work well to helping others do it well."
            onChange={(e) => setProfile({ ...profile, vision: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 className="serif" style={{ fontSize: "1.3rem", margin: 0 }}>Focus areas <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "1rem" }}>({activeGoals.length} active)</span></h2>
        <button className="btn btn-primary" onClick={() => { setSeedComp(null); setEditing(null); setModal(true); }}>
          <Plus size={16} /> Add focus area
        </button>
      </div>
      <div style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: 16 }}>
        {activeGoals.length === 0 ? "A focused plan beats a long one." :
         activeGoals.length <= 5 ? "3–5 active focus areas is a good range — enough to grow, not so many it scatters your attention." :
         "Heads up: you've got more than 5 active areas. That's allowed, but focus tends to suffer past 5 — consider what to prioritize."}
        {completedCount > 0 && <span> · {completedCount} completed (see Progress)</span>}
      </div>

      {activeGoals.length === 0 ? (
        <div className="empty">
          <Sparkles size={28} style={{ color: "var(--gold)" }} />
          <div className="serif">No active focus areas</div>
          <p style={{ margin: "0 auto", maxWidth: 360, fontSize: ".9rem", lineHeight: 1.5 }}>
            Add your first one — or if you're not sure where to start, try the Discover tab for a few guiding questions.
          </p>
        </div>
      ) : activeGoals.map((g) => (
        <GoalCard key={g.id} goal={g}
          onStatus={(s) => setGoals(goals.map((x) => x.id === g.id ? { ...x, status: s } : x))}
          onEdit={() => { setEditing(g); setSeedComp(null); setModal(true); }}
          onDelete={() => setGoals(goals.filter((x) => x.id !== g.id))} />
      ))}

      {suggestedComps.length > 0 && (
        <div style={{ marginTop: 20, fontSize: ".84rem", color: "var(--muted)" }}>
          <b style={{ color: "var(--ink-soft)" }}>For your role, people often focus on:</b>{" "}
          {suggestedComps.map((c) => COMPETENCIES[c].label).join(" · ")}
        </div>
      )}

      {modal && <GoalModal seed={seed} existing={editing}
        roleCtx={{ title: profile.title, role: profile.role }}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={(g) => {
          if (editing) {
            setGoals(goals.map((x) => x.id === g.id ? g : x));
          } else {
            setGoals([...goals, g]);
          }
          setModal(false); setEditing(null);
        }} />}
    </div>
  );
}

function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const st = STATUS[status] || STATUS.notStarted;
  const StIcon = st.icon;
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="statuswrap" onClick={(e) => e.stopPropagation()}>
      <button className="statusbtn" onClick={() => setOpen(!open)} style={{ borderColor: st.color }}>
        <StIcon size={14} style={{ color: st.color }} /> {st.label}
        <ChevronRight size={13} style={{ color: "var(--muted)", transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: ".15s" }} />
      </button>
      {open && (
        <div className="statusmenu">
          {STATUS_ORDER.map((k) => {
            const s = STATUS[k]; const Ic = s.icon;
            return (
              <button key={k} className={`statusopt ${k === status ? "on" : ""}`}
                onClick={() => { onChange(k); setOpen(false); }}>
                <Ic size={15} style={{ color: s.color }} /> {s.label}
                {k === status && <Check size={14} style={{ marginLeft: "auto", color: s.color }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onStatus, onEdit, onDelete }) {
  const timing = goal.actionTiming || {};
  const dates = goal.actionDates || {};
  return (
    <div className="goalcard">
      <div className="goalhead">
        <span className="pill">{goal.customLabel || COMPETENCIES[goal.comp]?.label || goal.comp}</span>
        <div style={{ display: "flex", gap: 2 }}>
          <button className="iconbtn editbtn" onClick={onEdit} title="Edit"><Pencil size={15} /></button>
          <button className="iconbtn" onClick={onDelete} title="Remove"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="goaltitle">{goal.title}</div>
      <div className="goaldesc">{goal.desc}</div>
      {goal.actions?.length > 0 && (
        <ul className="actionlist">
          {goal.actions.map((a, i) => (
            <li className="actionitem" key={i}>
              <Check size={15} />
              <span style={{ flex: 1 }}>
                {a}
                {dates[a] && <span className="actiondate">{fmtDate(dates[a])}</span>}
                {timing[a] && <span className="actiontiming">{timing[a]}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="meta">
        {goal.support && <span><b>Support from:</b> {goal.support}</span>}
        {goal.due && <span><b>Overall target:</b> {goal.due}</span>}
        <div style={{ marginLeft: "auto" }}><StatusDropdown status={goal.status} onChange={onStatus} /></div>
      </div>
    </div>
  );
}

function PromptHelper({ roleName, hasRoleInfo, roleContextString, customArea }) {
  const [copied, setCopied] = useState(false);

  const roleLine = hasRoleInfo
    ? `My role: ${roleName}.${roleContextString ? ` Context: ${roleContextString}` : ""}`
    : `My role: Customer Success Manager (CSM). My key responsibilities include onboarding new clients, driving product adoption, managing renewals, and acting as the main point of contact for my accounts.`;

  // Two prompt shapes: developing a specific skill area, or mastering the current role.
  const prompt = customArea
    ? `I'm building a professional development plan and want to grow specifically in: ${customArea}.

${roleLine}

Please suggest:
1) Two or three specific, realistic goals for developing "${customArea}" — short statements I could put in a development plan.
2) For each goal, 2–3 concrete actions: name actual frameworks, models, methodologies, tools, courses, or recognized practices (not vague advice like "get better at it"). Keep them practical enough to start this quarter.`
    : `I'm building a professional development plan and want to get genuinely excellent at my CURRENT role — not chasing a promotion, just mastering the job I have.

${roleLine}

Please suggest 3–5 specific areas I could develop to master this role. For each one, name concrete things to learn or practice — actual frameworks, models, methodologies, tools, or skills (e.g. a named coaching model, a specific certification, a recognized methodology), not vague advice like "improve communication." Keep each suggestion practical and something I could realistically start this quarter.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="promptbox">
      <div className="prompthead">
        <span>{customArea ? `Starter prompt for "${customArea}"` : hasRoleInfo ? "Starter prompt (using your role info)" : "Starter prompt — example for a CSM"}</span>
        <button className="copybtn" onClick={copy}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="prompttext">{prompt}</pre>
      {!hasRoleInfo && !customArea && <div className="ideanote">Tip: fill in your job title at the top of this tab and this prompt will use your real role instead of the example.</div>}
    </div>
  );
}

function GoalModal({ onClose, onSave, seed, roleCtx, existing }) {
  const isEdit = !!existing;
  const [comp, setComp] = useState(existing?.comp || seed || "");  // preset competency key, or "custom"
  const [customLabel, setCustomLabel] = useState(existing?.customLabel || "");
  const [typed, setTyped] = useState("");              // what's in the type-your-own box before generating
  const [aiIdeas, setAiIdeas] = useState([]);          // AI-generated goal ideas (custom area OR role-aware mastery)
  const [aiActions, setAiActions] = useState([]);      // AI-generated suggested actions
  const [aiSourced, setAiSourced] = useState(isEdit && existing?.customLabel ? true : false);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [title, setTitle] = useState(existing?.title || "");
  const [desc, setDesc] = useState(existing?.desc || "");
  const [support, setSupport] = useState(existing?.support || "");
  const [due, setDue] = useState(existing?.due || "");
  const [actions, setActions] = useState(existing?.actions || []);
  const [actionTiming, setActionTiming] = useState(existing?.actionTiming || {});
  const [actionDates, setActionDates] = useState(existing?.actionDates || {});
  const [custom, setCustom] = useState("");
  const [showLearning, setShowLearning] = useState(false);

  // When editing a custom-area goal, seed the AI lists so the saved actions still render as toggleable
  useEffect(() => {
    if (isEdit && existing?.customLabel) {
      setAiActions(existing.actions || []);
    }
  }, []);

  const isCustom = comp === "custom";
  // Mastery currently behaves as an ordinary preset (no AI tailoring) until the app's
  // hosting/AI setup is decided. Flip this back to (comp === "mastery") to re-enable.
  const isMastery = false;
  // Build a human description of the person's role from whatever they provided.
  const ctx = roleCtx || {};
  const roleTitle = (ctx.title || "").trim();
  const roleType = (ctx.role || "").trim();
  const hasRoleInfo = !!(roleTitle || roleType);
  const roleName = roleTitle || roleType || "their role";
  const roleContextString = [
    roleTitle ? `Their job title is "${roleTitle}".` : "",
    roleType ? `The closest general role category is "${roleType}".` : "",
  ].filter(Boolean).join(" ");

  // mastery uses AI results once we have them; otherwise its fixed fallback list
  const useAiSource = isCustom || (isMastery && aiSourced);
  const areaLabel = isCustom ? customLabel : (COMPETENCIES[comp]?.label || "");
  const goalIdeas = useAiSource ? aiIdeas : (COMPETENCIES[comp]?.goalIdeas || []);
  const suggestedActions = useAiSource ? aiActions : (COMPETENCIES[comp]?.actions || []);
  // LinkedIn Learning search topics. For custom areas, search the typed area itself.
  // The "technical" competency uses <AREA> as a placeholder for the person's own field.
  const rawLearning = isCustom
    ? (customLabel ? [customLabel] : [])
    : (COMPETENCIES[comp]?.learning || []);
  const learningTopics = rawLearning
    .map((t) => t.replace(/<AREA>/g, (areaLabel || "your field")))
    .filter(Boolean);
  const llUrl = (term) => `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(term)}`;

  useEffect(() => {
    if (comp && !isCustom && !isMastery && COMPETENCIES[comp] && actions.length === 0) {
      setActions(COMPETENCIES[comp].actions.slice(0, 2));
    }
    // mastery with no role info: seed its generic fallback actions
    if (isMastery && !hasRoleInfo && actions.length === 0 && !aiSourced) {
      setActions(COMPETENCIES.mastery.actions.slice(0, 2));
    }
  }, [comp]);

  const toggleAction = (a) =>
    setActions(actions.includes(a) ? actions.filter((x) => x !== a) : [...actions, a]);

  const pickPreset = (k) => {
    if (comp === k) { setComp(""); setActions([]); setAiIdeas([]); setAiActions([]); setAiSourced(false); setCustomLabel(""); setAiError(""); return; }
    setComp(k); setActions([]); setAiIdeas([]); setAiActions([]); setAiSourced(false); setCustomLabel(""); setAiError("");
  };

  // Shared AI generator. `context` is the situation sentence; results land in aiIdeas/aiActions.
  async function generate(context) {
    setLoading(true); setAiError("");
    const prompt = `${context}

Return ONLY valid JSON, no markdown, no preamble, in exactly this shape:
{"goalIdeas":["...","...","..."],"actions":["...","...","..."]}

- goalIdeas: 3 short, first-person goal statements, each under 14 words. Realistic starting points, not stretch goals.
- actions: 3 SPECIFIC, CONCRETE development actions. This is the important part. Name actual, recognized frameworks, models, methodologies, tools, certifications, or named skills that someone in THIS role should learn or practice — not vague advice.
  GOOD examples (note they name specific things): "Learn the GROW model and use it to structure your next coaching conversation", "Study Thomas-Kilmann conflict modes and identify your default style", "Get certified in SHRM-CP", "Practice the STAR method for structured interviews".
  BAD examples (too vague — never produce these): "Improve your coaching skills", "Get better at conflict resolution", "Take a relevant course", "Ask your manager for feedback".
  Each action under 22 words. Tie each to the role's actual domain. If you don't know a specific named framework for something, name a concrete practice or resource instead of staying generic.`;

    const tryOnce = async () => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
      text = text.replace(/```json|```/g, "").trim();
      const first = text.indexOf("{"), last = text.lastIndexOf("}");
      if (first !== -1 && last !== -1) text = text.slice(first, last + 1);
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.goalIdeas) || !Array.isArray(parsed.actions)) throw new Error("Unexpected shape");
      return parsed;
    };

    try {
      let parsed;
      try { parsed = await tryOnce(); }
      catch (e1) { await new Promise((r) => setTimeout(r, 700)); parsed = await tryOnce(); }
      setAiIdeas(parsed.goalIdeas.slice(0, 3));
      const acts = parsed.actions.slice(0, 3);
      setAiActions(acts);
      setActions(acts.slice(0, 2));
      setAiSourced(true);
    } catch (e) {
      setAiError(`Couldn't generate suggestions (${e.message}). You can still type your goal and actions manually below.`);
    } finally {
      setLoading(false);
    }
  }

  async function generateForCustom() {
    const area = typed.trim();
    if (!area) return;
    setComp("custom"); setCustomLabel(area);
    setActions([]); setAiIdeas([]); setAiActions([]); setAiSourced(false);
    await generate(`An employee filling out a professional development plan wants to grow in: "${area}".${roleContextString ? ` For context on who they are: ${roleContextString} Tailor the suggestions to be relevant to both the growth area and their actual role where it makes sense.` : ""}`);
  }

  const missingDates = actions.filter((a) => !actionDates[a]);
  const canSave = (isCustom ? customLabel : comp) && title.trim() && missingDates.length === 0;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalhead">
          <h2 className="serif" style={{ fontSize: "1.3rem", margin: 0 }}>{isEdit ? "Edit focus area" : "New focus area"}</h2>
          <button className="iconbtn" onClick={onClose} style={{ color: "var(--muted)" }}><X size={20} /></button>
        </div>

        <div className="field">
          <label>Area of focus</label>
          <div>
            {Object.entries(COMPETENCIES).map(([k, v]) => (
              <button key={k} className={`chip ${comp === k ? "on" : ""}`} onClick={() => pickPreset(k)}>
                {v.label}
              </button>
            ))}
            {isCustom && customLabel && (
              <button className="chip on" onClick={() => { setComp(""); setCustomLabel(""); setActions([]); setAiIdeas([]); setAiActions([]); setAiSourced(false); }} title="Click to remove this area">
                {customLabel} <X size={12} style={{ verticalAlign: "-1px", marginLeft: 3 }} />
              </button>
            )}
          </div>

          <div className="customrow">
            <div className="ideahead" style={{ color: "var(--accent)", marginBottom: 8 }}>
              <Sparkles size={13} /> Don't see your area? Type your own:
            </div>
            <div className="addaction">
              <input className="input" value={typed} placeholder="e.g. Public speaking, negotiation, data analysis…"
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && typed.trim()) { setComp("custom"); setCustomLabel(typed.trim()); } }} />
              <button className="btn btn-ghost" onClick={() => { if (typed.trim()) { setComp("custom"); setCustomLabel(typed.trim()); } }} style={{ whiteSpace: "nowrap" }}>
                Use this area
              </button>
            </div>
            {(comp === "mastery" || isCustom) && (
              <div className="aihelp">
                <div className="ideahead" style={{ color: "var(--accent-deep)", marginBottom: 4 }}>
                  {isCustom ? `Want ideas for "${customLabel}"?` : "Unsure what to develop in your role?"}
                </div>
                <div className="ideanote" style={{ marginTop: 0, marginBottom: 10 }}>
                  This app doesn't auto-generate ideas, but you can ask an AI assistant (like Claude or ChatGPT). Copy the starter prompt below, tweak it, and bring the ideas back here.
                </div>
                <PromptHelper roleName={roleName} hasRoleInfo={hasRoleInfo} roleContextString={roleContextString} customArea={isCustom ? customLabel : ""} />
              </div>
            )}
          </div>
        </div>

        <div className="field">
          <label>Specific goal</label>
          {goalIdeas.length > 0 && (
            <div className="ideabox">
              <div className="ideahead"><Sparkles size={13} /> Not sure how to phrase it? Start from one of these{isCustom ? ` for ${areaLabel.toLowerCase()}` : ""}:</div>
              {goalIdeas.map((g, i) => (
                <button key={i} className="ideachip" onClick={() => setTitle(g)}>{g}</button>
              ))}
            </div>
          )}
          <input className="input" value={title} placeholder="What do you want to learn or develop?"
            onChange={(e) => setTitle(e.target.value)} />
          {(comp || isCustom) && goalIdeas.length > 0 && <div className="ideanote">Tap one to drop it in, then edit it to sound like you.</div>}
        </div>
        <div className="field">
          <label>What success looks like</label>
          <textarea className="ta" value={desc} placeholder="How will you know you've made progress? e.g. I'm running 1:1s without notes and getting good feedback."
            onChange={(e) => setDesc(e.target.value)} />
        </div>

        {(comp || isCustom) && (suggestedActions.length > 0 || actions.length > 0) && (
          <div className="field">
            <label>Suggested actions <span style={{ fontWeight: 400, color: "var(--muted)" }}>— tap to include</span></label>
            {(() => {
              const extras = actions.filter((a) => !suggestedActions.includes(a));
              const allActions = [...suggestedActions, ...extras];
              return allActions.map((a, i) => {
                const isExtra = extras.includes(a);
                const on = actions.includes(a);
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div className={`opt`} onClick={() => isExtra ? setActions(actions.filter((x) => x !== a)) : toggleAction(a)}
                      style={{ padding: "12px 14px", marginBottom: 0, borderColor: on ? "var(--accent)" : "var(--line)", background: on ? "var(--accent-soft)" : "var(--card)", borderBottomLeftRadius: on ? 0 : 13, borderBottomRightRadius: on ? 0 : 13 }}>
                      {on ? <CheckCircle2 size={18} style={{ color: "var(--accent)" }} /> : <Circle size={18} style={{ color: "var(--muted)" }} />}
                      <span style={{ fontSize: ".88rem", flex: 1 }}>{a}</span>
                      {isExtra && <span className="yourtag">Your own</span>}
                      {isExtra && <Trash2 size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />}
                    </div>
                    {on && (
                      <div className="timingbox" onClick={(e) => e.stopPropagation()}>
                        <div className="timingrow">
                          <span className="timinglabel">Target date <span style={{ color: "var(--gold)" }}>*</span></span>
                          <input type="date" className={`input timinginput ${!actionDates[a] ? "needdate" : ""}`} value={actionDates[a] || ""}
                            onChange={(e) => setActionDates({ ...actionDates, [a]: e.target.value })} />
                        </div>
                        <div className="timingrow" style={{ borderTop: 0, paddingTop: 0 }}>
                          <span className="timinglabel">Note <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></span>
                          <input className="input timinginput" value={actionTiming[a] || ""}
                            placeholder="e.g. ~5 hrs over 2 weeks"
                            onChange={(e) => setActionTiming({ ...actionTiming, [a]: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
            <div className="addaction">
              <input className="input" value={custom} placeholder="Add your own action…"
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && custom.trim() && !actions.includes(custom.trim())) { setActions([...actions, custom.trim()]); setCustom(""); } }} />
              <button className="btn btn-ghost" onClick={() => { const t = custom.trim(); if (t && !actions.includes(t)) { setActions([...actions, t]); setCustom(""); } }}>Add</button>
            </div>
          </div>
        )}

        {(comp || isCustom) && learningTopics.length > 0 && (
          <div className="field">
            <button type="button" className="lltoggle" onClick={() => setShowLearning(!showLearning)}>
              <Compass size={15} style={{ flexShrink: 0, color: "var(--accent-deep)" }} />
              <span style={{ flex: 1, textAlign: "left" }}>Find courses on LinkedIn Learning</span>
              <ChevronRight size={17} style={{ flexShrink: 0, color: "var(--muted)", transform: showLearning ? "rotate(90deg)" : "none", transition: ".2s" }} />
            </button>
            {showLearning && (
              <div style={{ marginTop: 11 }}>
                <div className="ideanote" style={{ marginTop: 0, marginBottom: 10 }}>
                  These open LinkedIn Learning in a new tab with a search already run{isCustom ? ` for "${customLabel}"` : ""} — no need to figure out what to search for.
                </div>
                <div className="lllist">
                  {learningTopics.map((t, i) => (
                    <a key={i} className="llchip" href={llUrl(t)} target="_blank" rel="noopener noreferrer">
                      <Compass size={15} style={{ flexShrink: 0, color: "var(--accent-deep)" }} />
                      <span style={{ flex: 1 }}>{t}</span>
                      <ArrowRight size={14} style={{ flexShrink: 0, color: "var(--muted)" }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="row2">
          <div className="field">
            <label>Support from</label>
            <input className="input" value={support} placeholder="e.g. my manager, a mentor"
              onChange={(e) => setSupport(e.target.value)} />
          </div>
          <div className="field">
            <label>Overall target date <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" value={due} placeholder="e.g. End of Q3"
              onChange={(e) => setDue(e.target.value)} />
          </div>
        </div>

        {actions.length > 0 && missingDates.length > 0 && (
          <div className="ideanote" style={{ color: "var(--gold)", marginBottom: 10 }}>
            Add a target date for {missingDates.length === actions.length ? "each action" : `${missingDates.length} more ${missingDates.length === 1 ? "action" : "actions"}`} to save.
          </div>
        )}

        <button className="btn btn-primary" disabled={!canSave} style={{ width: "100%", justifyContent: "center", opacity: canSave ? 1 : .5 }}
          onClick={() => {
            // keep timing/dates only for actions that are still selected
            const cleanTiming = {}, cleanDates = {};
            actions.forEach((a) => { if (actionTiming[a]) cleanTiming[a] = actionTiming[a]; if (actionDates[a]) cleanDates[a] = actionDates[a]; });
            const base = {
              comp,
              customLabel: isCustom ? customLabel : (existing?.customLabel || ""),
              title: title.trim(),
              desc: desc.trim(),
              support, due, actions,
              actionTiming: cleanTiming,
              actionDates: cleanDates,
            };
            if (isEdit) {
              // preserve progress-related fields from the original goal
              onSave({ ...existing, ...base });
            } else {
              onSave({ id: uid(), ...base, status: "notStarted" });
            }
          }}>
          {isEdit ? "Save changes" : "Add to my plan"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- TRACK ---------------- */
function Track({ goals, setGoals, profile, onStart }) {
  const [showArchive, setShowArchive] = useState(false);
  if (goals.length === 0) {
    return (
      <div>
        <div className="eyebrow">Progress</div>
        <h1 className="title">Nothing to track yet</h1>
        <p className="lede">Once you've added focus areas to your plan, this is where you'll watch them move from idea to done.</p>
        <button className="btn btn-primary" onClick={onStart}><Target size={16} /> Go to my plan</button>
      </div>
    );
  }

  const total = goals.length;
  const done = goals.filter((g) => g.status === "done").length;
  const active = goals.filter((g) => g.status === "inProgress").length;
  const held = goals.filter((g) => g.status === "onHold").length;
  const pct = Math.round((done / total) * 100);
  // weighted momentum: done=1, inProgress=0.5, onHold/notStarted=0
  const momentum = Math.round(((done + active * 0.5) / total) * 100);
  const activeDash = goals.filter((g) => g.status !== "done");
  const completedDash = goals.filter((g) => g.status === "done");

  // Build a flat, chronologically sorted timeline of every dated action across all goals
  const timeline = [];
  goals.forEach((g) => {
    const dates = g.actionDates || {};
    const checked = g.checkedActions || [];
    (g.actions || []).forEach((a) => {
      if (dates[a]) timeline.push({
        goalId: g.id,
        area: g.customLabel || COMPETENCIES[g.comp]?.label || g.comp,
        action: a,
        date: dates[a],
        completed: checked.includes(a),
        note: (g.actionTiming || {})[a] || "",
      });
    });
  });
  timeline.sort((x, y) => parseDate(x.date) - parseDate(y.date));
  const overdueCount = timeline.filter((t) => !t.completed && daysUntil(t.date) < 0).length;

  return (
    <div>
      <div className="eyebrow">Progress{profile.name ? ` · ${profile.name.split(" ")[0]}` : ""}</div>
      <h1 className="title">Your development at a glance</h1>
      <p className="lede">{profile.vision || "A snapshot of where your focus areas stand right now."}</p>

      <div className="statgrid">
        <div className="stat"><div className="statnum">{total}</div><div className="statlabel">Focus areas</div></div>
        <div className="stat"><div className="statnum">{active}</div><div className="statlabel">In progress</div></div>
        <div className="stat"><div className="statnum">{done}</div><div className="statlabel">Completed</div></div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 600, fontSize: ".92rem" }}>Overall momentum</span>
          <span className="serif" style={{ fontSize: "1.6rem", color: "var(--accent-deep)" }}>{momentum}%</span>
        </div>
        <div className="bar"><div className="barfill" style={{ width: `${momentum}%` }} /></div>
        <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 9 }}>
          {pct === 100 ? "Every focus area complete — time to set new ones." :
           momentum === 0 ? "Nothing started yet. Pick one area and take the first action this week." :
           "Counting completed areas plus partial credit for what's underway."}
          {held > 0 && <span style={{ color: "var(--gold)" }}> · {held} on hold</span>}
        </div>
      </div>

      {timeline.length > 0 && (
        <div className="card" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
            <h2 className="serif" style={{ fontSize: "1.1rem", margin: 0 }}>Action timeline</h2>
            {overdueCount > 0 && <span style={{ fontSize: ".8rem", fontWeight: 600, color: "#c0392b" }}>{overdueCount} overdue</span>}
          </div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: 16 }}>Every action with a target date, soonest first.</div>
          <div className="timeline">
            {timeline.map((t, i) => {
              const ds = dateStatus(t.date, t.completed);
              return (
                <div className="tlitem" key={i}>
                  <div className={`tldot ${t.completed ? "done" : ds?.kind || ""}`}>
                    {t.completed && <Check size={11} strokeWidth={3} />}
                  </div>
                  <div className="tlbody">
                    <div className="tldate">{fmtDate(t.date)}</div>
                    <div className={`tlaction ${t.completed ? "tldone" : ""}`}>{t.action}</div>
                    <div className="tlmeta">
                      <span className="tlarea">{t.area}</span>
                      {ds && !t.completed && <span className={`tlbadge ${ds.kind}`}>{ds.label}</span>}
                      {t.completed && <span className="tlbadge done">Done</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="serif" style={{ fontSize: "1.1rem", margin: "0 0 6px" }}>By focus area</h2>
        <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: 4 }}>Click a goal to check off actions and add progress notes.</div>
        {activeDash.length === 0 && <div style={{ fontSize: ".88rem", color: "var(--muted)", padding: "10px 0" }}>No active focus areas — nice work clearing the deck, or head to My plan to add one.</div>}
        {activeDash.map((g) => (
          <DashRow key={g.id} goal={g}
            onUpdate={(patch) => setGoals(goals.map((x) => x.id === g.id ? { ...x, ...patch } : x))} />
        ))}
      </div>

      {completedDash.length > 0 && (
        <div className="card" style={{ marginTop: 22 }}>
          <button className="archivehead" onClick={() => setShowArchive(!showArchive)}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
              <h2 className="serif" style={{ fontSize: "1.1rem", margin: 0 }}>Completed</h2>
              <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>({completedDash.length})</span>
            </div>
            <ChevronRight size={18} style={{ color: "var(--muted)", transform: showArchive ? "rotate(90deg)" : "none", transition: ".2s" }} />
          </button>
          {showArchive && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: 10 }}>Your record of growth — areas you've already mastered.</div>
              {completedDash.map((g) => (
                <DashRow key={g.id} goal={g}
                  onUpdate={(patch) => setGoals(goals.map((x) => x.id === g.id ? { ...x, ...patch } : x))} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DashRow({ goal, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const st = STATUS[goal.status] || STATUS.notStarted;
  const StIcon = st.icon;
  const checked = goal.checkedActions || [];
  const hasActions = goal.actions && goal.actions.length > 0;

  // progress ring reflects checked actions when there are any, else status
  const actionPct = hasActions ? Math.round((checked.length / goal.actions.length) * 100) : null;
  const val = goal.status === "done" ? 100
    : actionPct !== null && actionPct > 0 ? actionPct
    : goal.status === "inProgress" ? 50 : 8;

  const toggleAction = (a) => {
    const next = checked.includes(a) ? checked.filter((x) => x !== a) : [...checked, a];
    // auto-advance status as actions get checked — but never override a manual "On hold"
    let status = goal.status;
    if (hasActions && status !== "onHold") {
      if (next.length === goal.actions.length) status = "done";
      else if (next.length > 0 && status === "notStarted") status = "inProgress";
    }
    onUpdate({ checkedActions: next, status });
  };

  const noteLog = goal.noteLog || [];
  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const entry = {
      id: uid(),
      text,
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      ts: Date.now(),
    };
    onUpdate({ noteLog: [entry, ...noteLog] });
    setDraft("");
  };
  const deleteNote = (id) => onUpdate({ noteLog: noteLog.filter((n) => n.id !== id) });

  return (
    <div className="dashrow-wrap">
      <div className="dashgoal" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <Ring pct={val} color={st.color} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: ".94rem" }}>{goal.title}</div>
          <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            {goal.customLabel || COMPETENCIES[goal.comp]?.label}{goal.due ? ` · ${goal.due}` : ""}
            {hasActions ? ` · ${checked.length}/${goal.actions.length} actions` : ""}
          </div>
        </div>
        <StatusDropdown status={goal.status} onChange={(s) => onUpdate({ status: s })} />
        <ChevronRight size={18} style={{ color: "var(--muted)", transform: open ? "rotate(90deg)" : "none", transition: ".2s", flexShrink: 0 }} />
      </div>

      {open && (
        <div className="dashpanel">
          {hasActions ? (
            <>
              <div className="panellabel">Actions</div>
              {goal.actions.map((a, i) => (
                <div className="checkrow" key={i} onClick={() => toggleAction(a)}>
                  {checked.includes(a)
                    ? <CheckCircle2 size={18} style={{ color: "var(--success)", flexShrink: 0 }} />
                    : <Circle size={18} style={{ color: "var(--muted)", flexShrink: 0 }} />}
                  <span style={{ fontSize: ".88rem", textDecoration: checked.includes(a) ? "line-through" : "none", color: checked.includes(a) ? "var(--muted)" : "var(--ink)" }}>
                    {a}
                    {goal.actionDates?.[a] && <span className="actiondate">{fmtDate(goal.actionDates[a])}</span>}
                    {goal.actionTiming?.[a] && <span className="actiontiming">{goal.actionTiming[a]}</span>}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="panellabel" style={{ fontWeight: 400, color: "var(--muted)" }}>No actions were added for this goal. You can add them back on the My plan tab.</div>
          )}

          <div className="panellabel" style={{ marginTop: 14 }}>Progress notes</div>
          <div className="noteadd">
            <textarea className="ta" value={draft} placeholder="Add a progress note — a win, a blocker, or something to raise with your manager."
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span className="ideanote" style={{ margin: 0 }}>Dated automatically when you add it. {draft.trim() ? "⌘/Ctrl + Enter to save." : ""}</span>
              <button className="btn btn-primary" onClick={addNote} disabled={!draft.trim()} style={{ opacity: draft.trim() ? 1 : .5, padding: "8px 14px" }}>
                <Plus size={15} /> Add note
              </button>
            </div>
          </div>

          {noteLog.length > 0 && (
            <div className="notelog">
              {noteLog.map((n) => (
                <div className="noteentry" key={n.id}>
                  <div className="notedate">{n.date}</div>
                  <div className="notetext">{n.text}</div>
                  <button className="iconbtn" onClick={() => deleteNote(n.id)} title="Delete note"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Ring({ pct, color }) {
  const r = 16, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
  return (
    <svg className="ring" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
      <circle cx="21" cy="21" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 21 21)" style={{ transition: "stroke-dashoffset .6s" }} />
    </svg>
  );
}

/* ---------------- REFLECT ---------------- */
const REFLECT_PROMPTS = [
  "What's felt harder than expected?",
  "Where am I growing?",
  "What's energizing me, and what's draining me?",
  "What am I proud of recently?",
];

function Reflect({ reflections, setReflections }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    const entry = {
      id: uid(),
      text,
      date: new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      ts: Date.now(),
    };
    setReflections([entry, ...reflections]);
    setDraft("");
  };
  const remove = (id) => setReflections(reflections.filter((r) => r.id !== id));

  return (
    <div>
      <div className="eyebrow">Notes &amp; reflection</div>
      <h1 className="title">Think out loud</h1>
      <p className="lede">A space for the bigger picture — anything that isn't tied to one specific goal. Jot a quick reflection whenever something occurs to you. Each entry is dated so you can look back over time.</p>

      <div className="card" style={{ marginBottom: 26 }}>
        <div className="reflprompts">
          <span className="panellabel" style={{ margin: 0 }}>A few things to think about:</span>
          {REFLECT_PROMPTS.map((p) => <span key={p} className="promptline">{p}</span>)}
        </div>
        <textarea className="ta" style={{ minHeight: 110, marginTop: 14 }} value={draft}
          placeholder="What's on your mind about your growth right now?"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add(); }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <span className="ideanote" style={{ margin: 0 }}>{draft.trim() ? "⌘/Ctrl + Enter to save." : "Dated automatically when you save."}</span>
          <button className="btn btn-primary" onClick={add} disabled={!draft.trim()} style={{ opacity: draft.trim() ? 1 : .5 }}>
            <Plus size={16} /> Save reflection
          </button>
        </div>
      </div>

      <h2 className="serif" style={{ fontSize: "1.3rem", margin: "0 0 14px" }}>
        Your reflections {reflections.length > 0 && <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "1rem" }}>({reflections.length})</span>}
      </h2>

      {reflections.length === 0 ? (
        <div className="empty">
          <NotebookPen size={28} style={{ color: "var(--gold)" }} />
          <div className="serif">Nothing here yet</div>
          <p style={{ margin: "0 auto", maxWidth: 360, fontSize: ".9rem", lineHeight: 1.5 }}>
            Your reflections will collect here as a dated journal. Even a sentence a week adds up to a clear picture of your growth.
          </p>
        </div>
      ) : reflections.map((r) => (
        <div className="reflcard" key={r.id}>
          <div className="reflhead">
            <span className="refldate">{r.date}</span>
            {r.prompt && <span className="reflprompt">{r.prompt}</span>}
            <button className="iconbtn" onClick={() => remove(r.id)} title="Delete" style={{ marginLeft: "auto" }}><Trash2 size={15} /></button>
          </div>
          <div className="refltext">{r.text}</div>
        </div>
      ))}
    </div>
  );
}
