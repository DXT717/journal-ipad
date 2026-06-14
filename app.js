const STORAGE_KEY = "inner-room-journal-v1";

const prompts = [
  "What feeling has been asking for more space today?",
  "What did I need today that I did not know how to ask for?",
  "Where did my body feel tense, open, heavy, or calm?",
  "What story am I telling myself, and what is another possible story?",
  "What boundary, request, or kindness would make tomorrow easier?",
  "What am I proud of that I almost forgot to count?"
];

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

const patternLexicon = {
  allOrNothing: {
    words: ["always", "never", "everything", "nothing", "ruined", "impossible"],
    line: "I notice some all-or-nothing language. That can happen when the nervous system is trying to simplify pain into one absolute answer."
  },
  mindReading: {
    words: ["they think", "everyone thinks", "she thinks", "he thinks", "they must", "probably hates"],
    line: "There may be a mind-reading loop here: your mind is filling in what someone else thinks before you have solid evidence."
  },
  selfAttack: {
    words: ["i am stupid", "i'm stupid", "i am a failure", "i'm a failure", "i hate myself", "not good enough"],
    line: "There is a self-attacking voice in the room. It may be trying to prevent more pain, but it is speaking too harshly to be trusted as the whole truth."
  },
  pressure: {
    words: ["should", "must", "have to", "need to be", "supposed to"],
    line: "I also hear pressure language. It may help to separate a true responsibility from an inherited expectation."
  }
};

const state = {
  entries: [],
  currentId: null,
  selectedTags: new Set()
};

const entryList = document.querySelector("#entryList");
const entryText = document.querySelector("#entryText");
const moodRange = document.querySelector("#moodRange");
const moodValue = document.querySelector("#moodValue");
const replyBody = document.querySelector("#replyBody");
const currentDate = document.querySelector("#currentDate");
const entryTitle = document.querySelector("#entryTitle");
const promptDialog = document.querySelector("#promptDialog");
const promptGrid = document.querySelector("#promptGrid");
const pencilDialog = document.querySelector("#pencilDialog");
const pencilText = document.querySelector("#pencilText");
const sketchCanvas = document.querySelector("#sketchCanvas");
const sketchContext = sketchCanvas.getContext("2d");
let isSketching = false;
let lastPoint = null;

function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  state.entries = raw ? JSON.parse(raw) : [];
  if (!state.entries.length) {
    createEntry();
  } else {
    state.currentId = state.entries[0].id;
    loadCurrentEntry();
  }
  renderList();
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
    text: "",
    tags: [],
    reply: "",
    sketch: ""
  };
  state.entries.unshift(entry);
  state.currentId = entry.id;
  state.selectedTags = new Set();
  persist();
  loadCurrentEntry();
  renderList();
}

function currentEntry() {
  return state.entries.find((entry) => entry.id === state.currentId);
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
  moodRange.value = entry.mood;
  moodValue.textContent = entry.mood;
  state.selectedTags = new Set(entry.tags);
  updateTagButtons();
  renderReply(entry.reply);
  loadSketch(entry.sketch);
}

function saveCurrentEntry() {
  const entry = currentEntry();
  if (!entry) return;
  entry.text = entryText.value.trim();
  entry.mood = Number(moodRange.value);
  entry.tags = [...state.selectedTags];
  entry.sketch = getSketchData();
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
    meta.textContent = `${date} | mood ${entry.mood}`;

    button.append(title, meta);
    entryList.append(button);
  });
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

function buildReflection(entry) {
  const text = entry.text.toLowerCase();
  if (containsCrisisLanguage(text)) {
    return "I am really glad you wrote this down. This sounds like a moment that deserves immediate human support, not just a journal reply.\n\nIf you might hurt yourself or someone else, please contact local emergency services now. If you are in the United States, call or text 988 for the Suicide and Crisis Lifeline. If you are elsewhere, contact your local emergency number or a trusted person who can stay with you.\n\nFor the next minute, move away from anything you could use to hurt yourself and put one real person between you and being alone with this.";
  }

  const emotions = rankedMatches(text, emotionLexicon);
  const needs = rankedMatches(text, needLexicon);
  const patterns = rankedMatches(text, patternLexicon);
  const mainEmotion = emotions[0]?.name || "mixed";
  const secondaryEmotion = emotions[1]?.name;
  const mainNeed = needs[0]?.name;
  const tagText = entry.tags.length ? `The tags you chose point toward ${entry.tags.join(", ")}.` : "";
  const history = entryHistoryInsight(entry);
  const standout = sentenceFromEntry(entry.text);

  const emotionLines = {
    anxious: "I hear a system trying to scan ahead for danger or disappointment.",
    sad: "I hear sadness that may want to be witnessed before anyone asks it to improve.",
    angry: "I hear anger protecting something that matters to you.",
    ashamed: "I hear shame narrowing the room and making you smaller than the full truth.",
    tender: "I hear tenderness here, the kind that can feel exposed because something matters.",
    hopeful: "I hear a real thread of hope or steadiness, even if the whole picture is not simple.",
    mixed: "I hear several feelings moving at once, which makes sense if the situation is layered."
  };

  const needLines = {
    safety: "The deeper need may be safety: less intensity, more steadiness, and a way to feel held.",
    clarity: "The deeper need may be clarity: not forcing an answer, but separating facts from fear.",
    connection: "The deeper need may be connection: to feel seen, chosen, heard, or less alone.",
    rest: "The deeper need may be rest: your body may be asking to stop carrying everything at once.",
    boundaries: "The deeper need may be boundaries: permission to protect your time, energy, or dignity.",
    agency: "The deeper need may be agency: one small choice that reminds you you are not only stuck."
  };

  const opening = secondaryEmotion
    ? `${emotionLines[mainEmotion]} There may also be ${secondaryEmotion} underneath it.`
    : emotionLines[mainEmotion];

  const moodLine = entry.mood <= 3
    ? "Because your mood is low, I would treat this as a care-first moment: fewer conclusions, more support."
    : entry.mood >= 8
      ? "Because your mood is high, I would not rush past what is working; it may contain useful information."
      : "Because your mood is in the middle, it may be useful to allow two truths to exist at the same time.";

  const patternLine = patterns[0]?.value.line || "I do not want to over-interpret this. What I can say is that your writing seems to be asking for a slower, kinder read than your mind may be giving it.";
  const needLine = mainNeed ? needLines[mainNeed] : "The deeper need may not be obvious yet. That is okay; noticing what hurts is often the first doorway.";

  const nextSteps = {
    anxious: "Try this: name the exact fear, then write one fact that supports it and one fact that softens it.",
    sad: "Try this: ask what this sadness is mourning, then offer it one concrete comfort today.",
    angry: "Try this: write the sentence, 'What I wanted to protect was...' and finish it without censoring yourself.",
    ashamed: "Try this: rewrite the harshest sentence as if you were speaking to someone you deeply care about.",
    tender: "Try this: let the tender part name what it wants without immediately negotiating it away.",
    hopeful: "Try this: capture what helped, so future-you has a map back to this steadier place.",
    mixed: "Try this: choose the loudest feeling and the quietest feeling, then give each one two sentences."
  };

  const question = {
    safety: "What would make this feel 10 percent safer in your body tonight?",
    clarity: "What do you know for sure, and what are you guessing?",
    connection: "Who could receive even a small, honest version of this?",
    rest: "What would you stop doing for one evening if you believed rest was allowed?",
    boundaries: "Where might a smaller, cleaner no protect a bigger yes?",
    agency: "What is one choice still available to you, even if it is tiny?"
  }[mainNeed] || "What is the part of this that most wants your attention first?";

  return [
    opening,
    [tagText, standout].filter(Boolean).join(" "),
    moodLine,
    patternLine,
    needLine,
    history,
    nextSteps[mainEmotion],
    `A question to sit with: ${question}`
  ].filter(Boolean).join("\n\n");
}

