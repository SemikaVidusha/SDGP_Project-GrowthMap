const traitDescriptions = {
  collaboration: "Skill in working with teams, communication, and coordinating with others.",
  creativity: "Capacity for innovative thinking, design sense, and generating novel solutions.",
  logic: "Ability to analyze problems systematically and think in structured, sequential steps.",
  systems: "Aptitude for understanding how complex systems work and interconnect.",
  detail: "Precision and thoroughness in completing tasks and spotting inconsistencies."
};

window.onload = () => {
  const resultRaw = localStorage.getItem("assessmentResult");

  if (!resultRaw) {
    alert("No quiz result found. Please take the quiz first.");
    window.location.href = "career_quiz.html";
    return;
  }

  const result = JSON.parse(resultRaw);

  document.getElementById("bestCareerTitle").innerText =
    result.bestCareer?.name || "Unknown Career";

  document.getElementById("bestCareerDesc").innerText =
    result.bestCareer?.description || "";

  document.getElementById("matchPercent").innerText =
    `${Math.round((result.bestCareer?.score || 0) * 100)}% Match`;

  renderTraits(result.traits);

  renderTopCareers(result.topCareers || []);
};


function renderTraits(traits) {
  const container = document.getElementById("traitsGrid");
  container.innerHTML = "";

  Object.entries(traits).forEach(([trait, value]) => {
    const percent = Math.round(value * 100);

    const card = document.createElement("div");
    card.className = "trait-card";

    card.innerHTML = `
      <h4>${capitalize(trait)}</h4>
      <p>${traitDescriptions[trait] || ""}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
      <small>${percent}%</small>
    `;

    container.appendChild(card);
  });
}


function renderTopCareers(careers) {
  const container = document.getElementById("topCareersContainer");
  container.innerHTML = "";

  careers.forEach((career, index) => {
    const percent = Math.round((career.score || 0) * 100);

    const card = document.createElement("div");
    card.className = "career-card";

    card.innerHTML = `
      <div class="career-rank">#${index + 1}</div>
      <h3>${career.name}</h3>
      <p class="career-percent">${percent}% Match</p>
      <p class="career-desc">${career.description || ""}</p>

      <button class="roadmap-btn" onclick="goToRoadmap('${career.id}')">
        View Roadmap →
      </button>
    `;

    container.appendChild(card);
  });
}


function goToRoadmap(careerId) {
  localStorage.setItem("selectedCareerId", careerId);
  window.location.href = "CareerRoadmapPage.html";
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
