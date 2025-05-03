/* Main Application Logic */

/* Status & DOM-References */
let current = null, answered = false, totalCorrect = 0, history = [];
const wordEl = document.getElementById("word"),
      translationEl = document.getElementById("translation"),
      feedbackEl = document.getElementById("feedback"),
      totalScoreEl = document.getElementById("total-score"),
      successRateEl = document.getElementById("success-rate"),
      successFillEl = document.getElementById("success-fill"),
      derBtn = document.getElementById("der-btn"),
      dieBtn = document.getElementById("die-btn"),
      dasBtn = document.getElementById("das-btn"),
      ruBtn = document.getElementById("ru-btn");

/* Events */
derBtn.addEventListener("click", () => check("der"));
dieBtn.addEventListener("click", () => check("die"));
dasBtn.addEventListener("click", () => check("das"));
["mousedown", "touchstart"].forEach(ev => ruBtn.addEventListener(ev, showRu));
["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(ev => ruBtn.addEventListener(ev, hideRu));
window.addEventListener("DOMContentLoaded", init);

/* Logic */
function init() {
  loadStats();
  updateStats();
  nextWord();
}

function loadStats() {
  try {
    const d = JSON.parse(localStorage.getItem("dddStats") || "null");
    if (d) {
      totalCorrect = d.totalCorrect || 0;
      history = d.history || [];
    }
  } catch {}
}

function saveStats() {
  try {
    localStorage.setItem("dddStats", JSON.stringify({totalCorrect, history}));
  } catch {}
}

function nextWord() {
  current = germanNouns[Math.floor(Math.random() * germanNouns.length)];
  wordEl.textContent = current.w;
  translationEl.textContent = ru[current.w] || "—";
  answered = false;
  [derBtn, dieBtn, dasBtn].forEach(b => b.classList.remove("correct", "incorrect"));
  feedbackEl.textContent = "";
}

function check(a) {
  if (answered) return;
  answered = true;
  const ok = a === current.a;
  document.querySelector(`.${a}-btn`).classList.add(ok ? "correct" : "incorrect");
  if (!ok) document.querySelector(`.${current.a}-btn`).classList.add("correct");
  feedbackEl.textContent = ok ? "Richtig!" : `Falsch – ${current.a} ${current.w}`;
  if (ok) totalCorrect++;
  history.push(ok); 
  if (history.length > 50) history.shift();
  saveStats(); 
  updateStats();
  setTimeout(nextWord, 1500);
}

function updateStats() {
  totalScoreEl.textContent = totalCorrect;
  const ok = history.filter(Boolean).length,
        rate = history.length ? Math.round(ok / history.length * 100) : 0;
  successRateEl.textContent = rate;
  successFillEl.style.width = rate + "%";
}

function showRu(e) {
  wordEl.style.color = "#aaa";
  e.preventDefault();
}

function hideRu() {
  wordEl.style.color = "#444";
}
