const STORAGE_KEY = "inner-room-journal-v1";
const VALUES_KEY = "inner-room-values-v1";
const GROWTH_KEY = "inner-room-growth-v1";
const CBT_KEY = "inner-room-cbt-v1";
const COMPANION_KEY = "inner-room-companion-v1";
const sketchColors = ["#20242b", "#c66a54", "#d5a642", "#35695a", "#486c97", "#7b4fa3"];
let companionExamples = [];

const prompts = [
  "What feeling has been asking for more space today?",
  "What did I need today that I did not know how to ask for?",
  "Where did my body feel tense, open, heavy, or calm?",
  "What story am I telling myself, and what is another possible story?",
  "What boundary, request, or kindness would make tomorrow easier?",
  "What am I proud of that I almost forgot to count?"
];

const patternCheckItems = [
  { id: "low_mood", group: "mood", label: "Low, flat, or tearful more often than usual" },
  { id: "irritable", group: "mood", label: "More irritable or easily frustrated" },
  { id: "worry", group: "worry", label: "Worry that is hard to switch off" },
  { id: "avoidance", group: "worry", label: "Avoiding things because they feel too much" },
  { id: "poor_sleep", group: "sleep", label: "Trouble falling asleep or staying asleep" },
  { id: "oversleeping", group: "sleep", label: "Sleeping much more than usual" },
  { id: "low_energy", group: "energy", label: "Very low energy or difficulty starting" },
  { id: "restless", group: "energy", label: "Restless, tense, or unable to slow down" },
  { id: "disconnected", group: "connection", label: "Pulling away from people or feeling disconnected" },
  { id: "unsupported", group: "connection", label: "Feeling unseen, unsupported, or alone" },
  { id: "focus", group: "daily life", label: "Harder to focus, decide, or finish ordinary tasks" },
  { id: "joy", group: "daily life", label: "Less interest or joy in things that usually matter" },
  { id: "self_criticism", group: "self-talk", label: "Harsh self-criticism or feeling not good enough" },
  { id: "body", group: "body", label: "Frequent tension, headaches, stomach discomfort, or racing heart" },
  { id: "substances", group: "coping", label: "Using alcohol, food, screens, or other habits to escape more often" },
  { id: "self_harm", group: "safety", label: "Thoughts of hurting myself or not wanting to be here" }
];

const valueAreas = [
  {
    key: "relationships",
    label: "Relationships",
    question: "What kind of friend, partner, family member do you want to be?"
  },
  {
    key: "work",
    label: "Work & Career",
    question: "What do you want to contribute or achieve?"
  },
  {
    key: "health",
    label: "Health",
    question: "How do you want to treat your body and mind?"
  },
  {
    key: "growth",
    label: "Personal Growth",
    question: "What kind of person do you want to become?"
  },
  {
    key: "leisure",
    label: "Fun & Leisure",
    question: "What brings you genuine joy?"
  }
];

const valueWords = {
  connection: ["friend", "partner", "family", "together", "close", "listen", "support", "belong", "love"],
  creativity: ["create", "art", "write", "make", "imagine", "music", "design", "original"],
  courage: ["brave", "risk", "truth", "honest", "speak", "try", "fear", "bold"],
  growth: ["learn", "grow", "better", "become", "practice", "improve", "curious"],
  health: ["body", "mind", "sleep", "exercise", "rest", "nourish", "balance"],
  freedom: ["free", "choice", "independent", "space", "adventure", "open"],
  kindness: ["kind", "gentle", "care", "warm", "compassion", "patient"],
  purpose: ["meaning", "contribute", "serve", "impact", "achieve", "work", "career"],
  joy: ["joy", "fun", "play", "laugh", "leisure", "delight", "pleasure"],
  stability: ["stable", "secure", "safe", "steady", "calm", "grounded"]
};

const moodGroups = [
  {
    title: "Positive · High energy",
    moods: [
      { key: "happy", label: "Happy", icon: "😊", tone: 8 },
      { key: "excited", label: "Excited", icon: "⚡", tone: 9 },
      { key: "proud", label: "Proud", icon: "🌟", tone: 8 },
      { key: "curious", label: "Curious", icon: "🔎", tone: 6 },
      { key: "playful", label: "Playful", icon: "✨", tone: 8 }
    ]
  },
  {
    title: "Positive · Low energy",
    moods: [
      { key: "calm", label: "Calm", icon: "😌", tone: 7 },
      { key: "peaceful", label: "Peaceful", icon: "🕊️", tone: 8 },
      { key: "grateful", label: "Grateful", icon: "🙏", tone: 8 },
      { key: "loved", label: "Loved", icon: "💛", tone: 8 },
      { key: "hopeful", label: "Hopeful", icon: "🌤️", tone: 7 }
    ]
  },
  {
    title: "Negative · High energy",
    moods: [
      { key: "anxious", label: "Anxious", icon: "😟", tone: 3 },
      { key: "angry", label: "Angry", icon: "😠", tone: 3 },
      { key: "frustrated", label: "Frustrated", icon: "😤", tone: 4 },
      { key: "stressed", label: "Stressed", icon: "😣", tone: 3 },
      { key: "overwhelmed", label: "Overwhelmed", icon: "🫨", tone: 2 }
    ]
  },
  {
    title: "Negative · Low energy",
    moods: [
      { key: "sad", label: "Sad", icon: "😢", tone: 2 },
      { key: "lonely", label: "Lonely", icon: "🥺", tone: 2 },
      { key: "tired", label: "Tired", icon: "😴", tone: 3 },
      { key: "ashamed", label: "Ashamed", icon: "🙈", tone: 2 },
      { key: "numb", label: "Numb", icon: "◌", tone: 3 }
    ]
  }
];
const moods = moodGroups.flatMap((group) => group.moods);

const emotionLexicon = {
  anxious: ["anxious", "worried", "panic", "scared", "fear", "nervous", "overwhelmed", "stress", "uncertain", "unsafe"],
  sad: ["sad", "lonely", "grief", "hurt", "empty", "cry", "depressed", "tired", "miss", "lost"],
  angry: ["angry", "mad", "resent", "unfair", "frustrated", "irritated", "annoyed", "betrayed"],
  ashamed: ["ashamed", "guilty", "embarrassed", "failure", "not enough", "stupid", "worthless", "bad person"],
  tender: ["love", "care", "touched", "soft", "vulnerable", "close", "connection"],
  hopeful: ["hope", "better", "proud", "grateful", "relieved", "calm", "excited", "possible", "progress"]
};

const needLexicon = {
  safety: ["safe", "secure", "stable", "calm", "protected", "space"],
  clarity: ["confused", "unclear", "decide", "decision", "understand", "why"],
  connection: ["alone", "lonely", "ignored", "seen", "heard", "friend", "partner", "family"],
  rest: ["tired", "exhausted", "sleep", "burnout", "drained", "rest"],
  boundaries: ["boundary", "no", "too much", "pressure", "should", "have to", "expect"],
  agency: ["stuck", "trapped", "control", "choice", "freedom", "powerless"]
};

