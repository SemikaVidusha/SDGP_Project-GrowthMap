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
  questions = await fetch("../data/questions.json").then(res => res.json());
  careers = await fetch("../data/careers.json").then(res => res.json());
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("questionText").innerText = q.text;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.onclick = () => selectOption(opt);
    optionsContainer.appendChild(btn);
  });
}

function selectOption(option) {
  selectedAnswer = option;
}

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

function calculateCareer() {
  const maxPerTrait = questions.length * 2;

  const normalizedTraits = normaliseTraits(traits, maxPerTrait);

  const dominantTraits = getDomainTraits(normalizedTraits);

  const rankedCareers = scoreCareers(careers, normalizedTraits);

  showResults(rankedCareers[0], dominantTraits);
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


function normalisetraits(traits, maxPertraiit){
  let normalise = {}
  for(let trait in traits){
    normalise[trait] = traits[trait] / maxPertraiit;
  }
  window.print(normalise)
  return normalise
}

function getDomainTraits(normalisedTraits){
  return Object.entries(normalisedTraits).sort((a, b) => b[1] - a[1]);
}

function scoreCareers(careers, normalizedTraits) {
  return careers.map(career => {
    let score =
      (normalizedTraits[career.primary] * 2) +
      (normalizedTraits[career.secondary] * 1);

    return {
      id: career.id,
      name: career.name,
      score: score
    };
  }).sort((a, b) => b.score - a.score);
}


window.onload = loadData;
