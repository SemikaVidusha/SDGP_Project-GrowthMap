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
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", type: "Free", skill: "Programming", institute: { name: "freeCodeCamp (Online)", address: "San Francisco, CA, USA", lat: 37.7749, lng: -122.4194 } },
      { name: "LeetCode", url: "https://leetcode.com", type: "Free", skill: "Algorithms", institute: { name: "LeetCode (Online)", address: "Mountain View, CA, USA", lat: 37.3861, lng: -122.0839 } },
      { name: "CS50 by Harvard", url: "https://cs50.harvard.edu", type: "Free", skill: "Computer Science", institute: { name: "Harvard University", address: "Cambridge, MA 02138, USA", lat: 42.3770, lng: -71.1167 } },
      { name: "The Odin Project", url: "https://www.theodinproject.com", type: "Free", skill: "Full Stack", institute: { name: "The Odin Project (Online)", address: "New York, NY, USA", lat: 40.7128, lng: -74.0060 } },
      { name: "Coursera – Google IT Automation", url: "https://coursera.org", type: "Paid", skill: "Automation", institute: { name: "Coursera HQ", address: "Mountain View, CA 94043, USA", lat: 37.4030, lng: -122.1130 } },
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
      { name: "Google Data Analytics Certificate", url: "https://coursera.org", type: "Paid", skill: "Data Analytics", institute: { name: "Coursera HQ", address: "Mountain View, CA 94043, USA", lat: 37.4030, lng: -122.1130 } },
      { name: "Mode Analytics SQL Tutorial", url: "https://mode.com", type: "Free", skill: "SQL", institute: { name: "Mode Analytics (Online)", address: "San Francisco, CA, USA", lat: 37.7749, lng: -122.4194 } },
      { name: "Kaggle Learn", url: "https://kaggle.com/learn", type: "Free", skill: "Python/ML", institute: { name: "Kaggle (Google)", address: "San Francisco, CA, USA", lat: 37.7937, lng: -122.3965 } },
      { name: "StatQuest with Josh Starmer", url: "https://youtube.com", type: "Free", skill: "Statistics", institute: { name: "YouTube (Online)", address: "San Bruno, CA, USA", lat: 37.6304, lng: -122.4118 } },
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
      { name: "Google UX Design Certificate", url: "https://coursera.org", type: "Paid", skill: "UX Design", institute: { name: "Coursera HQ", address: "Mountain View, CA 94043, USA", lat: 37.4030, lng: -122.1130 } },
      { name: "Figma Tutorial (YouTube)", url: "https://youtube.com", type: "Free", skill: "Figma", institute: { name: "YouTube (Online)", address: "San Bruno, CA, USA", lat: 37.6304, lng: -122.4118 } },
      { name: "Interaction Design Foundation", url: "https://interaction-design.org", type: "Paid", skill: "UX Theory", institute: { name: "Interaction Design Foundation", address: "Aarhus, Denmark", lat: 56.1629, lng: 10.2039 } },
      { name: "Dribbble", url: "https://dribbble.com", type: "Free", skill: "Portfolio Inspiration", institute: { name: "Dribbble (Online)", address: "Enfield, NH, USA", lat: 43.6422, lng: -72.1470 } },
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
      { name: "TryHackMe", url: "https://tryhackme.com", type: "Freemium", skill: "Ethical Hacking", institute: { name: "TryHackMe (Online)", address: "London, UK", lat: 51.5074, lng: -0.1278 } },
      { name: "Hack The Box", url: "https://hackthebox.com", type: "Freemium", skill: "Penetration Testing", institute: { name: "Hack The Box HQ", address: "Athens, Greece", lat: 37.9838, lng: 23.7275 } },
      { name: "Cybrary", url: "https://cybrary.it", type: "Freemium", skill: "Security Concepts", institute: { name: "Cybrary HQ", address: "College Park, MD, USA", lat: 38.9807, lng: -76.9369 } },
      { name: "CompTIA Security+ Study Guide", url: "https://comptia.org", type: "Paid", skill: "Certification Prep", institute: { name: "CompTIA HQ", address: "Downers Grove, IL, USA", lat: 41.8081, lng: -88.0112 } },
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
      { name: "The Odin Project", url: "https://theodinproject.com", type: "Free", skill: "Full Stack", institute: { name: "The Odin Project (Online)", address: "New York, NY, USA", lat: 40.7128, lng: -74.0060 } },
      { name: "freeCodeCamp", url: "https://freecodecamp.org", type: "Free", skill: "HTML/CSS/JS", institute: { name: "freeCodeCamp (Online)", address: "San Francisco, CA, USA", lat: 37.7749, lng: -122.4194 } },
      { name: "Full Stack Open", url: "https://fullstackopen.com", type: "Free", skill: "React/Node", institute: { name: "University of Helsinki", address: "Helsinki, Finland", lat: 60.1699, lng: 24.9384 } },
      { name: "Scrimba", url: "https://scrimba.com", type: "Freemium", skill: "Interactive Coding", institute: { name: "Scrimba (Online)", address: "Oslo, Norway", lat: 59.9139, lng: 10.7522 } },
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
      { name: "Cisco Networking Academy", url: "https://netacad.com", type: "Free", skill: "Networking Fundamentals", institute: { name: "Cisco Systems HQ", address: "San Jose, CA 95134, USA", lat: 37.4108, lng: -121.9340 } },
      { name: "Professor Messer", url: "https://professormesser.com", type: "Free", skill: "CompTIA Network+", institute: { name: "Professor Messer (Online)", address: "Nashville, TN, USA", lat: 36.1627, lng: -86.7816 } },
      { name: "CBT Nuggets", url: "https://cbtnuggets.com", type: "Paid", skill: "CCNA Prep", institute: { name: "CBT Nuggets HQ", address: "Eugene, OR, USA", lat: 44.0521, lng: -123.0868 } },
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
      { name: "Android Basics by Google", url: "https://developer.android.com", type: "Free", skill: "Android Dev", institute: { name: "Google HQ", address: "1600 Amphitheatre Pkwy, Mountain View, CA, USA", lat: 37.4220, lng: -122.0841 } },
      { name: "Flutter Documentation", url: "https://flutter.dev", type: "Free", skill: "Flutter", institute: { name: "Google (Flutter Team)", address: "1600 Amphitheatre Pkwy, Mountain View, CA, USA", lat: 37.4220, lng: -122.0841 } },
      { name: "Meta Android Developer", url: "https://coursera.org", type: "Paid", skill: "Certification", institute: { name: "Coursera HQ", address: "Mountain View, CA 94043, USA", lat: 37.4030, lng: -122.1130 } },
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
      { name: "SQLZoo", url: "https://sqlzoo.net", type: "Free", skill: "SQL", institute: { name: "SQLZoo (Online)", address: "Edinburgh, Scotland, UK", lat: 55.9533, lng: -3.1883 } },
      { name: "Oracle Academy", url: "https://academy.oracle.com", type: "Free", skill: "Oracle DB", institute: { name: "Oracle HQ", address: "Austin, TX 78741, USA", lat: 30.2311, lng: -97.7437 } },
      { name: "AWS Database Specialty Prep", url: "https://aws.amazon.com/training", type: "Paid", skill: "Cloud DBs", institute: { name: "Amazon Web Services HQ", address: "Seattle, WA 98108, USA", lat: 47.6062, lng: -122.3321 } },
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
      { name: "Google Project Management Certificate", url: "https://coursera.org", type: "Paid", skill: "PM Fundamentals", institute: { name: "Coursera HQ", address: "Mountain View, CA 94043, USA", lat: 37.4030, lng: -122.1130 } },
      { name: "PMI Learning Resources", url: "https://pmi.org", type: "Paid", skill: "PMP Prep", institute: { name: "Project Management Institute", address: "Newtown Square, PA 19073, USA", lat: 39.9837, lng: -75.4024 } },
      { name: "Scrum.org Free Resources", url: "https://scrum.org", type: "Free", skill: "Scrum/Agile", institute: { name: "Scrum.org (Online)", address: "Boston, MA, USA", lat: 42.3601, lng: -71.0589 } },
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
      { name: "ISTQB Preparation", url: "https://istqb.org", type: "Paid", skill: "Testing Foundations", institute: { name: "ISTQB (International Software Testing)", address: "Vienna, Austria", lat: 48.2082, lng: 16.3738 } },
      { name: "Selenium with Java (Udemy)", url: "https://udemy.com", type: "Paid", skill: "Test Automation", institute: { name: "Udemy HQ", address: "San Francisco, CA 94103, USA", lat: 37.7749, lng: -122.4194 } },
      { name: "Postman Learning Center", url: "https://learning.postman.com", type: "Free", skill: "API Testing", institute: { name: "Postman HQ", address: "San Francisco, CA 94107, USA", lat: 37.7785, lng: -122.3948 } },
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