const distortionLexicon = {
  "All-or-nothing thinking": {
    words: ["always", "never", "everything", "nothing", "ruined", "impossible"],
    example: "everything is ruined"
  },
  "Catastrophising": {
    words: ["worst", "disaster", "terrible", "can't handle", "cannot handle", "fall apart", "end of", "never recover"],
    example: "this is the worst possible outcome"
  },
  "Mind reading": {
    words: ["they think", "everyone thinks", "she thinks", "he thinks", "they must", "probably hates", "judge me"],
    example: "they must think badly of me"
  },
  "Personalisation": {
    words: ["my fault", "because of me", "i caused", "i ruined", "i made them", "all on me"],
    example: "this is my fault"
  },
  "Should statements": {
    words: ["should", "must", "have to", "need to be", "supposed to"],
    example: "I should be better than this"
  },
  "Overgeneralisation": {
    words: ["always happens", "every time", "nothing works", "never works", "everyone always", "this always"],
    example: "this always happens to me"
  }
};

const state = {
  entries: [],
  currentId: null,
  selectedTags: new Set(),
  selectedMood: "calm",
  valuesProfile: null,
  valuesMode: "onboarding",
  valuesStep: 0,
  pendingDailyAnswer: "",
  growthProfile: null,
  growthMode: "home",
  growthStep: 0,
  growthDraft: {},
  cbtMode: "home",
  cbtStep: 0,
  cbtDraft: {},
  cbtProfile: null,
  companionProfile: null,
  pendingDailySketch: ""
};

const entryList = document.querySelector("#entryList");
const entryText = document.querySelector("#entryText");
const moodOptions = document.querySelector("#moodOptions");
const replyBody = document.querySelector("#replyBody");
const currentDate = document.querySelector("#currentDate");
const entryTitle = document.querySelector("#entryTitle");
const promptDialog = document.querySelector("#promptDialog");
const promptGrid = document.querySelector("#promptGrid");
const deleteDialog = document.querySelector("#deleteDialog");
const deleteSummary = document.querySelector("#deleteSummary");
const valuesDialog = document.querySelector("#valuesDialog");
const valuesTitle = document.querySelector("#valuesTitle");
const valuesPrompt = document.querySelector("#valuesPrompt");
const valuesInput = document.querySelector("#valuesInput");
const valuesNextButton = document.querySelector("#valuesNextButton");
const dailyValuesButton = document.querySelector("#dailyValuesButton");
const weeklyValuesButton = document.querySelector("#weeklyValuesButton");
const growthDialog = document.querySelector("#growthDialog");
const growthTitle = document.querySelector("#growthTitle");
const growthPrompt = document.querySelector("#growthPrompt");
const growthInput = document.querySelector("#growthInput");
const growthNextButton = document.querySelector("#growthNextButton");
const dailyGrowthButton = document.querySelector("#dailyGrowthButton");
const monthlyGrowthButton = document.querySelector("#monthlyGrowthButton");
const cbtDialog = document.querySelector("#cbtDialog");
const cbtTitle = document.querySelector("#cbtTitle");
const cbtPrompt = document.querySelector("#cbtPrompt");
const cbtInput = document.querySelector("#cbtInput");
const cbtNextButton = document.querySelector("#cbtNextButton");
const patternCheckDialog = document.querySelector("#patternCheckDialog");
const patternCheckGrid = document.querySelector("#patternCheckGrid");
const patternCheckResult = document.querySelector("#patternCheckResult");
const openingPromptCategory = document.querySelector("#openingPromptCategory");
const openingPromptText = document.querySelector("#openingPromptText");
const entrySketchPad = createSketchPad(document.querySelector("#entrySketchCanvas"));
const valuesSketchPad = createSketchPad(document.querySelector("#valuesSketchCanvas"));
const growthSketchPad = createSketchPad(document.querySelector("#growthSketchCanvas"));
const cbtSketchPad = createSketchPad(document.querySelector("#cbtSketchCanvas"));

function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  state.entries = raw ? JSON.parse(raw) : [];
  state.entries.forEach(migrateEntryMood);
  if (!state.entries.length) {
    createEntry();
  } else {
    state.currentId = state.entries[0].id;
    loadCurrentEntry();
  }
  renderList();
}

function loadValuesProfile() {
  const raw = localStorage.getItem(VALUES_KEY);
  state.valuesProfile = raw ? JSON.parse(raw) : {
    complete: false,
    answers: {},
    coreValues: [],
    dailyCheckIns: [],
    sketches: {},
    lastDailyPromptDate: "",
    lastWeeklyReflectionDate: ""
  };
  state.valuesProfile.answers ||= {};
  state.valuesProfile.coreValues ||= [];
  state.valuesProfile.dailyCheckIns ||= [];
  state.valuesProfile.sketches ||= {};
  state.valuesProfile.lastDailyPromptDate ||= "";
  state.valuesProfile.lastWeeklyReflectionDate ||= "";
}

function saveValuesProfile() {
  localStorage.setItem(VALUES_KEY, JSON.stringify(state.valuesProfile));
}

function loadGrowthProfile() {
  const raw = localStorage.getItem(GROWTH_KEY);
  state.growthProfile = raw ? JSON.parse(raw) : {
    entries: [],
    lastDailyPromptDate: "",
    lastMonthlyReportMonth: ""
  };
  state.growthProfile.entries ||= [];
  state.growthProfile.lastDailyPromptDate ||= "";
  state.growthProfile.lastMonthlyReportMonth ||= "";
}

function saveGrowthProfile() {
  localStorage.setItem(GROWTH_KEY, JSON.stringify(state.growthProfile));
}

function loadCbtProfile() {
  const raw = localStorage.getItem(CBT_KEY);
  state.cbtProfile = raw ? JSON.parse(raw) : { records: [] };
  state.cbtProfile.records ||= [];
}

function saveCbtProfile() {
  localStorage.setItem(CBT_KEY, JSON.stringify(state.cbtProfile));
}

function loadCompanionProfile() {
  const raw = localStorage.getItem(COMPANION_KEY);
  const previous = raw ? JSON.parse(raw) : {};
  state.companionProfile = {
    askedQuestions: previous.askedQuestions || []
  };
  saveCompanionProfile();
}

function saveCompanionProfile() {
  localStorage.setItem(COMPANION_KEY, JSON.stringify(state.companionProfile));
}

