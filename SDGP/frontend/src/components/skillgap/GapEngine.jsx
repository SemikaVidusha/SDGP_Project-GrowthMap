// Skill Gap Analysis Engine

const careerRequirements = {
  "software-engineer": {
    title: "Software Engineer",
    education: "degree",
    experience: 1,
    technicalSkills: ["Programming", "Data Structures", "Algorithms", "Version Control", "Testing", "Software Design", "APIs", "Databases"],
    softSkills: ["Problem Solving", "Teamwork", "Communication", "Time Management"],
    certifications: ["AWS Certified Developer", "Oracle Java", "Google Associate Android Developer"],
    color: "from-blue-500 to-cyan-500",
    timeline: "6–18 months",
    resources: [
      { name: "IJSE – Java & Programming", url: "https://ijse.lk", type: "Paid", skill: "Programming", institute: { name: "IJSE (Institute of Java & Software Engineering)", address: "No. 374, Galle Road, Colombo 03, Sri Lanka", lat: 6.8962, lng: 79.8553, isLocal: true } },
      { name: "SLIIT – BSc IT", url: "https://sliit.lk", type: "Paid", skill: "Computer Science", institute: { name: "SLIIT", address: "New Kandy Road, Malabe, Sri Lanka", lat: 6.9157, lng: 79.9747, isLocal: true } },
      { name: "freeCodeCamp (Online)", url: "https://www.freecodecamp.org", type: "Free", skill: "Programming", institute: null },
      { name: "LeetCode (Online)", url: "https://leetcode.com", type: "Free", skill: "Algorithms", institute: null },
      { name: "ESOFT – Diploma in Software Engineering", url: "https://esoft.lk", type: "Paid", skill: "Full Stack", institute: { name: "ESOFT Metro Campus", address: "No. 388, Galle Road, Colombo 03, Sri Lanka", lat: 6.8938, lng: 79.8567, isLocal: true } },
    ]
  },
  "data-analyst": {
    title: "Data Analyst",
    education: "diploma",
    experience: 0,
    technicalSkills: ["SQL", "Excel", "Python", "Statistics", "Data Visualization", "Power BI", "Tableau", "R"],
    softSkills: ["Analytical Thinking", "Attention to Detail", "Communication", "Critical Thinking"],
    certifications: ["Google Data Analytics", "IBM Data Analyst", "Microsoft Power BI"],
    color: "from-orange-500 to-amber-500",
    timeline: "3–12 months",
    resources: [
      { name: "NSBM – BSc Data Science", url: "https://nsbm.ac.lk", type: "Paid", skill: "Data Analytics", institute: { name: "NSBM Green University", address: "Pitipana, Homagama, Sri Lanka", lat: 6.8399, lng: 80.0286, isLocal: true } },
      { name: "Kaggle Learn (Online)", url: "https://kaggle.com/learn", type: "Free", skill: "Python/ML", institute: null },
      { name: "NIBM – Diploma in Data Analytics", url: "https://nibm.lk", type: "Paid", skill: "SQL & BI", institute: { name: "NIBM", address: "No. 75, Vincent Perera Mawatha, Colombo 02, Sri Lanka", lat: 6.9204, lng: 79.8537, isLocal: true } },
      { name: "Google Data Analytics Certificate (Online)", url: "https://coursera.org", type: "Paid", skill: "Data Analytics", institute: null },
    ]
  },
  "ui-ux-designer": {
    title: "UI/UX Designer",
    education: "diploma",
    experience: 0,
    technicalSkills: ["Figma", "Wireframing", "Prototyping", "User Research", "Visual Design", "Adobe XD", "Usability Testing"],
    softSkills: ["Creativity", "Empathy", "Communication", "Attention to Detail", "Collaboration"],
    certifications: ["Google UX Design Certificate", "Interaction Design Foundation", "Nielsen Norman UX"],
    color: "from-purple-500 to-pink-500",
    timeline: "3–9 months",
    resources: [
      { name: "ESOFT – Diploma in UI/UX Design", url: "https://esoft.lk", type: "Paid", skill: "UX Design", institute: { name: "ESOFT Metro Campus", address: "No. 388, Galle Road, Colombo 03, Sri Lanka", lat: 6.8938, lng: 79.8567, isLocal: true } },
      { name: "IIT – Creative & Digital Design", url: "https://iit.ac.lk", type: "Paid", skill: "Visual Design", institute: { name: "Informatics Institute of Technology (IIT)", address: "57, Ramakrishna Road, Colombo 06, Sri Lanka", lat: 6.8867, lng: 79.8624, isLocal: true } },
      { name: "Google UX Design Certificate (Online)", url: "https://coursera.org", type: "Paid", skill: "UX Design", institute: null },
      { name: "Figma Tutorial (Online – YouTube)", url: "https://youtube.com", type: "Free", skill: "Figma", institute: null },
    ]
  },
  "cybersecurity-specialist": {
    title: "Cybersecurity Specialist",
    education: "degree",
    experience: 1,
    technicalSkills: ["Networking", "Linux", "Ethical Hacking", "Firewalls", "Risk Assessment", "Incident Response", "Cryptography", "SIEM"],
    softSkills: ["Analytical Thinking", "Attention to Detail", "Problem Solving", "Continuous Learning"],
    certifications: ["CompTIA Security+", "CEH", "CISSP", "OSCP"],
    color: "from-green-500 to-emerald-500",
    timeline: "6–24 months",
    resources: [
      { name: "SLIIT – BSc Cybersecurity", url: "https://sliit.lk", type: "Paid", skill: "Cybersecurity", institute: { name: "SLIIT", address: "New Kandy Road, Malabe, Sri Lanka", lat: 6.9157, lng: 79.9747, isLocal: true } },
      { name: "University of Colombo – Cyber Security", url: "https://ucsc.cmb.ac.lk", type: "Paid", skill: "Networking & Security", institute: { name: "University of Colombo School of Computing (UCSC)", address: "35, Reid Avenue, Colombo 07, Sri Lanka", lat: 6.9022, lng: 79.8607, isLocal: true } },
      { name: "TryHackMe (Online)", url: "https://tryhackme.com", type: "Freemium", skill: "Ethical Hacking", institute: null },
      { name: "Cybrary (Online)", url: "https://cybrary.it", type: "Freemium", skill: "Security Concepts", institute: null },
    ]
  },
  "web-developer": {
    title: "Web Developer",
    education: "diploma",
    experience: 0,
    technicalSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Responsive Design", "REST APIs", "Git"],
    softSkills: ["Problem Solving", "Creativity", "Attention to Detail", "Communication"],
    certifications: ["Meta Front-End Developer", "AWS Amplify", "Google Mobile Web Specialist"],
    color: "from-cyan-500 to-blue-500",
    timeline: "3–12 months",
    resources: [
      { name: "IJSE – Web Development", url: "https://ijse.lk", type: "Paid", skill: "Full Stack", institute: { name: "IJSE", address: "No. 374, Galle Road, Colombo 03, Sri Lanka", lat: 6.8962, lng: 79.8553, isLocal: true } },
      { name: "ESOFT – Diploma in Web Design", url: "https://esoft.lk", type: "Paid", skill: "HTML/CSS/JS", institute: { name: "ESOFT Metro Campus", address: "No. 388, Galle Road, Colombo 03, Sri Lanka", lat: 6.8938, lng: 79.8567, isLocal: true } },
      { name: "freeCodeCamp (Online)", url: "https://freecodecamp.org", type: "Free", skill: "HTML/CSS/JS", institute: null },
      { name: "Full Stack Open (Online)", url: "https://fullstackopen.com", type: "Free", skill: "React/Node", institute: null },
    ]
  },
  "network-technician": {
    title: "Network Technician",
    education: "diploma",
    experience: 0,
    technicalSkills: ["TCP/IP", "Network Configuration", "Routing", "Switching", "Firewalls", "VPN", "Troubleshooting", "Hardware"],
    softSkills: ["Problem Solving", "Attention to Detail", "Communication", "Patience"],
    certifications: ["CCNA", "CompTIA Network+", "CompTIA A+"],
    color: "from-indigo-500 to-purple-500",
    timeline: "6–12 months",
    resources: [
      { name: "NIBM – Diploma in Networking", url: "https://nibm.lk", type: "Paid", skill: "Networking Fundamentals", institute: { name: "NIBM", address: "No. 75, Vincent Perera Mawatha, Colombo 02, Sri Lanka", lat: 6.9204, lng: 79.8537, isLocal: true } },
      { name: "ACBT – CCNA Training", url: "https://acbt.lk", type: "Paid", skill: "CCNA Prep", institute: { name: "ACBT Sri Lanka", address: "No. 3, Alfred Place, Colombo 03, Sri Lanka", lat: 6.9044, lng: 79.8543, isLocal: true } },
      { name: "Cisco Networking Academy (Online)", url: "https://netacad.com", type: "Free", skill: "Networking Fundamentals", institute: null },
    ]
  },
  "mobile-developer": {
    title: "Mobile App Developer",
    education: "diploma",
    experience: 0,
    technicalSkills: ["Java/Kotlin", "Swift", "React Native", "Flutter", "Mobile UI Design", "APIs", "App Store Deployment", "Debugging"],
    softSkills: ["Problem Solving", "Creativity", "Attention to Detail", "Teamwork"],
    certifications: ["Google Associate Android Developer", "Apple Developer", "Meta Android Developer"],
    color: "from-rose-500 to-orange-500",
    timeline: "6–18 months",
    resources: [
      { name: "ESOFT – Diploma in Mobile App Development", url: "https://esoft.lk", type: "Paid", skill: "Android Dev", institute: { name: "ESOFT Metro Campus", address: "No. 388, Galle Road, Colombo 03, Sri Lanka", lat: 6.8938, lng: 79.8567, isLocal: true } },
      { name: "IJSE – Flutter & Mobile Dev", url: "https://ijse.lk", type: "Paid", skill: "Flutter", institute: { name: "IJSE", address: "No. 374, Galle Road, Colombo 03, Sri Lanka", lat: 6.8962, lng: 79.8553, isLocal: true } },
      { name: "Android Basics by Google (Online)", url: "https://developer.android.com", type: "Free", skill: "Android Dev", institute: null },
    ]
  },
  "database-administrator": {
    title: "Database Administrator",
    education: "degree",
    experience: 1,
    technicalSkills: ["SQL", "Database Design", "Performance Tuning", "Backup & Recovery", "Security", "NoSQL", "Cloud Databases", "Indexing"],
    softSkills: ["Analytical Thinking", "Attention to Detail", "Problem Solving", "Documentation"],
    certifications: ["Oracle Certified Professional", "AWS Database Specialty", "Microsoft SQL Server"],
    color: "from-teal-500 to-cyan-500",
    timeline: "6–18 months",
    resources: [
      { name: "University of Moratuwa – BSc IT (Database)", url: "https://uom.lk", type: "Free", skill: "SQL & Database Design", institute: { name: "University of Moratuwa", address: "Bandaranayake Mawatha, Moratuwa, Sri Lanka", lat: 6.7964, lng: 79.9001, isLocal: true } },
      { name: "NIBM – Diploma in Database Management", url: "https://nibm.lk", type: "Paid", skill: "Oracle DB", institute: { name: "NIBM", address: "No. 75, Vincent Perera Mawatha, Colombo 02, Sri Lanka", lat: 6.9204, lng: 79.8537, isLocal: true } },
      { name: "SQLZoo (Online)", url: "https://sqlzoo.net", type: "Free", skill: "SQL", institute: null },
    ]
  },
  "project-manager": {
    title: "IT Project Manager",
    education: "degree",
    experience: 2,
    technicalSkills: ["Agile", "Scrum", "Jira", "Risk Management", "Budgeting", "Stakeholder Management", "MS Project", "SDLC"],
    softSkills: ["Leadership", "Communication", "Negotiation", "Decision Making", "Teamwork"],
    certifications: ["PMP", "PRINCE2", "Scrum Master", "Google Project Management"],
    color: "from-violet-500 to-purple-600",
    timeline: "6–24 months",
    resources: [
      { name: "SLIIT – MSc IT Management", url: "https://sliit.lk", type: "Paid", skill: "PM Fundamentals", institute: { name: "SLIIT", address: "New Kandy Road, Malabe, Sri Lanka", lat: 6.9157, lng: 79.9747, isLocal: true } },
      { name: "CINEC Campus – IT Project Management", url: "https://cinec.edu", type: "Paid", skill: "Scrum/Agile", institute: { name: "CINEC Campus", address: "Millennium Drive, Malabe, Sri Lanka", lat: 6.9108, lng: 79.9697, isLocal: true } },
      { name: "Google Project Management Certificate (Online)", url: "https://coursera.org", type: "Paid", skill: "PM Fundamentals", institute: null },
      { name: "Scrum.org (Online)", url: "https://scrum.org", type: "Free", skill: "Scrum/Agile", institute: null },
    ]
  },
  "qa-engineer": {
    title: "QA Engineer",
    education: "diploma",
    experience: 0,
    technicalSkills: ["Manual Testing", "Test Automation", "Selenium", "Postman", "Bug Tracking", "Test Planning", "JIRA", "API Testing"],
    softSkills: ["Attention to Detail", "Analytical Thinking", "Problem Solving", "Communication"],
    certifications: ["ISTQB Foundation", "Selenium Certification", "Postman API Testing"],
    color: "from-sky-500 to-blue-600",
    timeline: "3–9 months",
    resources: [
      { name: "ESOFT – Diploma in Software Testing", url: "https://esoft.lk", type: "Paid", skill: "Testing Foundations", institute: { name: "ESOFT Metro Campus", address: "No. 388, Galle Road, Colombo 03, Sri Lanka", lat: 6.8938, lng: 79.8567, isLocal: true } },
      { name: "IJSE – QA & Automation", url: "https://ijse.lk", type: "Paid", skill: "Test Automation", institute: { name: "IJSE", address: "No. 374, Galle Road, Colombo 03, Sri Lanka", lat: 6.8962, lng: 79.8553, isLocal: true } },
      { name: "Postman Learning Center (Online)", url: "https://learning.postman.com", type: "Free", skill: "API Testing", institute: null },
    ]
  }
};