function generateReply() {
  saveCurrentEntry();
  const entry = currentEntry();
  if (!entry || !entry.text) {
    renderReply("Write a little first, even if it is messy. A few honest sentences are enough for us to begin.");
    return;
  }

  entry.reply = buildReflection(entry);
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

function clearSketchCanvas() {
  sketchContext.fillStyle = "#ffffff";
  sketchContext.fillRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  sketchContext.strokeStyle = "#20242b";
  sketchContext.lineWidth = 5;
  sketchContext.lineCap = "round";
  sketchContext.lineJoin = "round";
}

function loadSketch(sketch) {
  clearSketchCanvas();
  if (!sketch) return;

  const image = new Image();
  image.addEventListener("load", () => {
    clearSketchCanvas();
    sketchContext.drawImage(image, 0, 0, sketchCanvas.width, sketchCanvas.height);
  });
  image.src = sketch;
}

function getSketchData() {
  const pixels = sketchContext.getImageData(0, 0, sketchCanvas.width, sketchCanvas.height).data;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245) {
      return sketchCanvas.toDataURL("image/png");
    }
  }
  return "";
}

function pointFromEvent(event) {
  const rect = sketchCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * sketchCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * sketchCanvas.height
  };
}

function startSketch(event) {
  isSketching = true;
  lastPoint = pointFromEvent(event);
  sketchCanvas.setPointerCapture(event.pointerId);
}

function continueSketch(event) {
  if (!isSketching || !lastPoint) return;
  const point = pointFromEvent(event);
  sketchContext.beginPath();
  sketchContext.moveTo(lastPoint.x, lastPoint.y);
  sketchContext.lineTo(point.x, point.y);
  sketchContext.stroke();
  lastPoint = point;
}

function stopSketch() {
  if (!isSketching) return;
  isSketching = false;
  lastPoint = null;
  const entry = currentEntry();
  if (entry) {
    entry.sketch = getSketchData();
    entry.updatedAt = new Date().toISOString();
    persist();
  }
}

function insertPencilText() {
  const text = pencilText.value.trim();
  if (!text) return;
  entryText.value = entryText.value ? `${entryText.value.trim()}\n\n${text}` : text;
  pencilText.value = "";
  saveCurrentEntry();
  entryText.focus();
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
document.querySelector("#replyButton").addEventListener("click", generateReply);
document.querySelector("#exportButton").addEventListener("click", exportEntries);
document.querySelector("#promptButton").addEventListener("click", () => promptDialog.showModal());
function openPencilInput() {
  saveCurrentEntry();
  pencilDialog.showModal();
  pencilText.focus();
}

document.querySelector("#pencilButton").addEventListener("click", openPencilInput);
document.querySelector("#sidebarPencilButton").addEventListener("click", openPencilInput);
document.querySelector("#insertPencilText").addEventListener("click", insertPencilText);
document.querySelector("#clearSketch").addEventListener("click", () => {
  clearSketchCanvas();
  const entry = currentEntry();
  if (entry) {
    entry.sketch = "";
    persist();
  }
});

sketchCanvas.addEventListener("pointerdown", startSketch);
sketchCanvas.addEventListener("pointermove", continueSketch);
sketchCanvas.addEventListener("pointerup", stopSketch);
sketchCanvas.addEventListener("pointercancel", stopSketch);
sketchCanvas.addEventListener("pointerleave", stopSketch);

moodRange.addEventListener("input", () => {
  moodValue.textContent = moodRange.value;
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
clearSketchCanvas();
loadEntries();
