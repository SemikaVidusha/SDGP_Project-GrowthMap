let traits = {
  logic: 0,
  creativity: 0,
  systems: 0,
  collaboration: 0,
  detail: 0
};

let questions = [];
let careers = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;

async function loadData() {
  try {
    const qRes = await fetch("../data/questions.json");
    questions = await qRes.json();

    const cRes = await fetch("../data/careers.json");
    careers = await cRes.json();

    console.log("Questions loaded:", questions.length);
    console.log("Careers loaded:", careers.length);

    loadQuestion();
  } catch (error) {
    console.error("Data loading failed. Check JSON paths!", error);
  }
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];

  document.getElementById("questionText").innerText = q.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.className = "option-btn";
    btn.onclick = () => selectOption(opt, btn);
    optionsContainer.appendChild(btn);
  });
}

function selectOption(option, btn) {
  selectedAnswer = option;
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(b => b.style.border = "1px solid #ccc");
  btn.style.border = "2px solid blue";
}

function normalizeTraits(rawTraits) {
  const max = Math.max(...Object.values(rawTraits), 1);
  const normalized = {};
  for (let t in rawTraits) normalized[t] = rawTraits[t] / max;
  return normalized;
}

function scoreCareers() {
  const normalizedTraits = normalizeTraits(traits);

  const ranked = careers.map(career => {
    const primary = normalizedTraits[career.primaryTrait] ?? 0;
    const secondary = normalizedTraits[career.secondaryTrait] ?? 0;

    const score = (primary * 0.7) + (secondary * 0.3); // score 0..1

    return {
      id: career.id,
      name: career.name,
      description: career.description,
      score
    };
  }).sort((a, b) => b.score - a.score);

  return { ranked, normalizedTraits };
}

function finishQuiz() {
  const { ranked, normalizedTraits } = scoreCareers();

  const assessmentResult = {
    bestCareer: ranked[0],
    topCareers: ranked.slice(0, 3),
    traits: normalizedTraits
  };

  console.log("FINAL RESULT:", assessmentResult);

  localStorage.setItem("assessmentResult", JSON.stringify(assessmentResult));

  window.location.href = "Result_page.html";
}

window.onload = async () => {
  await loadData();

  document.getElementById("nextBtn").onclick = () => {
    if (!selectedAnswer) {
      alert("Please select an option");
      return;
    }

    const traitKey = selectedAnswer.trait;
    const value = selectedAnswer.value;

    if (traits[traitKey] === undefined) traits[traitKey] = 0;
    traits[traitKey] += value;

    selectedAnswer = null;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      finishQuiz();
    }
  };
};