async function loadCompanionExamples() {
  try {
    const response = await fetch("training_data.json?v=16", { cache: "no-store" });
    if (!response.ok) return;
    companionExamples = await response.json();
  } catch {
    companionExamples = [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function createEntry() {
  const now = new Date();
  const entry = {
    id: crypto.randomUUID(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    mood: 5,
    moodKey: "calm",
    text: "",
    tags: [],
    reply: "",
    sketch: ""
  };
  state.entries.unshift(entry);
  state.currentId = entry.id;
  state.selectedTags = new Set();
  state.selectedMood = entry.moodKey;
  persist();
  loadCurrentEntry();
  renderList();
}

function currentEntry() {
  return state.entries.find((entry) => entry.id === state.currentId);
}

function moodFromKey(key) {
  return moods.find((mood) => mood.key === key) || moods.find((mood) => mood.key === "calm");
}

function moodFromLegacyNumber(value) {
  if (value <= 2) return "sad";
  if (value <= 4) return "stressed";
  if (value <= 6) return "calm";
  if (value <= 8) return "hopeful";
  return "happy";
}

function migrateEntryMood(entry) {
  if (!entry.moodKey) {
    entry.moodKey = moodFromLegacyNumber(Number(entry.mood || 5));
  }
  entry.mood = moodFromKey(entry.moodKey).tone;
}

function loadCurrentEntry() {
  const entry = currentEntry();
  if (!entry) return;

  const date = new Date(entry.createdAt);
  currentDate.textContent = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  entryTitle.textContent = entry.text.trim().split(/\s+/).slice(0, 5).join(" ") || "Today";
  entryText.value = entry.text;
  state.selectedMood = entry.moodKey || "calm";
  renderMoodOptions();
  state.selectedTags = new Set(entry.tags);
  updateTagButtons();
  renderReply(entry.reply);
  entrySketchPad.load(entry.sketch);
}

function saveCurrentEntry() {
  const entry = currentEntry();
  if (!entry) return;
  entry.text = entryText.value.trim();
  entry.moodKey = state.selectedMood;
  entry.mood = moodFromKey(state.selectedMood).tone;
  entry.tags = [...state.selectedTags];
  entry.sketch = entrySketchPad.data();
  entry.updatedAt = new Date().toISOString();
  persist();
  loadCurrentEntry();
  renderList();
}

function renderList() {
  entryList.innerHTML = "";
  state.entries.forEach((entry) => {
    const button = document.createElement("button");
    button.className = `entry-item${entry.id === state.currentId ? " active" : ""}`;
    button.type = "button";
    button.setAttribute("role", "listitem");
    button.addEventListener("click", () => {
      saveCurrentEntry();
      state.currentId = entry.id;
      loadCurrentEntry();
      renderList();
    });

    const title = document.createElement("strong");
    title.textContent = entry.text.trim().split(/\s+/).slice(0, 7).join(" ") || "Untitled entry";

    const meta = document.createElement("span");
    const date = new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const mood = moodFromKey(entry.moodKey);
    meta.textContent = `${date} | ${mood.icon} ${mood.label}`;

    button.append(title, meta);
    entryList.append(button);
  });
}

function renderMoodOptions() {
  moodOptions.innerHTML = "";
  moodGroups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "mood-group";

    const title = document.createElement("div");
    title.className = "mood-group-title";
    title.textContent = group.title;

    const grid = document.createElement("div");
    grid.className = "mood-options";

    group.moods.forEach((mood) => {
      const button = document.createElement("button");
      button.className = `mood-option${mood.key === state.selectedMood ? " selected" : ""}`;
      button.type = "button";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", mood.key === state.selectedMood ? "true" : "false");
      button.dataset.mood = mood.key;
      button.addEventListener("click", () => {
        state.selectedMood = mood.key;
        renderMoodOptions();
      });

      const icon = document.createElement("span");
      icon.className = "mood-icon";
      icon.textContent = mood.icon;

      const label = document.createElement("span");
      label.className = "mood-label";
      label.textContent = mood.label;

      button.append(icon, label);
      grid.append(button);
    });

    section.append(title, grid);
    moodOptions.append(section);
  });
}

function deleteCurrentEntry() {
  const entry = currentEntry();
  if (!entry) return;

  state.entries = state.entries.filter((item) => item.id !== entry.id);
  if (!state.entries.length) {
    createEntry();
    return;
  }

  state.currentId = state.entries[0].id;
  state.selectedTags = new Set();
  persist();
  loadCurrentEntry();
  renderList();
}

function openDeleteDialog() {
  saveCurrentEntry();
  const entry = currentEntry();
  if (!entry) return;

  const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric"
  });
  const title = entry.text.trim().split(/\s+/).slice(0, 8).join(" ") || "Untitled entry";
  deleteSummary.textContent = `Delete "${title}" from ${date}? This cannot be undone.`;
  deleteDialog.showModal();
}

function updateTagButtons() {
  document.querySelectorAll(".tag-button").forEach((button) => {
    button.classList.toggle("selected", state.selectedTags.has(button.dataset.tag));
  });
}

function renderReply(reply) {
  replyBody.innerHTML = "";
  if (!reply) {
    const p = document.createElement("p");
    p.textContent = "When you are ready, write a few lines and ask for a reply. I will respond with warmth, reflection, and a grounded question.";
    replyBody.append(p);
    return;
  }
  reply.split("\n\n").forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    replyBody.append(p);
  });
}

