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
  let results = careers.map(career => {
    let score =
      traits[career.primary] * 2 +
      traits[career.secondary];
    return { name: career.name, score };
  });

  results.sort((a, b) => b.score - a.score);
  showResults(results[0]);
}

function showResults(bestCareer) {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").innerHTML = `
    <h2>Your Recommended Career</h2>
    <p>${bestCareer.name}</p>
  `;
}

window.onload = loadData;
