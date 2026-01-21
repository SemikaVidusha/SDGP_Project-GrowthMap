let traits = {
  logic: 0,
  creativity: 0,
  systems: 0,
  collaboration: 0
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
    loadQuestion();
  } catch (error) {
    console.error("Data loading failed. Check your JSON syntax!", error);
  }
}

function loadQuestion() {
  if (questions.length === 0) return;

  const q = questions[currentQuestionIndex];
  document.getElementById("questionText").innerText = q.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
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

function calculateCareer() {
  const maxPerTrait = questions.length * 2;
  const normalizedTraits = normaliseTraits(traits, maxPerTrait);
  const dominantTraits = getDomainTraits(normalizedTraits);
  const rankedCareers = scoreCareers(careers, normalizedTraits);

  showResults(rankedCareers[0], dominantTraits);
}

function normaliseTraits(traits, maxPerTrait) {
  let normalized = {};
  for (let trait in traits) {
    normalized[trait] = traits[trait] / maxPerTrait;
  }
  return normalized;
}

function getDomainTraits(normalizedTraits) {
  return Object.entries(normalizedTraits).sort((a, b) => b[1] - a[1]);
}

function scoreCareers(careers, normalizedTraits) {
  return careers.map(career => {
    let score =
      (normalizedTraits[career.primaryTrait] * 2) +
      (normalizedTraits[career.secondaryTrait] * 1);

    return {
      id: career.id,
      name: career.name,
      score: score
    };
  }).sort((a, b) => b.score - a.score);
}

function showResults(bestCareer, dominantTraits) {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").innerHTML = `
    <h2>Your Recommended Career</h2>
    <p><strong>${bestCareer.name}</strong></p>
    <h3>Why this career?</h3>
    <p>Your strongest traits are <strong>${dominantTraits[0][0]}</strong> 
    and <strong>${dominantTraits[1][0]}</strong>.</p>
  `;
}

window.onload = async () => {
  await loadData();

  document.getElementById("nextBtn").onclick = () => {
    if (!selectedAnswer) {
      alert("Please select an option");
      return;
    }

    traits[selectedAnswer.trait] += selectedAnswer.value;
    selectedAnswer = null;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      calculateCareer();
    }
  };
};