function countMatches(text, words) {
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function rankedMatches(text, lexicon) {
  return Object.entries(lexicon)
    .map(([name, value]) => {
      const words = Array.isArray(value) ? value : value.words;
      return { name, score: countMatches(text, words), value };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function likelyDistortion(text) {
  const matches = rankedMatches(text, distortionLexicon);
  return matches[0]?.name || "Should statements";
}

function entryHistoryInsight(entry) {
  const previous = state.entries
    .filter((item) => item.id !== entry.id && item.text)
    .slice(0, 4);
  if (!previous.length) return "";

  const averageMood = previous.reduce((sum, item) => sum + Number(item.mood || 5), 0) / previous.length;
  const delta = entry.mood - averageMood;
  if (delta <= -2) {
    return "Compared with your recent entries, today seems noticeably heavier. That does not mean you are going backwards; it may mean something important is asking for care.";
  }
  if (delta >= 2) {
    return "Compared with your recent entries, there is more lift here. It might be useful to notice what conditions helped that happen.";
  }
  return "This sits close to the emotional range of your recent entries, so the pattern may be less about one event and more about a recurring need.";
}

function sentenceFromEntry(text) {
  const sentence = text
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 24 && part.length < 180)[0];
  return sentence ? `One line stands out to me: "${sentence}."` : "";
}

function containsCrisisLanguage(text) {
  return [
    "kill myself",
    "hurt myself",
    "end my life",
    "suicide",
    "don't want to live",
    "do not want to live",
    "hurt someone"
  ].some((phrase) => text.includes(phrase));
}

function recentEntryContext(entry) {
  return state.entries
    .filter((item) => item.id !== entry.id && item.text)
    .slice(0, 5);
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function wordsFrom(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
  );
}

function detectMoodForExamples(entry, signal) {
  const mood = moodFromKey(entry.moodKey).label.toLowerCase();
  if (["sad", "lonely", "ashamed", "numb"].includes(entry.moodKey)) return "sad";
  if (["anxious", "stressed", "overwhelmed"].includes(entry.moodKey)) return "anxious";
  if (["angry", "frustrated"].includes(entry.moodKey)) return "angry";
  if (["tired"].includes(entry.moodKey)) return "burned out";
  if (["happy", "hopeful", "grateful", "proud", "excited", "peaceful", "loved", "calm", "playful"].includes(entry.moodKey)) return "happy";
  if (signal === "values") return "lost";
  return mood || "lost";
}

function findCompanionExample(entry, signal) {
  if (!companionExamples.length) return null;
  const targetMood = detectMoodForExamples(entry, signal);
  const entryWords = wordsFrom(entry.text);
  const pool = companionExamples.filter((example) => example.mood === targetMood);
  const candidates = pool.length ? pool : companionExamples;

  return candidates
    .map((example) => {
      const exampleWords = wordsFrom(example.entry);
      let overlap = 0;
      entryWords.forEach((word) => {
        if (exampleWords.has(word)) overlap += 1;
      });
      return { example, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)[0]?.example || null;
}

function splitExampleReply(reply) {
  const parts = reply.match(/[^.!?]+[.!?]/g)?.map((part) => part.trim()) || [reply.trim()];
  const question = parts.find((part) => part.endsWith("?")) || "What feels most important to understand about this?";
  const statements = parts.filter((part) => !part.endsWith("?"));
  return {
    opening: statements[0] || "This sounds like it mattered more than you wanted it to.",
    middle: statements[1] || "There may be something here worth meeting with more gentleness.",
    question
  };
}

function selectFreshQuestion(candidates) {
  const asked = state.companionProfile.askedQuestions;
  const question = candidates.find((item) => !asked.includes(item)) || candidates[candidates.length - 1];
  asked.push(question);
  state.companionProfile.askedQuestions = asked.slice(-80);
  saveCompanionProfile();
  return question;
}

function inferCompanionSignal(text) {
  if (includesAny(text, ["failed", "failure", "mistake", "messed up", "not good enough", "stupid", "can't do", "cannot do"])) {
    return "growth";
  }
  if (includesAny(text, ["lost", "conflicted", "don't know what i want", "do not know what i want", "meaning", "what matters", "purpose", "stuck"])) {
    return "values";
  }
  if (includesAny(text, ["always", "never", "everyone", "nothing", "everything", "should", "must", "worst", "my fault", "they think"])) {
    return "thought";
  }
  return "feeling";
}

function recurringPattern(entry, context) {
  const current = entry.text.toLowerCase();
  const recent = context.map((item) => item.text.toLowerCase()).join(" ");
  const emotions = rankedMatches(current, emotionLexicon);
  const top = emotions[0]?.name;
  if (top && countMatches(recent, emotionLexicon[top]) > 1) {
    return `This seems connected to a feeling that has visited more than once lately: ${top}.`;
  }
  const needs = rankedMatches(current, needLexicon);
  const need = needs[0]?.name;
  if (need && countMatches(recent, needLexicon[need]) > 1) {
    return `There may be a repeated pull toward ${need} showing up across your recent entries.`;
  }
  return "";
}

function aliveDetail(entry) {
  const sentences = entry.text
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 18);
  return sentences.sort((a, b) => {
    const aScore = (a.match(/\b(when|said|looked|sat|smiled|text|call|room|door|table|laugh|quiet|wait)\b/gi) || []).length;
    const bScore = (b.match(/\b(when|said|looked|sat|smiled|text|call|room|door|table|laugh|quiet|wait)\b/gi) || []).length;
    return bScore - aScore;
  })[0] || entry.text.trim().split(/\s+/).slice(0, 12).join(" ");
}

function curiousQuestion(entry, signal) {
  const detail = aliveDetail(entry);
  const shortDetail = detail.length > 82 ? `${detail.slice(0, 79)}...` : detail;
  const banks = {
    growth: [
      `Wait, when ${shortDetail}, what was the tiny brave part of you doing?`,
      "What was the little part of you that kept going, even there?",
      "If that hard moment had a tiny sign on it, what would the sign say?"
    ],
    values: [
      "What feels more like you here, even if it is a bit scary?",
      "If nobody got to vote on your answer, what would you secretly pick?",
      "Which part feels like yours, and which part feels like it got handed to you by other people?"
    ],
    thought: [
      "When that thought popped up, what happened right before it?",
      "What made that thought look so true for a minute?",
      "If that thought is only one guess, what is another guess hiding nearby?"
    ],
    feeling: [
      "What was the exact tiny moment when the feeling changed?",
      `What part of "${shortDetail}" keeps doing a little replay in your head?`,
      "What do you wish someone had noticed right then?"
    ]
  };
  return selectFreshQuestion(banks[signal]);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function lastSevenEntriesText() {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return state.entries
    .filter((entry) => new Date(entry.createdAt).getTime() >= cutoff)
    .map((entry) => entry.text)
    .join(" ")
    .toLowerCase();
}

function inferCoreValues(answers) {
  const text = Object.values(answers).join(" ").toLowerCase();
  const ranked = Object.entries(valueWords)
    .map(([value, words]) => ({ value, score: countMatches(text, words) }))
    .sort((a, b) => b.score - a.score);
  const selected = ranked.filter((item) => item.score > 0).slice(0, 3).map((item) => item.value);
  return [...selected, "connection", "growth", "kindness"].filter((value, index, array) => array.indexOf(value) === index).slice(0, 3);
}

function mostNeglectedValue(text) {
  const values = state.valuesProfile.coreValues.length ? state.valuesProfile.coreValues : ["connection", "growth", "kindness"];
  const lower = text.toLowerCase();
  return values
    .map((value) => ({ value, score: countMatches(lower, valueWords[value] || [value]) }))
    .sort((a, b) => a.score - b.score)[0].value;
}

function mostPresentValue(text) {
  const values = state.valuesProfile.coreValues.length ? state.valuesProfile.coreValues : ["connection", "growth", "kindness"];
  const lower = text.toLowerCase();
  return values
    .map((value) => ({ value, score: countMatches(lower, valueWords[value] || [value]) }))
    .sort((a, b) => b.score - a.score)[0].value;
}

function setValuesPrompt(title, lines, buttonText = "Continue", showInput = true) {
  valuesTitle.textContent = title;
  valuesPrompt.innerHTML = "";
  lines.forEach((line, index) => {
    const element = document.createElement(index === 0 ? "strong" : "p");
    element.textContent = line;
    valuesPrompt.append(element);
  });
  valuesInput.value = "";
  valuesInput.hidden = !showInput;
  valuesSketchPad.clear();
  document.querySelector("#valuesSketchCanvas").closest(".sketch-block").hidden = !showInput;
  valuesNextButton.textContent = buttonText;
  dailyValuesButton.hidden = !state.valuesProfile.complete;
  weeklyValuesButton.hidden = !state.valuesProfile.complete;
}

function openValuesOnboarding() {
  state.valuesMode = "onboarding";
  state.valuesStep = 0;
  renderValuesOnboarding();
  valuesDialog.showModal();
  valuesInput.focus();
}

function renderValuesOnboarding() {
  const area = valueAreas[state.valuesStep];
  setValuesPrompt("Values clarification", [
    `${area.label} — ${area.question}`,
    "If no one was watching and you couldn't fail, what would matter most to you here?"
  ], state.valuesStep === valueAreas.length - 1 ? "Finish" : "Next");
}

function continueValuesOnboarding() {
  const area = valueAreas[state.valuesStep];
  state.valuesProfile.answers[area.key] = valuesInput.value.trim();
  state.valuesProfile.sketches[area.key] = valuesSketchPad.data();
  state.valuesStep += 1;

  if (state.valuesStep < valueAreas.length) {
    renderValuesOnboarding();
    valuesInput.focus();
    return;
  }

  state.valuesProfile.complete = true;
  state.valuesProfile.coreValues = inferCoreValues(state.valuesProfile.answers);
  saveValuesProfile();
  setValuesPrompt("Your core values", [
    `I hear these three values: ${state.valuesProfile.coreValues.join(", ")}.`,
    "These are not labels to trap you; they are small lanterns you can keep checking in with."
  ], "Close", false);
  state.valuesMode = "summary";
}

function openDailyValuesCheckIn() {
  state.valuesMode = "daily-1";
  state.valuesProfile.lastDailyPromptDate = todayKey();
  saveValuesProfile();
  const values = state.valuesProfile.coreValues.join(", ");
  setValuesPrompt("Daily values check-in", [
    `Your core values are: ${values}.`,
    "Looking at today, which of your values did you honour — and which did you neglect?"
  ]);
  valuesDialog.showModal();
  valuesInput.focus();
}

function continueDailyValuesCheckIn() {
  if (state.valuesMode === "daily-1") {
    state.pendingDailyAnswer = valuesInput.value.trim();
    state.pendingDailySketch = valuesSketchPad.data();
    const neglected = mostNeglectedValue(state.pendingDailyAnswer);
    state.valuesMode = "daily-2";
    setValuesPrompt("Daily values check-in", [
      `It sounds like ${neglected} may need a little more room.`,
      `What is one small thing you could do tomorrow to live closer to ${neglected}?`
    ], "Finish");
    valuesInput.focus();
    return;
  }

  const action = valuesInput.value.trim();
  const neglected = mostNeglectedValue(`${state.pendingDailyAnswer} ${action}`);
  state.valuesProfile.dailyCheckIns.push({
    date: todayKey(),
    answer: state.pendingDailyAnswer,
    answerSketch: state.pendingDailySketch,
    nextAction: action,
    nextActionSketch: valuesSketchPad.data(),
    neglected
  });
  saveValuesProfile();
  setValuesPrompt("Daily values check-in", [
    "You noticed something real today, and that self-awareness is already a meaningful act of care."
  ], "Close", false);
  state.valuesMode = "summary";
}

function openWeeklyValuesReflection() {
  state.valuesMode = "weekly";
  state.valuesProfile.lastWeeklyReflectionDate = todayKey();
  saveValuesProfile();
  const text = `${lastSevenEntriesText()} ${state.valuesProfile.dailyCheckIns.slice(-7).map((item) => `${item.answer} ${item.nextAction}`).join(" ")}`;
  const present = mostPresentValue(text);
  const neglected = mostNeglectedValue(text);
  const entriesCount = state.entries.filter((entry) => Date.now() - new Date(entry.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000).length;
  setValuesPrompt("Weekly values reflection", [
    `This week, ${present} seems to appear most often in your reflections.`,
    `${neglected} looks like it may have received less attention.`,
    `Across ${entriesCount} recent entries, I notice a pattern of returning to what matters rather than ignoring it, which is a small win.`,
    `What would it look like to make ${neglected} a priority next week?`
  ], "Close", false);
  valuesDialog.showModal();
}

function openValuesHome() {
  if (!state.valuesProfile.complete) {
    openValuesOnboarding();
    return;
  }
  state.valuesMode = "home";
  setValuesPrompt("Values", [
    `Your core values are: ${state.valuesProfile.coreValues.join(", ")}.`,
    "You can do a daily check-in or a Sunday-style weekly reflection whenever you want."
  ], "Close", false);
  valuesDialog.showModal();
}

function continueValuesFlow() {
  if (state.valuesMode === "onboarding") {
    continueValuesOnboarding();
  } else if (state.valuesMode === "daily-1" || state.valuesMode === "daily-2") {
    continueDailyValuesCheckIn();
  } else {
    valuesDialog.close();
  }
}

function maybeOpenScheduledValuesPrompt() {
  window.setTimeout(() => {
    if (valuesDialog.open) return;

    if (!state.valuesProfile.complete) {
      openValuesOnboarding();
      return;
    }

    const now = new Date();
    const today = todayKey();
    const isSunday = now.getDay() === 0;
    const isEvening = now.getHours() >= 18;
    const hasDailyToday = state.valuesProfile.dailyCheckIns.some((item) => item.date === today);

    if (isSunday && state.valuesProfile.lastWeeklyReflectionDate !== today) {
      openWeeklyValuesReflection();
      return;
    }

    if (isEvening && !hasDailyToday && state.valuesProfile.lastDailyPromptDate !== today) {
      openDailyValuesCheckIn();
    }
  }, 900);
}

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function setGrowthPrompt(title, lines, buttonText = "Continue", showInput = true) {
  growthTitle.textContent = title;
  growthPrompt.innerHTML = "";
  lines.forEach((line, index) => {
    const element = document.createElement(index === 0 ? "strong" : "p");
    element.textContent = line;
    growthPrompt.append(element);
  });
  growthInput.value = "";
  growthInput.hidden = !showInput;
  growthSketchPad.clear();
  document.querySelector("#growthSketchCanvas").closest(".sketch-block").hidden = !showInput;
  growthNextButton.textContent = buttonText;
}

function openGrowthHome() {
  state.growthMode = "home";
  setGrowthPrompt("Growth mindset", [
    "Use the daily reflection to turn a struggle into a learning moment.",
    "Use the monthly report to look back at the challenges, lessons, and evidence of growth you have been building."
  ], "Close", false);
  growthDialog.showModal();
}

function openDailyGrowthReflection() {
  state.growthMode = "daily";
  state.growthStep = 0;
  state.growthDraft = {};
  state.growthProfile.lastDailyPromptDate = todayKey();
  saveGrowthProfile();
  renderDailyGrowthStep();
  growthDialog.showModal();
  growthInput.focus();
}

function renderDailyGrowthStep() {
  const steps = [
    {
      title: "QUESTION 1 — STRUGGLE",
      prompt: "What was the hardest moment of your day? It can be big or small."
    },
    {
      title: "QUESTION 2 — LEARNING",
      prompt: "What did that difficulty teach you — about yourself, others, or how to handle things differently next time?"
    },
    {
      title: "QUESTION 3 — NEXT STEP",
      prompt: "Based on what you learned, what is one tiny thing you could try differently tomorrow?"
    }
  ];
  const step = steps[state.growthStep];
  setGrowthPrompt("Growth mindset", [step.title, step.prompt], state.growthStep === steps.length - 1 ? "Finish" : "Next");
}

function continueDailyGrowthReflection() {
  const answer = growthInput.value.trim();
  if (state.growthStep === 0) {
    state.growthDraft.struggle = answer;
    state.growthDraft.struggleSketch = growthSketchPad.data();
    state.growthStep = 1;
    renderDailyGrowthStep();
    growthInput.focus();
    return;
  }
  if (state.growthStep === 1) {
    state.growthDraft.learning = answer;
    state.growthDraft.learningSketch = growthSketchPad.data();
    state.growthStep = 2;
    renderDailyGrowthStep();
    growthInput.focus();
    return;
  }

  state.growthDraft.nextStep = answer;
  state.growthDraft.nextStepSketch = growthSketchPad.data();
  const entry = {
    date: todayKey(),
    createdAt: new Date().toISOString(),
    struggle: state.growthDraft.struggle || "",
    learning: state.growthDraft.learning || "",
    nextStep: state.growthDraft.nextStep || "",
    sketches: {
      struggle: state.growthDraft.struggleSketch || "",
      learning: state.growthDraft.learningSketch || "",
      nextStep: state.growthDraft.nextStepSketch || ""
    }
  };
  state.growthProfile.entries.push(entry);
  saveGrowthProfile();
  state.growthMode = "summary";
  setGrowthPrompt("Growth mindset", [
    "That sounded genuinely difficult, and it makes sense that it took something from you.",
    "You are building the skill of learning from hard moments instead of treating them as proof of failure; this is how growth feels."
  ], "Close", false);
}

function recentGrowthEntries(days = 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return state.growthProfile.entries.filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
}

function shortPhrase(text, fallback) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.length > 88 ? `${clean.slice(0, 85)}...` : clean;
}

function recurringGrowthEdge(entries) {
  const text = entries.map((entry) => `${entry.struggle} ${entry.learning}`).join(" ").toLowerCase();
  const themes = [
    { name: "speaking up earlier", words: ["speak", "voice", "say", "ask", "tell"] },
    { name: "protecting your energy", words: ["tired", "drained", "overwhelmed", "rest", "too much"] },
    { name: "responding to uncertainty with patience", words: ["uncertain", "confused", "worry", "anxious", "unknown"] },
    { name: "turning self-criticism into practice", words: ["failure", "stupid", "ashamed", "mistake", "not good"] },
    { name: "taking smaller next steps", words: ["stuck", "avoid", "delay", "procrastinate", "hard to start"] }
  ];
  return themes
    .map((theme) => ({ ...theme, score: countMatches(text, theme.words) }))
    .sort((a, b) => b.score - a.score)[0].name;
}

function buildGrowthReport() {
  const entries = recentGrowthEntries(30);
  if (!entries.length) {
    return "I do not have any growth reflections from the past 30 days yet. Start with one daily Growth reflection, and this report will become more specific over time.";
  }

  const challengeList = entries.slice(-5).map((entry) => shortPhrase(entry.struggle, "a hard moment")).join("; ");
  const lessonList = entries.slice(-5).map((entry) => shortPhrase(entry.learning, "a small lesson")).join("; ");
  const evidence = entries
    .filter((entry) => entry.nextStep || entry.learning)
    .slice(-3)
    .map((entry) => shortPhrase(entry.nextStep || entry.learning, "you named one next step"));
  const edge = recurringGrowthEdge(entries);

  return [
    "Dear you,",
    `This month, the challenges you faced included: ${challengeList}. These were not tiny because they fit into a journal box; they were real moments that asked something of you.`,
    `The lessons that kept appearing were: ${lessonList}. I notice you practicing the shift from \"this went wrong\" toward \"what can this teach me?\"`,
    `Evidence of growth is already here: ${evidence.join("; ")}. Each of these shows resilience, curiosity, or a willingness to try again in a more deliberate way.`,
    `Your growth edge is ${edge}. This is not a failure pattern; it is an active training ground, and it is exciting because it shows exactly where tomorrow's smallest brave practice can begin.`
  ].join("\n\n");
}

function openMonthlyGrowthReport() {
  state.growthMode = "report";
  state.growthProfile.lastMonthlyReportMonth = monthKey();
  saveGrowthProfile();
  setGrowthPrompt("Growth Report", [buildGrowthReport()], "Close", false);
  growthDialog.showModal();
}

function continueGrowthFlow() {
  if (state.growthMode === "daily") {
    continueDailyGrowthReflection();
  } else {
    growthDialog.close();
  }
}

function maybeOpenScheduledGrowthPrompt() {
  window.setTimeout(() => {
    if (valuesDialog.open || growthDialog.open) return;
    if (state.valuesProfile && !state.valuesProfile.complete) return;

    const now = new Date();
    const today = todayKey();
    const isEvening = now.getHours() >= 18;
    const firstOfMonth = now.getDate() === 1;
    const currentMonth = monthKey(now);
    const hasGrowthToday = state.growthProfile.entries.some((entry) => entry.date === today);

    if (firstOfMonth && state.growthProfile.lastMonthlyReportMonth !== currentMonth && state.growthProfile.entries.length) {
      openMonthlyGrowthReport();
      return;
    }

    if (isEvening && !hasGrowthToday && state.growthProfile.lastDailyPromptDate !== today) {
      openDailyGrowthReflection();
    }
  }, 1300);
}

function setCbtPrompt(title, lines, buttonText = "Continue", showInput = true) {
  cbtTitle.textContent = title;
  cbtPrompt.innerHTML = "";
  lines.forEach((line, index) => {
    const element = document.createElement(index === 0 ? "strong" : "p");
    element.textContent = line;
    cbtPrompt.append(element);
  });
  cbtInput.value = "";
  cbtInput.hidden = !showInput;
  cbtSketchPad.clear();
  document.querySelector("#cbtSketchCanvas").closest(".sketch-block").hidden = !showInput;
  cbtNextButton.textContent = buttonText;
}

function openCbtRecord() {
  state.cbtMode = "record";
  state.cbtStep = 0;
  state.cbtDraft = {};
  renderCbtStep();
  cbtDialog.showModal();
  cbtInput.focus();
}

function renderCbtStep() {
  const steps = [
    {
      title: "STEP 1 — SITUATION",
      prompt: "What exactly happened? Just the facts — where were you, who was there, what was said or done?"
    },
    {
      title: "STEP 2 — EMOTION",
      prompt: "What emotion did you feel in that moment? Rate its intensity from 0–100."
    },
    {
      title: "STEP 3 — AUTOMATIC THOUGHT",
      prompt: "What thought went through your mind at that moment? What did it mean to you about yourself, others, or the future?"
    },
    {
      title: "STEP 4 — IDENTIFY THE DISTORTION",
      prompt: cbtDistortionPrompt()
    },
    {
      title: "STEP 5 — REFRAME",
      prompt: "What would you say to a close friend who had this exact thought? What is a more balanced way to see this situation?"
    },
    {
      title: "STEP 6 — RE-RATE",
      prompt: "Now rate the intensity of that original emotion again from 0–100. Has anything shifted?"
    }
  ];
  const step = steps[state.cbtStep];
  setCbtPrompt("CBT thought record", [step.title, step.prompt], state.cbtStep === steps.length - 1 ? "Finish" : "Next");
}

function cbtDistortionPrompt() {
  const text = `${state.cbtDraft.situation || ""} ${state.cbtDraft.emotion || ""} ${state.cbtDraft.thought || ""}`.toLowerCase();
  const distortion = likelyDistortion(text);
  return `It sounds like there might be some ${distortion} happening here. Does that resonate?`;
}

function continueCbtRecord() {
  const answer = cbtInput.value.trim();
  const keys = ["situation", "emotion", "thought", "distortion", "reframe", "rerate"];
  state.cbtDraft[keys[state.cbtStep]] = answer;
  state.cbtDraft[`${keys[state.cbtStep]}Sketch`] = cbtSketchPad.data();
  state.cbtStep += 1;

  if (state.cbtStep < keys.length) {
    renderCbtStep();
    cbtInput.focus();
    return;
  }

  const summary = [
    "You completed the thought record.",
    "Notice whether naming the situation, thought, and reframe created even a small amount of space around the original feeling."
  ];
  setCbtPrompt("CBT thought record", summary, "Close", false);
  state.cbtMode = "summary";
  state.cbtProfile.records.push({
    date: todayKey(),
    createdAt: new Date().toISOString(),
    ...state.cbtDraft
  });
  saveCbtProfile();
}

function buildSupportiveReflection(entry) {
  const text = entry.text.toLowerCase();
  if (containsCrisisLanguage(text)) {
    return "That sounds really scary and lonely to hold by yourself.\n\nPlease tell someone you trust or a professional now, and call emergency help if you might hurt yourself or someone else.\n\nCould you message one safe person before you stay with this alone?";
  }

  const emotions = rankedMatches(text, emotionLexicon);
  const mainEmotion = emotions[0]?.name || "mixed";
  const signal = inferCompanionSignal(text);

  const emotionLines = {
    anxious: "Whoa, that worry sounds like it kept poking you, even when you were just trying to have a normal day.",
    sad: "Oh, that sounds like a heavy kind of sad, the kind that just sits next to you and will not leave.",
    angry: "Wait, that sounds so frustrating, like you had to keep your face normal while the inside of you was yelling.",
    ashamed: "Oof, that sounds like it went straight to the mean little voice that says unfair things about you.",
    tender: "That tiny detail feels really soft, like it mattered before you even knew it mattered.",
    hopeful: "Oh, that little bright part is interesting, like a tiny light showed up and you actually saw it.",
    mixed: "It sounds like a bunch of little inside-voices all tried to talk at the same time."
  };

  const secondLines = {
    growth: "It does not sound like a fail; it sounds like one of those hard bits where your brain is secretly learning, even if it feels awful.",
    values: "It feels like there is a small hidden compass in here, trying to point at what is really yours.",
    thought: "One thought in here got very loud, like it climbed onto a chair and shouted over everything else.",
    feeling: "The feeling has a shape, almost like it started as one tiny pebble and then became a whole hill."
  };
  const question = curiousQuestion(entry, signal);

  return [
    emotionLines[mainEmotion],
    secondLines[signal],
    question
  ].filter(Boolean).slice(0, 3).join("\n\n");
}

function generateReply() {
  saveCurrentEntry();
  const entry = currentEntry();
  if (!entry || !entry.text) {
    renderReply("Write a little first, even if it is messy. A few honest sentences are enough for us to begin.");
    return;
  }

  entry.reply = buildSupportiveReflection(entry);
  entry.updatedAt = new Date().toISOString();
  persist();
  renderReply(entry.reply);
  renderList();
}

function exportEntries() {
  saveCurrentEntry();
  const content = JSON.stringify(state.entries, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "inner-room-journal.json";
  link.click();
  URL.revokeObjectURL(url);
}

function createSketchPad(canvas) {
  const context = canvas.getContext("2d");
  const pad = {
    canvas,
    context,
    color: sketchColors[0],
    erasing: false,
    drawing: false,
    point: null,
    clear() {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineJoin = "round";
    },
    data() {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245) {
          return canvas.toDataURL("image/png");
        }
      }
      return "";
    },
    load(dataUrl) {
      pad.clear();
      if (!dataUrl) return;
      const image = new Image();
      image.addEventListener("load", () => {
        pad.clear();
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      });
      image.src = dataUrl;
    },
    eventPoint(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height
      };
    }
  };

  canvas.addEventListener("pointerdown", (event) => {
    pad.drawing = true;
    pad.point = pad.eventPoint(event);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!pad.drawing || !pad.point) return;
    const point = pad.eventPoint(event);
    context.strokeStyle = pad.erasing ? "#ffffff" : pad.color;
    context.lineWidth = pad.erasing ? 28 : 5;
    context.beginPath();
    context.moveTo(pad.point.x, pad.point.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    pad.point = point;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
    canvas.addEventListener(type, () => {
      pad.drawing = false;
      pad.point = null;
      if (canvas.id === "entrySketchCanvas") saveCurrentEntry();
    });
  });

  pad.clear();
  return pad;
}

function buildSketchTools() {
  const pads = {
    entrySketchCanvas: entrySketchPad,
    valuesSketchCanvas: valuesSketchPad,
    growthSketchCanvas: growthSketchPad,
    cbtSketchCanvas: cbtSketchPad
  };

  document.querySelectorAll(".sketch-tools").forEach((container) => {
    const pad = pads[container.dataset.toolsFor];
    if (!pad) return;
    container.innerHTML = "";

    sketchColors.forEach((color) => {
      const button = document.createElement("button");
      button.className = `color-tool${color === pad.color ? " selected" : ""}`;
      button.type = "button";
      button.style.backgroundColor = color;
      button.title = "Pen color";
      button.setAttribute("aria-label", `Pen color ${color}`);
      button.addEventListener("click", () => {
        pad.color = color;
        pad.erasing = false;
        container.querySelectorAll(".color-tool").forEach((tool) => {
          tool.classList.toggle("selected", tool === button);
        });
        container.querySelector(".eraser-tool")?.classList.remove("selected");
      });
      container.append(button);
    });

    const eraser = document.createElement("button");
    eraser.className = "eraser-tool";
    eraser.type = "button";
    eraser.textContent = "ERS";
    eraser.title = "Eraser";
    eraser.setAttribute("aria-label", "Eraser");
    eraser.addEventListener("click", () => {
      pad.erasing = true;
      container.querySelectorAll(".color-tool").forEach((tool) => tool.classList.remove("selected"));
      eraser.classList.add("selected");
    });
    container.append(eraser);

    const clear = document.createElement("button");
    clear.className = "clear-tool";
    clear.type = "button";
    clear.textContent = "CLR";
    clear.title = "Clear sketch";
    clear.addEventListener("click", () => {
      pad.clear();
      if (pad === entrySketchPad) saveCurrentEntry();
    });
    container.append(clear);
  });
}

function buildPromptDialog() {
  promptGrid.innerHTML = "";
  prompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.className = "prompt-option";
    button.type = "button";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      entryText.value = entryText.value ? `${entryText.value}\n\n${prompt}\n` : `${prompt}\n`;
      promptDialog.close();
      entryText.focus();
    });
    promptGrid.append(button);
  });
}

