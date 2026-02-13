// result_page.js

const traitDescriptions = {
  logic: "Ability to analyze problems systematically and think in structured steps.",
  creativity: "Capacity for innovative thinking, design sense, and originality.",
  leadership: "Skill in guiding teams, decision-making, and motivating others.",
  empathy: "Understanding emotions, supporting others, and emotional intelligence.",
  discipline: "Consistency, self-control, and responsibility in work.",
  social: "Communication skills, teamwork, and interpersonal ability.",
  technical: "Interest and skill in technology, systems, and computing.",
  risk: "Willingness to try new things and take calculated risks.",
  focus: "Ability to concentrate deeply and avoid distractions.",
  adaptability: "Flexibility and ability to adjust to change."
};

let careersData = [];

// load careers data first so we can use it synchronously later
async function loadCareers() {
  try {
    const res = await fetch("../data/careers.json");
    careersData = await res.json();
  } catch (err) {
    console.error("Failed loading careers.json", err);
    careersData = [];
  }
}

window.onload = async () => {
  await loadCareers();

  const resultRaw = localStorage.getItem("assessmentResult");

  if (!resultRaw) {
    alert("No quiz result found. Please take the quiz first.");
    window.location.href = "career_quiz.html";
    return;
  }

  const result = JSON.parse(resultRaw);

  // Determine bestCareerId robustly (API vs local formats)
  // result.bestCareer may be string id or object; topCareers items have .career (id) and .score
  let bestCareerId = null;
  if (typeof result.bestCareer === "string") {
    bestCareerId = result.bestCareer;
  } else if (result.bestCareer && result.bestCareer.id) {
    bestCareerId = result.bestCareer.id;
  } else if (result.topCareers && result.topCareers[0] && result.topCareers[0].career) {
    bestCareerId = result.topCareers[0].career;
  }

  const bestCareerObj = careersData.find(c => c.id === bestCareerId);

  // Render main recommended career card (top1)
  const bestTitleEl = document.getElementById("bestCareerTitle");
  const bestDescEl = document.getElementById("bestCareerDesc");
  const matchPercentEl = document.getElementById("matchPercent");
  const mainActionsEl = document.getElementById("mainCareerActions"); // optional container for buttons

  if (bestTitleEl) bestTitleEl.innerText = bestCareerObj?.name || (bestCareerId || "Unknown Career");
  if (bestDescEl) bestDescEl.innerText = bestCareerObj?.description || "";

  // Best score: prefer topCareers[0].score (from model). Fallback to bestCareer object score if available.
  const bestScore = (result.topCareers && result.topCareers[0] && typeof result.topCareers[0].score === "number")
    ? result.topCareers[0].score
    : (result.bestCareer && result.bestCareer.score) ? result.bestCareer.score : 0;

  if (matchPercentEl) matchPercentEl.innerText = `${Math.round(bestScore * 100)}% Match`;

  // Add a View Roadmap button for the recommended career (if missing in markup)
  if (mainActionsEl) {
    // remove existing if any (idempotent)
    const existing = document.getElementById("viewRoadmapMainBtn");
    if (existing) existing.remove();

    const roadmapBtn = document.createElement("button");
    roadmapBtn.id = "viewRoadmapMainBtn";
    roadmapBtn.className = "roadmap-btn primary-btn";
    roadmapBtn.innerText = "View Roadmap";
    roadmapBtn.onclick = () => {
      localStorage.setItem("selectedCareerId", bestCareerId);
      window.location.href = "CareerRoadmapPage.html";
    };
    mainActionsEl.appendChild(roadmapBtn);
  }

  // Render traits (first 5 visible, rest behind a "More" toggle)
  renderTraits(result.traits || {});

  // Render top 2 and 3 below (topCareers[1] and topCareers[2])
  renderTopCareers(result.topCareers || []);
};

/* ------------ Traits UI (5 shown, 5 hidden) ------------ */

function renderTraits(traits) {
  const container = document.getElementById("traitsGrid");
  if (!container) return;
  container.innerHTML = "";

  // Ensure consistent ordering of traits for user friendliness
  const order = ["logic","creativity","leadership","empathy","discipline","social","technical","risk","focus","adaptability"];
  const entries = order.map(t => [t, traits[t] ?? 0]);

  const firstFive = entries.slice(0, 5);
  const hiddenFive = entries.slice(5);

  firstFive.forEach(t => container.appendChild(createTraitCard(t)));

  if (hiddenFive.length > 0) {
    const btn = document.createElement("button");
    btn.className = "more-traits-btn secondary-btn";
    btn.innerText = "More Traits ▼";

    const hiddenDiv = document.createElement("div");
    hiddenDiv.id = "hiddenTraits";
    hiddenDiv.style.display = "none";
    hiddenDiv.style.marginTop = "12px";
    hiddenDiv.style.display = "grid";
    hiddenDiv.style.gridTemplateColumns = "repeat(auto-fit,minmax(180px,1fr))";
    hiddenDiv.style.gap = "12px";
    // Initially hidden
    hiddenDiv.style.display = "none";

    hiddenFive.forEach(t => hiddenDiv.appendChild(createTraitCard(t)));

    btn.onclick = () => {
      const isHidden = hiddenDiv.style.display === "none";
      hiddenDiv.style.display = isHidden ? "grid" : "none";
      btn.innerText = isHidden ? "Less Traits ▲" : "More Traits ▼";
    };

    container.appendChild(btn);
    container.appendChild(hiddenDiv);
  }
}

function createTraitCard([trait, value]) {
  const percent = Math.round((value || 0) * 100);

  const card = document.createElement("div");
  card.className = "trait-card";

  card.innerHTML = `
    <h4>${capitalize(trait)}</h4>
    <p style="font-size:12px;color:#666;margin-top:4px">${traitDescriptions[trait] || ""}</p>
    <div class="progress-bar" style="margin-top:8px">
      <div class="progress-fill" style="width:${percent}%;"></div>
    </div>
    <small style="display:block;margin-top:6px">${percent}%</small>
  `;

  return card;
}

/* ------------ Top 2 & 3 Careers UI ------------ */

function renderTopCareers(careers) {
  const container = document.getElementById("topCareersContainer");
  if (!container) return;
  container.innerHTML = "";

  // We assume careers[0] is the top (already shown above)
  const showList = (careers || []).slice(1, 3); // show indexes 1 and 2 only

  if (showList.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#666">No additional matches to show.</p>`;
    return;
  }

  showList.forEach((item, index) => {
    const careerObj = careersData.find(c => c.id === item.career);

    const percent = Math.round((item.score || 0) * 100);

    const card = document.createElement("div");
    card.className = "career-card";

    card.innerHTML = `
      <div class="career-rank">#${index + 2}</div>
      <h3>${careerObj?.name || item.career}</h3>
      <p class="career-percent">${percent}% Match</p>
      <p class="career-desc">${careerObj?.description || ""}</p>
      <button class="roadmap-btn" data-career-id="${item.career}">View Roadmap →</button>
    `;

    // attach click
    const btn = card.querySelector("button.roadmap-btn");
    btn.onclick = () => {
      localStorage.setItem("selectedCareerId", item.career);
      window.location.href = "CareerRoadmapPage.html";
    };

    container.appendChild(card);
  });
}

function goToRoadmap(careerId) {
  localStorage.setItem("selectedCareerId", careerId);
  window.location.href = "CareerRoadmapPage.html";
}

function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
