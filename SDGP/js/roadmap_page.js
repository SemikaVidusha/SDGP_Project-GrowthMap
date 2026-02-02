async function loadCareerRoadmap() {
  const root = document.getElementById("roadmap-root");
  const selectedCareerId = localStorage.getItem("selectedCareerId");

  if (!selectedCareerId) {
    root.innerHTML = `
      <h2>No Career Selected</h2>
      <p>Please complete the assessment first.</p>
      <button onclick="goBack()">Back to Results</button>
    `;
    return;
  }

  try {
    const response = await fetch("../data/roadmaps.json");
    const roadmaps = await response.json();

    const careerRoadmap = roadmaps.find(
      r => r.careerId === selectedCareerId
    );

    if (!careerRoadmap) {
      root.innerHTML = `
        <h2>Roadmap Not Available</h2>
        <p>No roadmap found for this career.</p>
        <button onclick="goBack()">Back to Results</button>
      `;
      return;
    }

    renderRoadmap(careerRoadmap);
  } catch (error) {
    console.error("Failed to load roadmap:", error);
    root.innerHTML = `
      <h2>Error Loading Roadmap</h2>
      <p>Please try again later.</p>
    `;
  }
}

function renderRoadmap(data) {
  const root = document.getElementById("roadmap-root");

  root.innerHTML = `
    <header class="roadmap-header">
      <h1>${data.title} Career Roadmap</h1>
      <p>A step-by-step learning and qualification pathway.</p>
    </header>

    <section class="roadmap-container">
      ${data.roadmap.map(stage => `
        <div class="roadmap-stage">
          <h2>${stage.level}</h2>
          <h3>${stage.title}</h3>
          <p><strong>Duration:</strong> ${stage.duration}</p>
          <p>${stage.description}</p>

          <div class="roadmap-block">
            <strong>Skills to Develop</strong>
            <ul>
              ${stage.skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>
          </div>

          <div class="roadmap-block">
            <strong>Tools & Technologies</strong>
            <ul>
              ${stage.tools.map(tool => `<li>${tool}</li>`).join("")}
            </ul>
          </div>

          <div class="roadmap-block">
            <strong>Recommended Qualifications</strong>
            <ul>
              ${stage.qualifications.map(q => `<li>${q}</li>`).join("")}
            </ul>
          </div>
        </div>
      `).join("")}
    </section>

    <div class="roadmap-actions">
      <button onclick="goBack()">Back to Results</button>
    </div>
  `;
}

function goBack() {
  window.location.href = "Result_page.html";
}

window.onload = loadCareerRoadmap;