function chooseOpeningPrompt() {
  const bank = window.JOURNAL_PROMPTS || [];
  if (!bank.length) return;

  const lastId = Number(localStorage.getItem("inner-room-last-prompt-id") || 0);
  const available = bank.filter((item) => item.id !== lastId);
  const source = available.length ? available : bank;
  state.openingPrompt = source[Math.floor(Math.random() * source.length)];
  localStorage.setItem("inner-room-last-prompt-id", String(state.openingPrompt.id));
  renderOpeningPrompt();
}

function renderOpeningPrompt() {
  if (!state.openingPrompt) return;
  openingPromptCategory.textContent = `${state.openingPrompt.category} · ${state.openingPrompt.id}/300`;
  openingPromptText.textContent = state.openingPrompt.text;
}

function useOpeningPrompt() {
  if (!state.openingPrompt) return;
  const prompt = state.openingPrompt.text;
  entryText.value = entryText.value ? `${entryText.value.trim()}\n\n${prompt}\n` : `${prompt}\n`;
  entryText.focus();
}

function buildPatternCheck() {
  patternCheckGrid.innerHTML = "";
  patternCheckItems.forEach((item) => {
    const label = document.createElement("label");
    label.className = "pattern-check-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.id;
    checkbox.dataset.group = item.group;

    const text = document.createElement("span");
    text.textContent = item.label;

    label.append(checkbox, text);
    patternCheckGrid.append(label);
  });
}

