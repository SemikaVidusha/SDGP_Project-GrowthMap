let questions = [];
let careers = [];
let currentQuestionIndex = 0;

let traits = {
  logic: 0,
  creativity: 0,
  leadership: 0,
  empathy: 0,
  discipline: 0,
  social: 0,
  technical: 0,
  risk: 0,
  focus: 0,
  adaptability: 0
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
      questionText.innerText = "Failed to load quiz data. Please check JSON file paths.";
    }
  }
}

function updateProgress() {
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  const total = questions.length;
  const current = currentQuestionIndex + 1;

  if (progressText) progressText.innerText = `Question ${current} / ${total}`;

  const percent = (currentQuestionIndex / total) * 100;
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

  if (!traits.hasOwnProperty(option.trait)) {
    console.error(`Invalid trait "${option.trait}" in question ${currentQuestionIndex + 1}`);
    alert(`Error: Question contains invalid trait "${option.trait}". Please check questions.json`);
    return;
  }

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
  const maxScores = {};

  questions.forEach(q => {
    q.options.forEach(opt => {
      if (!maxScores[opt.trait] || opt.value > maxScores[opt.trait]) {
        maxScores[opt.trait] = opt.value;
      }
    });
  });

  const normalized = {};
  Object.keys(rawTraits).forEach(trait => {
    const max = (maxScores[trait] || 1) * questions.length;
    normalized[trait] = max === 0 ? 0 : rawTraits[trait] / max;
  });

  return normalized;
}


async function finishQuiz() {
  const progressFill = document.getElementById("progressFill");
  if (progressFill) progressFill.style.width = "100%";

  const normalizedTraits = normalizeTraits(traits);

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        traits: normalizedTraits
      })
    });

    if (!response.ok) throw new Error("Prediction API failed");

    const prediction = await response.json();

    const resultData = {
      bestCareer: prediction.bestCareer,
      topCareers: prediction.topCareers,
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

    console.log("Quiz finished using ML model. Redirecting...");
    window.location.href = "Result_page.html";

  } catch (err) {
    console.error("ML Prediction Error:", err);
    alert("Prediction server is not responding. Please try again.");
  }
}

window.onload = loadData;