const educationLevels = { "ol": 1, "al": 2, "diploma": 3, "degree": 4, "postgrad": 5 };
const educationRequired = { "ol": 1, "al": 2, "diploma": 3, "degree": 4 };

export function analyzeSkillGap(formData) {
  const { targetCareer, currentEducation, yearsExperience, technicalSkills, softSkills, certifications } = formData;
  const career = careerRequirements[targetCareer];
  if (!career) return null;

  const userTechSkills = technicalSkills.map(s => s.toLowerCase().trim());
  const userSoftSkills = softSkills.map(s => s.toLowerCase().trim());
  const userCerts = certifications.map(s => s.toLowerCase().trim());

  // Education match
  const userEduLevel = educationLevels[currentEducation] || 1;
  const requiredEduLevel = educationRequired[career.education] || 1;
  const educationMet = userEduLevel >= requiredEduLevel;

  // Experience match
  const expGap = Math.max(0, career.experience - parseFloat(yearsExperience || 0));

  // Tech skills analysis
  const techAnalysis = career.technicalSkills.map(skill => {
    const matched = userTechSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us));
    return { skill, matched };
  });
  const matchedTech = techAnalysis.filter(s => s.matched).length;
  const missingTech = techAnalysis.filter(s => !s.matched).map(s => s.skill);

  // Soft skills analysis
  const softAnalysis = career.softSkills.map(skill => {
    const matched = userSoftSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us));
    return { skill, matched };
  });
  const matchedSoft = softAnalysis.filter(s => s.matched).length;
  const missingSoft = softAnalysis.filter(s => !s.matched).map(s => s.skill);

  // Certifications
  const certAnalysis = career.certifications.map(cert => {
    const matched = userCerts.some(uc => uc.includes(cert.toLowerCase().substring(0, 6)) || cert.toLowerCase().includes(uc.substring(0, 5)));
    return { cert, matched };
  });
  const matchedCerts = certAnalysis.filter(c => c.matched).length;

  // Overall match score (weighted)
  const techWeight = 0.5;
  const softWeight = 0.25;
  const eduWeight = 0.15;
  const certWeight = 0.1;

  const techScore = career.technicalSkills.length > 0 ? matchedTech / career.technicalSkills.length : 1;
  const softScore = career.softSkills.length > 0 ? matchedSoft / career.softSkills.length : 1;
  const eduScore = educationMet ? 1 : userEduLevel / requiredEduLevel;
  const certScore = career.certifications.length > 0 ? matchedCerts / career.certifications.length : 1;

  const matchPercentage = Math.round((techScore * techWeight + softScore * softWeight + eduScore * eduWeight + certScore * certWeight) * 100);

  // Priority gaps (missing critical tech skills first)
  const priorityGaps = [
    ...missingTech.slice(0, 5).map(s => ({ skill: s, type: 'technical', priority: 'high' })),
    ...missingSoft.slice(0, 3).map(s => ({ skill: s, type: 'soft', priority: 'medium' })),
    ...(!educationMet ? [{ skill: `${career.education.charAt(0).toUpperCase() + career.education.slice(1)} degree/diploma`, type: 'education', priority: 'high' }] : []),
  ];

  // Estimated timeline
  const baseTimeline = career.timeline;

  return {
    career,
    careerKey: targetCareer,
    matchPercentage,
    techAnalysis,
    softAnalysis,
    certAnalysis,
    educationMet,
    expGap,
    missingTech,
    missingSoft,
    matchedTech,
    matchedSoft,
    matchedCerts,
    priorityGaps,
    timeline: baseTimeline,
    readinessLevel: matchPercentage >= 75 ? 'ready' : matchPercentage >= 50 ? 'close' : matchPercentage >= 25 ? 'developing' : 'beginner',
  };
}

export { careerRequirements };