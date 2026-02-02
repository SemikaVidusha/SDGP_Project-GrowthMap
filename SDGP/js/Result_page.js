const traitDescriptions = {
  collaboration: "Skill in working with teams, communication, and coordinating with others.",
  creativity: "Capacity for innovative thinking, design sense, and generating novel solutions.",
  logic: "Ability to analyze problems systematically and think in structured, sequential steps.",
  systems: "Aptitude for understanding how complex systems work and interconnect.",
  detail: "Precision and thoroughness in completing tasks and spotting inconsistencies."
};

function capPercent(n) {
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function renderResult(data) {
  const root = document.getElementById("result-root");

  const best = data.bestCareer;
  const matchPercent = capPercent(Math.round(best.score * 100));

  let careerHTML = `
    <div class="career-card">
      <h2>${best.name}</h2>
      <p>${best.description || ""}</p>
      <p><strong>Match Score:</strong> ${matchPercent}%</p>
      <button id="roadmapBtn">View Roadmap</button>
    </div>
  `;

  let traitsHTML = `
    <div class="trait-grid">
      ${Object.entries(data.traits).map(([trait, value]) => {
        const percent = capPercent(Math.round(value * 100));
        return `
          <div class="trait-card">
            <h4>${trait.charAt(0).toUpperCase() + trait.slice(1)}</h4>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${percent}%"></div>
            </div>
            <p>${percent}% - ${traitDescriptions[trait] || ""}</p>
          </div>
        `;
      }).join("")}
    </div>
  `;

  root.innerHTML = `
    ${careerHTML}
    ${traitsHTML}
    <div class="actions">
      <button class="secondary-btn" id="retakeBtn">Retake Quiz</button>
    </div>
  `;

  document.getElementById("roadmapBtn").onclick = () => {
    localStorage.setItem("selectedCareerId", best.id);
    window.location.href = "CareerRoadmapPage.html";
  };

  document.getElementById("retakeBtn").onclick = () => {
    localStorage.removeItem("assessmentResult");
    window.location.href = "career_quiz.html";
  };
}

window.onload = () => {
  const root = document.getElementById("result-root");
  const data = JSON.parse(localStorage.getItem("assessmentResult"));

  if (!data || !data.bestCareer) {
    root.innerHTML = `
      <h2>No assessment result found</h2>
      <p>Please take the quiz first.</p>
      <a href="career_quiz.html">Go to Quiz</a>
    `;
    return;
  }

  renderResult(data);
};
