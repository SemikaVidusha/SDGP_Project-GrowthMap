let questions = [];
let careers = [];
let currentQuestionIndex = 0;

let traits = {
  collaboration: 0,
  creativity: 0,
  logic: 0,
  systems: 0,
  detail: 0
};

let answersLog = [];

async function loadData() {
  try {
    const qRes = await fetch("../data/questions.json");
    if (!qRes.ok) throw new Error("Questions JSON not found!");
    questions = await qRes.json();

    const cRes = await fetch("../data/careers.json");
    if (!cRes.ok) throw new Error("Careers JSON not found!");
    careers = await cRes.json();

    if (!questions || questions.length === 0) throw new Error("Questions JSON is empty!");
    if (!careers || careers.length === 0) throw new Error("Careers JSON is empty!");

    loadQuestion();
    updateProgress();
  } catch (error) {
    console.error("Data loading failed. Check JSON paths!", error);

    const questionText = document.getElementById("questionText");
    if (questionText) {
      questionText.innerText =
        "Failed to load quiz data. Please check JSON file paths.";
    }
  }
}

function updateProgress() {
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  const total = questions.length;
  const current = currentQuestionIndex + 1;

  if (progressText) progressText.innerText = `Question ${current} / ${total}`;

  const percent = ((currentQuestionIndex) / total) * 100;
  if (progressFill) progressFill.style.width = `${percent}%`;
}

function loadQuestion() {
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");

  if (!questionText || !optionsContainer) {
    console.error("Quiz HTML elements missing (questionText/optionsContainer).");
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    console.error("No question found at index", currentQuestionIndex);
    finishQuiz();
    return;
  }

  questionText.innerText = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.innerText = option.text;

    button.onclick = () => selectOption(option);
    optionsContainer.appendChild(button);
  });

  updateProgress();
}

function selectOption(option) {
  if (currentQuestionIndex >= questions.length) return;

  traits[option.trait] += option.value;

  const q = questions[currentQuestionIndex];
  answersLog.push({
    questionId: q.id,
    question: q.question,
    selected: option.text,
    trait: option.trait,
    value: option.value
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}


function normalizeTraits(rawTraits) {
  const maxPossible = questions.length * 2;

  const normalized = {};
  Object.entries(rawTraits).forEach(([trait, value]) => {
    normalized[trait] = maxPossible === 0 ? 0 : value / maxPossible;
  });

  return normalized;
}

function getTopCareers(normalizedTraits, topN = 3) {
  const scored = careers.map((career) => {
    const focusTraits = career.focusTraits || [career.primaryTrait, career.secondaryTrait].filter(Boolean);

    if (!focusTraits || focusTraits.length === 0) {
      return {
        id: career.id,
        name: career.name,
        description: career.description,
        score: 0
      };
    }

    let score = 0;
    focusTraits.forEach((trait) => {
      score += normalizedTraits[trait] || 0;
    });

    score = score / focusTraits.length;

    return {
      id: career.id,
      name: career.name,
      description: career.description,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}


function finishQuiz() {
  const progressFill = document.getElementById("progressFill");
  if (progressFill) progressFill.style.width = "100%";

  if (!careers || careers.length === 0) {
    alert("Careers data missing!");
    return;
  }

  const normalizedTraits = normalizeTraits(traits);
  const topCareers = getTopCareers(normalizedTraits, 3);

  if (!topCareers || topCareers.length === 0) {
    alert("No careers found!");
    return;
  }

  const bestCareer = topCareers[0];

  const resultData = {
    bestCareer,
    topCareers,
    traits: normalizedTraits,
    rawTraits: traits,
    answers: answersLog,
    totalQuestions: questions.length,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem("assessmentResult", JSON.stringify(resultData));

  const history = JSON.parse(localStorage.getItem("assessmentHistory") || "[]");
  history.push(resultData);
  localStorage.setItem("assessmentHistory", JSON.stringify(history));

  console.log("Quiz finished. Redirecting...");
  window.location.href = "Result_page.html";
}


window.onload = loadData;
