async function loadRoadmaps(careerId) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/api/roadmaps/${careerId}`);
    return await res.json();
  } catch (e) {
    console.error("Failed loading roadmaps", e);
    return null;
  }
}


async function loadCareers() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/careers");
    return await res.json();
  } catch (e) {
    console.error("Failed loading careers.json", e);
    return [];
  }
}

function renderRoadmap(roadmapObj, careerObj = null) {
  const root = document.getElementById("roadmap-root");

  if (!roadmapObj && !careerObj) {
    root.innerHTML = `
      <div class="roadmap-container">
        <h2>No roadmap found</h2>
        <p>Roadmap information is not available for this career.</p>
        <a href="Result_page.html">← Back to Results</a>
      </div>
    `;
    return;
  }

  const title = (roadmapObj && roadmapObj.title) || (careerObj && careerObj.name) || "Career Roadmap";
  const stages = (roadmapObj && (roadmapObj.stages || roadmapObj.roadmap)) || [];

  const finalStages = stages.length ? stages : (careerObj ? [
    {
      level: "Foundation",
      duration: "3-6 months",
      title: `Foundations for ${careerObj.name}`,
      description: careerObj.description || "",
      requirements: ["Basic computer literacy"],
      skills: ["Core domain knowledge"],
      tools: [],
      projects: ["Intro project"],
      qualifications: []
    },
    {
      level: "Intermediate",
      duration: "6-12 months",
      title: "Intermediate skills",
      description: "Expand practical skills and build portfolio.",
      skills: ["Practical applications"],
      projects: ["Portfolio project"]
    },
    {
      level: "Professional",
      duration: "12+ months",
      title: "Professional readiness",
      description: "Prepare for job roles and specialize.",
      skills: ["Advanced skills"],
      projects: ["Team project"]
    }
  ] : []);

  if (finalStages.length === 0) {
    root.innerHTML = `
      <div class="roadmap-container">
        <h2>No stages available</h2>
        <p>This career roadmap has no stages yet.</p>
        <a href="Result_page.html">← Back to Results</a>
      </div>
    `;
    return;
  }

  const stagesHTML = finalStages.map(stage => {
    const requirementsHTML = stage.requirements?.length
      ? `<div class="stage-section"><h4>Requirements</h4><ul>${stage.requirements.map(r => `<li>${r}</li>`).join("")}</ul></div>`
      : "";

    const skillsHTML = stage.skills?.length
      ? `<div class="stage-section"><h4>Skills</h4><ul>${stage.skills.map(s => `<li>${s}</li>`).join("")}</ul></div>`
      : "";

    const toolsHTML = stage.tools?.length
      ? `<div class="stage-section"><h4>Tools</h4><ul>${stage.tools.map(t => `<li>${t}</li>`).join("")}</ul></div>`
      : "";

    const projectsHTML = stage.projects?.length
      ? `<div class="stage-section"><h4>Projects</h4><ul>${stage.projects.map(p => `<li>${p}</li>`).join("")}</ul></div>`
      : "";

    const qualificationsHTML = stage.qualifications?.length
      ? `<div class="stage-section"><h4>Qualifications</h4><ul>${stage.qualifications.map(q => `<li>${q}</li>`).join("")}</ul></div>`
      : "";

    const milestoneHTML = stage.milestone
      ? `<div class="stage-section"><h4>Milestone</h4><p>${stage.milestone}</p></div>`
      : "";

    return `
      <div class="roadmap-stage">
        <div class="stage-header">
          <span class="badge">${stage.level || "Stage"}</span>
          <span class="duration">${stage.duration || ""}</span>
          <h3>${stage.title || ""}</h3>
          <p>${stage.description || ""}</p>
        </div>

        ${requirementsHTML}
        ${skillsHTML}
        ${toolsHTML}
        ${projectsHTML}
        ${qualificationsHTML}
        ${milestoneHTML}
      </div>
    `;
  }).join("");

  root.innerHTML = `
    <div class="roadmap-container">
      <h1>${title}</h1>
      <p>This is your recommended learning path based on your assessment.</p>

      <div style="margin: 12px 0 20px;">
        <button id="backBtn" class="badge" style="cursor:pointer;border:none;">
          Back
        </button>
      </div>

      ${stagesHTML}
    </div>
  `;

  document.getElementById("backBtn").onclick = () => {
    window.location.href = "Result_page.html";
  };
}

window.onload = async () => {
  const careerId = localStorage.getItem("selectedCareerId");

  if (!careerId) {
    document.getElementById("roadmap-root").innerHTML = `
      <div class="roadmap-container">
        <h2>No career selected</h2>
        <p>Please complete the quiz first.</p>
        <a href="career_quiz.html">Go to Quiz</a>
      </div>
    `;
    return;
  }

  const [roadmapObj, careersData] = await Promise.all([
    loadRoadmaps(careerId),
    loadCareers()
  ]);

  const careerObj = careersData.find(c => c.id === careerId);

  renderRoadmap(roadmapObj, careerObj);
};