function openPatternCheck() {
  patternCheckResult.hidden = true;
  patternCheckDialog.showModal();
}

function resetPatternCheck() {
  patternCheckGrid.querySelectorAll("input").forEach((checkbox) => {
    checkbox.checked = false;
  });
  patternCheckResult.hidden = true;
  patternCheckResult.textContent = "";
}

function reviewPatternCheck() {
  const selected = [...patternCheckGrid.querySelectorAll("input:checked")];
  patternCheckResult.innerHTML = "";

  const lines = [];
  if (!selected.length) {
    lines.push("Nothing is checked right now. That can simply mean no listed pattern stands out today.");
  } else if (selected.some((checkbox) => checkbox.value === "self_harm")) {
    lines.push("The safety item matters more than the rest of this checklist.");
    lines.push("Please tell someone you trust or a mental health professional now, and contact emergency services if you might act on these thoughts.");
  } else {
    const groups = [...new Set(selected.map((checkbox) => checkbox.dataset.group))];
    lines.push(`${selected.length} patterns stand out today, especially around ${groups.slice(0, 3).join(", ")}.`);
    lines.push("This is a snapshot for noticing, not a diagnosis or a score.");
    lines.push("Which checked item has been affecting ordinary life the most?");
  }

  lines.forEach((line, index) => {
    const element = document.createElement(index === 0 ? "strong" : "p");
    element.textContent = line;
    patternCheckResult.append(element);
  });
  patternCheckResult.hidden = false;
}

