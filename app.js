const STORAGE_KEY = "inner-room-journal-v1";
const VALUES_KEY = "inner-room-values-v1";
const GROWTH_KEY = "inner-room-growth-v1";

const prompts = [
  "What feeling has been asking for more space today?",
  "What did I need today that I did not know how to ask for?",
  "Where did my body feel tense, open, heavy, or calm?",
  "What story am I telling myself, and what is another possible story?",
  "What boundary, request, or kindness would make tomorrow easier?",
  "What am I proud of that I almost forgot to count?"
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
  cbtDraft: {}
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
    lastDailyPromptDate: "",
    lastWeeklyReflectionDate: ""
  };
  state.valuesProfile.answers ||= {};
  state.valuesProfile.coreValues ||= [];
  state.valuesProfile.dailyCheckIns ||= [];
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
    reply: ""
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
}

function saveCurrentEntry() {
  const entry = currentEntry();
  if (!entry) return;
  entry.text = entryText.value.trim();
  entry.moodKey = state.selectedMood;
  entry.mood = moodFromKey(state.selectedMood).tone;
  entry.tags = [...state.selectedTags];
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
    nextAction: action,
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
    state.growthStep = 1;
    renderDailyGrowthStep();
    growthInput.focus();
    return;
  }
  if (state.growthStep === 1) {
    state.growthDraft.learning = answer;
    state.growthStep = 2;
    renderDailyGrowthStep();
    growthInput.focus();
    return;
  }

  state.growthDraft.nextStep = answer;
  const entry = {
    date: todayKey(),
    createdAt: new Date().toISOString(),
    struggle: state.growthDraft.struggle || "",
    learning: state.growthDraft.learning || "",
    nextStep: state.growthDraft.nextStep || ""
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
}

function buildSupportiveReflection(entry) {
  const text = entry.text.toLowerCase();
  if (containsCrisisLanguage(text)) {
    return "I am really glad you wrote this down. This sounds like a moment that deserves immediate human support, not just a journal reply.\n\nIf you might hurt yourself or someone else, please contact local emergency services now. If you are in the United States, call or text 988 for the Suicide and Crisis Lifeline. If you are elsewhere, contact your local emergency number or a trusted person who can stay with you.\n\nFor the next minute, move away from anything you could use to hurt yourself and put one real person between you and being alone with this.";
  }

  const emotions = rankedMatches(text, emotionLexicon);
  const needs = rankedMatches(text, needLexicon);
  const mainEmotion = emotions[0]?.name || "mixed";
  const mainNeed = needs[0]?.name;
  const selectedMood = moodFromKey(entry.moodKey);

  const emotionLines = {
    anxious: "I hear a part of you trying to scan ahead and protect you from something painful.",
    sad: "I hear sadness asking to be witnessed rather than rushed away.",
    angry: "I hear anger pointing toward something that mattered or felt crossed.",
    ashamed: "I hear a harsh inner voice trying to make this mean something global about you.",
    tender: "I hear tenderness here, which usually means something important is close to the surface.",
    hopeful: "I hear a thread of hope or steadiness in this, even if the situation is still complicated.",
    mixed: "I hear more than one feeling moving at the same time, which makes sense for a layered moment."
  };

  const needQuestions = {
    safety: "What would help your body feel even 10 percent safer right now?",
    clarity: "What do you know for sure, and what are you still guessing?",
    connection: "Who could receive a small honest piece of this from you?",
    rest: "What would rest look like if it did not have to be earned first?",
    boundaries: "Where might a small boundary protect your energy or dignity?",
    agency: "What is one small choice still available to you?"
  };

  return [
    emotionLines[mainEmotion],
    `You selected ${selectedMood.label.toLowerCase()}, so I would start by respecting that signal instead of trying to solve everything immediately.`,
    mainNeed ? `A possible need underneath this is ${mainNeed}.` : "The need underneath this may not be clear yet, and that is okay.",
    `A question to sit with: ${needQuestions[mainNeed] || "Which part of this wants your attention first?"}`
  ].join("\n\n");
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
renderMoodOptions();
loadValuesProfile();
loadGrowthProfile();
loadEntries();
maybeOpenScheduledValuesPrompt();
maybeOpenScheduledGrowthPrompt();