document.querySelector("#newEntryButton").addEventListener("click", () => {
  saveCurrentEntry();
  createEntry();
  entryText.focus();
});

document.querySelector("#saveButton").addEventListener("click", saveCurrentEntry);
document.querySelector("#refreshButton").addEventListener("click", () => {
  saveCurrentEntry();
  location.reload();
});
document.querySelector("#replyButton").addEventListener("click", generateReply);
document.querySelector("#exportButton").addEventListener("click", exportEntries);
document.querySelector("#promptButton").addEventListener("click", () => promptDialog.showModal());
document.querySelector("#deleteButton").addEventListener("click", openDeleteDialog);
document.querySelector("#valuesButton").addEventListener("click", openValuesHome);
document.querySelector("#growthButton").addEventListener("click", openGrowthHome);
document.querySelector("#cbtButton").addEventListener("click", openCbtRecord);
document.querySelector("#patternCheckButton").addEventListener("click", openPatternCheck);
valuesNextButton.addEventListener("click", continueValuesFlow);
dailyValuesButton.addEventListener("click", openDailyValuesCheckIn);
weeklyValuesButton.addEventListener("click", openWeeklyValuesReflection);
growthNextButton.addEventListener("click", continueGrowthFlow);
dailyGrowthButton.addEventListener("click", openDailyGrowthReflection);
monthlyGrowthButton.addEventListener("click", openMonthlyGrowthReport);
cbtNextButton.addEventListener("click", () => {
  if (state.cbtMode === "record") {
    continueCbtRecord();
  } else {
    cbtDialog.close();
  }
});
document.querySelector("#resetPatternCheckButton").addEventListener("click", resetPatternCheck);
document.querySelector("#reviewPatternCheckButton").addEventListener("click", reviewPatternCheck);
document.querySelector("#anotherOpeningPromptButton").addEventListener("click", chooseOpeningPrompt);
document.querySelector("#useOpeningPromptButton").addEventListener("click", useOpeningPrompt);
document.querySelector("#confirmDeleteButton").addEventListener("click", () => {
  deleteCurrentEntry();
  deleteDialog.close();
});
entryText.addEventListener("input", () => {
  const entry = currentEntry();
  if (!entry) return;
  entryTitle.textContent = entryText.value.trim().split(/\s+/).slice(0, 5).join(" ") || "Today";
});

document.querySelectorAll(".tag-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tag = button.dataset.tag;
    if (state.selectedTags.has(tag)) {
      state.selectedTags.delete(tag);
    } else {
      state.selectedTags.add(tag);
    }
    updateTagButtons();
  });
});

buildPromptDialog();
buildPatternCheck();
chooseOpeningPrompt();
renderMoodOptions();
buildSketchTools();
loadValuesProfile();
loadGrowthProfile();
loadCbtProfile();
loadCompanionProfile();
loadCompanionExamples();
loadEntries();
maybeOpenScheduledValuesPrompt();
maybeOpenScheduledGrowthPrompt();
