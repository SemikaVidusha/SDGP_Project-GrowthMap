from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import traceback
import numpy as np
import os
import logging
from dotenv import load_dotenv
from groq import Groq
from duckduckgo_search import DDGS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

print(f"Current Working Directory: {os.getcwd()}")
print(f".env file path being loaded: {os.path.join(BASE_DIR, '.env')}")
print(f".env file exists: {os.path.exists(os.path.join(BASE_DIR, '.env'))}")
print(f"After load_dotenv - MONGO_URI: {os.getenv('MONGO_URI')}")
print(f"After load_dotenv - JWT_SECRET: {os.getenv('JWT_SECRET')}")

# Setup basic logging to file for the AI to read
logging.basicConfig(
    filename=os.path.join(BASE_DIR, 'app.log'),
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
logger.info("Application started")

DATASET_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dataset"))

MODEL_PATH = os.path.join(DATASET_DIR, "career_model.pkl")
ENCODER_PATH = os.path.join(DATASET_DIR, "career_encoder.pkl")

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

print("ML Model + Encoder loaded successfully")

mongo_available = False
careers_col = None
roadmaps_col = None

try:
    MONGO_URI = os.getenv("MONGO_URI")
    print(f"MONGO_URI found: {MONGO_URI[:30] if MONGO_URI else 'None'}...")
    
    if MONGO_URI and MONGO_URI.strip():
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        # Test connection
        client.server_info()
        db = client["sdgp_db"]
        careers_col = db["careers"]
        roadmaps_col = db["roadmaps"]
        print("MongoDB Atlas connected successfully")
        mongo_available = True
    else:
        print("MONGO_URI is empty - using fallback data")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("Using fallback data")

# ==================== PRE-LOADED DATA CACHE ====================
# These are loaded once at startup for fast prediction requests

cached_careers = []
cached_roadmaps = {}
cached_logic_scores = {}  

# ==================== FALLBACK DATA ====================

FALLBACK_CAREERS = [
    {"id": "software_engineer", "careerId": "software_engineer", "name": "Software Engineer", "description": "Design and develop software applications", "skills": ["Programming", "Problem Solving"], "demand": "High", "salary": "$60,000 - $120,000"},
    {"id": "frontend_developer", "careerId": "frontend_developer", "name": "Frontend Developer", "description": "Build user interfaces for web applications", "skills": ["HTML", "CSS", "JavaScript"], "demand": "High", "salary": "$50,000 - $100,000"},
    {"id": "data_scientist", "careerId": "data_scientist", "name": "Data Scientist", "description": "Analyze data and build ML models", "skills": ["Python", "Machine Learning", "Statistics"], "demand": "High", "salary": "$70,000 - $140,000"},
    {"id": "backend_developer", "careerId": "backend_developer", "name": "Backend Developer", "description": "Build server-side applications", "skills": ["Node.js", "Python", "Databases"], "demand": "High", "salary": "$55,000 - $110,000"},
    {"id": "fullstack_developer", "careerId": "fullstack_developer", "name": "Fullstack Developer", "description": "Build complete web applications", "skills": ["Frontend", "Backend", "Databases"], "demand": "High", "salary": "$60,000 - $120,000"},
    {"id": "ai_ml_engineer", "careerId": "ai_ml_engineer", "name": "AI/ML Engineer", "description": "Build artificial intelligence and machine learning systems", "skills": ["Python", "TensorFlow", "PyTorch"], "demand": "High", "salary": "$80,000 - $150,000"},
    {"id": "cybersecurity_analyst", "careerId": "cybersecurity_analyst", "name": "Cybersecurity Analyst", "description": "Protect systems from cyber threats", "skills": ["Security", "Networking", "Risk Assessment"], "demand": "High", "salary": "$65,000 - $130,000"},
    {"id": "network_engineer", "careerId": "network_engineer", "name": "Network Engineer", "description": "Design and manage computer networks", "skills": ["Networking", "Cisco", "TCP/IP"], "demand": "Medium", "salary": "$55,000 - $100,000"},
    {"id": "devops_engineer", "careerId": "devops_engineer", "name": "DevOps Engineer", "description": "Automate deployment and infrastructure", "skills": ["Docker", "Kubernetes", "CI/CD"], "demand": "High", "salary": "$70,000 - $140,000"},
    {"id": "ui_ux_designer", "careerId": "ui_ux_designer", "name": "UI/UX Designer", "description": "Design user interfaces and experiences", "skills": ["Figma", "User Research", "Prototyping"], "demand": "High", "salary": "$50,000 - $100,000"}
]

# Minimal fallback roadmaps - main ones
FALLBACK_ROADMAPS = {
    "software_engineer": {"careerId": "software_engineer", "title": "Software Engineer", "stages": [{"level": "Foundation", "title": "Programming Basics", "duration": "3 Months", "description": "Learn programming fundamentals with Python or Java"}, {"level": "Core Skills", "title": "Data Structures & Algorithms", "duration": "4 Months", "description": "Master arrays, linked lists, trees, and algorithms"}, {"level": "Professional", "title": "Web Development", "duration": "4 Months", "description": "Learn HTML, CSS, JavaScript and frameworks"}, {"level": "Advanced", "title": "System Design", "duration": "3 Months", "description": "Design scalable distributed systems"}]},
    "frontend_developer": {"careerId": "frontend_developer", "title": "Frontend Developer", "stages": [{"level": "Foundation", "title": "HTML & CSS", "duration": "2 Months", "description": "Learn semantic HTML and modern CSS"}, {"level": "Core Skills", "title": "JavaScript Fundamentals", "duration": "3 Months", "description": "Master JavaScript ES6+ and DOM manipulation"}, {"level": "Professional", "title": "React or Vue.js", "duration": "4 Months", "description": "Build modern single-page applications"}, {"level": "Advanced", "title": "Performance & Testing", "duration": "3 Months", "description": "Optimize performance and write tests"}]},
    "data_scientist": {"careerId": "data_scientist", "title": "Data Scientist", "stages": [{"level": "Foundation", "title": "Python & Math", "duration": "3 Months", "description": "Learn Python, statistics, and linear algebra"}, {"level": "Core Skills", "title": "Data Analysis", "duration": "3 Months", "description": "Master Pandas, NumPy, and data visualization"}, {"level": "Professional", "title": "Machine Learning", "duration": "4 Months", "description": "Learn Scikit-learn and ML algorithms"}, {"level": "Advanced", "title": "Deep Learning", "duration": "4 Months", "description": "Master TensorFlow or PyTorch"}]},
    "backend_developer": {"careerId": "backend_developer", "title": "Backend Developer", "stages": [{"level": "Foundation", "title": "Programming Basics", "duration": "3 Months", "description": "Learn Node.js or Python basics"}, {"level": "Core Skills", "title": "Databases", "duration": "3 Months", "description": "Master SQL and NoSQL databases"}, {"level": "Professional", "title": "API Development", "duration": "4 Months", "description": "Build RESTful and GraphQL APIs"}, {"level": "Advanced", "title": "Cloud & DevOps", "duration": "4 Months", "description": "Learn AWS, Docker, and Kubernetes"}]},
    "fullstack_developer": {"careerId": "fullstack_developer", "title": "Fullstack Developer", "stages": [{"level": "Foundation", "title": "Web Basics", "duration": "3 Months", "description": "Learn HTML, CSS, JavaScript"}, {"level": "Core Skills", "title": "Frontend & Backend", "duration": "5 Months", "description": "Master React and Node.js"}, {"level": "Professional", "title": "Databases & APIs", "duration": "4 Months", "description": "Learn databases and API design"}, {"level": "Advanced", "title": "DevOps & Cloud", "duration": "4 Months", "description": "Deploy and scale applications"}]},
    "ai_ml_engineer": {"careerId": "ai_ml_engineer", "title": "AI/ML Engineer", "stages": [{"level": "Foundation", "title": "Math & Python", "duration": "3 Months", "description": "Learn Python, math, and linear algebra"}, {"level": "Core Skills", "title": "Machine Learning", "duration": "4 Months", "description": "Learn ML algorithms and Scikit-learn"}, {"level": "Professional", "title": "Deep Learning", "duration": "5 Months", "description": "Master TensorFlow or PyTorch"}, {"level": "Advanced", "title": "AI Projects", "duration": "4 Months", "description": "Build AI models and deploy them"}]},
    "cybersecurity_analyst": {"careerId": "cybersecurity_analyst", "title": "Cybersecurity Analyst", "stages": [{"level": "Foundation", "title": "Security Basics", "duration": "3 Months", "description": "Learn networking and security fundamentals"}, {"level": "Core Skills", "title": "Defense Tools", "duration": "4 Months", "description": "Master firewalls, SIEM, and monitoring"}, {"level": "Professional", "title": "Penetration Testing", "duration": "4 Months", "description": "Learn ethical hacking techniques"}, {"level": "Advanced", "title": "Incident Response", "duration": "3 Months", "description": "Handle security incidents and forensics"}]},
    "network_engineer": {"careerId": "network_engineer", "title": "Network Engineer", "stages": [{"level": "Foundation", "title": "Networking Basics", "duration": "3 Months", "description": "Learn TCP/IP and OSI models"}, {"level": "Core Skills", "title": "Routing & Switching", "duration": "4 Months", "description": "Master Cisco networking"}, {"level": "Professional", "title": "Network Security", "duration": "4 Months", "description": "Configure VPNs and firewalls"}, {"level": "Advanced", "title": "Cloud Networking", "duration": "3 Months", "description": "Learn AWS/Azure networking"}]},
    "devops_engineer": {"careerId": "devops_engineer", "title": "DevOps Engineer", "stages": [{"level": "Foundation", "title": "Linux & Scripting", "duration": "3 Months", "description": "Master Linux and Bash scripting"}, {"level": "Core Skills", "title": "CI/CD Pipelines", "duration": "4 Months", "description": "Build Jenkins and GitHub Actions pipelines"}, {"level": "Professional", "title": "Containers", "duration": "4 Months", "description": "Master Docker and Kubernetes"}, {"level": "Advanced", "title": "Infrastructure as Code", "duration": "3 Months", "description": "Learn Terraform and Ansible"}]},
    "ui_ux_designer": {"careerId": "ui_ux_designer", "title": "UI/UX Designer", "stages": [{"level": "Foundation", "title": "Design Principles", "duration": "3 Months", "description": "Learn typography, color, and layout"}, {"level": "Core Skills", "title": "User Research", "duration": "3 Months", "description": "Conduct user interviews and personas"}, {"level": "Professional", "title": "Prototyping", "duration": "4 Months", "description": "Build high-fidelity prototypes in Figma"}, {"level": "Advanced", "title": "Design Systems", "duration": "4 Months", "description": "Create reusable component libraries"}]}
}

# Trait mapping for logic score computation
TRAIT_MAP = {
    "logic": ["logic", "systems"],
    "technical": ["systems"],
    "focus": ["detail"],
    "discipline": ["detail"],
    "creativity": ["creativity"],
    "social": ["collaboration"],
    "empathy": ["collaboration"],
    "leadership": ["leadership"],
    "adaptability": ["adaptability"],
    "risk": ["risk"]
}

def compute_logic_score(user_traits, career_focus_traits):
    """Compute logic score between user traits and career focus traits"""
    score = 0
    max_score = 0

    for trait, value in user_traits.items():
        mapped = TRAIT_MAP.get(trait, [])
        for m in mapped:
            max_score += 1
            if m in career_focus_traits:
                score += value

    return score / max_score if max_score > 0 else 0

def precompute_logic_scores():
    """Pre-compute logic scores for all careers at startup"""
    global cached_logic_scores
    
    for career in cached_careers:
        career_id = career.get("id") or career.get("careerId")
        focus = career.get("focusTraits", [])
        cached_logic_scores[career_id] = focus  

def load_careers_and_roadmaps():
    """Load careers and roadmaps from database or fallback at startup"""
    global cached_careers, cached_roadmaps
    
    # Try to load from MongoDB if available
    if mongo_available and careers_col is not None and roadmaps_col is not None:
        try:
            # Load careers with timeout
            cached_careers = list(careers_col.find({}, {"_id": 0}))
            print(f"Loaded {len(cached_careers)} careers from MongoDB")
            
            # Pre-compute logic scores
            precompute_logic_scores()
            
            # Load roadmaps
            all_roadmaps = list(roadmaps_col.find({}, {"_id": 0}))
            for rm in all_roadmaps:
                cid = rm.get("careerId")
                if cid:
                    cached_roadmaps[cid] = rm
            print(f"Loaded {len(cached_roadmaps)} roadmaps from MongoDB")
            return  # Success - don't use fallback
        except Exception as e:
            print(f"Failed to load from MongoDB: {e}")
    
    # Fallback if MongoDB fails
    cached_careers = FALLBACK_CAREERS
    print("Using fallback careers")
    precompute_logic_scores()
    cached_roadmaps = dict(FALLBACK_ROADMAPS)
    print(f"Using {len(cached_roadmaps)} fallback roadmaps")

# Load data at startup
load_careers_and_roadmaps()

# ==================== FLASK APP SETUP ====================

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

ml_bp = Blueprint("ml", __name__)
careers_bp = Blueprint("careers", __name__)
roadmaps_bp = Blueprint("roadmaps", __name__)
chat_bp = Blueprint("chat", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        traits = data.get("traits")

        if not traits:
            return jsonify({"error": "Missing traits"}), 400

        FEATURE_ORDER = [
            "logic", "creativity", "technical", "empathy",
            "leadership", "social", "discipline", "adaptability",
            "focus", "risk"
        ]

        # ML PREDICTION
        X = np.array([[traits.get(t, 0) for t in FEATURE_ORDER]])
        ml_probs = model.predict_proba(X)[0]

        labels = encoder.inverse_transform(np.arange(len(ml_probs)))

        ml_results = dict(zip(labels, ml_probs))

        # FAST HYBRID SCORING USING CACHED DATA
        # Use pre-loaded careers instead of querying database on each request

        # Compute logic scores using cached careers (pre-computed focus traits)
        logic_scores = {}
        for career in cached_careers:
            career_id = career.get("id") or career.get("careerId")
            focus = cached_logic_scores.get(career_id, [])
            logic_scores[career_id] = compute_logic_score(traits, focus)

        # Compute final hybrid scores
        final_scores = {}
        for career_id in ml_results:
            ml_score = ml_results.get(career_id, 0)
            logic_score = logic_scores.get(career_id, 0)
            final_scores[career_id] = (
                0.65 * ml_score +
                0.35 * logic_score
            )

        ranked = sorted(
            final_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        top = [
            {"career": c, "score": round(float(s * 100), 2)}
            for c, s in ranked[:5]
        ]

        best_career_id = top[0]["career"]
        roadmap = cached_roadmaps.get(best_career_id)

        return jsonify({
            "bestCareer": top[0]["career"],
            "topCareers": top,
            "roadmap": roadmap 
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500

@careers_bp.route("/", methods=["GET"])
def get_all_careers():
    if mongo_available and careers_col is not None:
        try:
            careers = list(careers_col.find({}, {"_id": 0}))
            return jsonify(careers), 200
        except:
            pass
    return jsonify(FALLBACK_CAREERS), 200

@careers_bp.route("/<career_id>", methods=["GET"])
def get_single_career(career_id):
    if mongo_available and careers_col is not None:
        try:
            career = careers_col.find_one({"careerId": career_id}, {"_id": 0})
            if career:
                return jsonify(career), 200
        except:
            pass
    career = next((c for c in FALLBACK_CAREERS if c["careerId"] == career_id), None)
    if career:
        return jsonify(career), 200
    return jsonify({"error": "Career not found"}), 404

@roadmaps_bp.route("/<career_id>", methods=["GET"])
def get_roadmap(career_id):
    if mongo_available and roadmaps_col is not None:
        try:
            roadmap = roadmaps_col.find_one({"careerId": career_id}, {"_id": 0})
            if roadmap:
                return jsonify(roadmap), 200
        except:
            pass
    roadmap = FALLBACK_ROADMAPS.get(career_id)
    if roadmap:
        return jsonify(roadmap), 200
    return jsonify({"error": "Roadmap not found"}), 404

# Initialize Groq client
try:
    groq_client = Groq()
    logger.info("Groq client initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize Groq client: {e}")
    groq_client = None

def search_web(query):
    """Search the web for real-time information."""
    try:
        logger.info(f"AI executing web search for: {query}")
        results = DDGS().text(query, max_results=3)
        return str(list(results))
    except Exception as e:
        logger.error(f"Web search error: {e}")
        return f"Error searching web: {e}"

def read_logs():
    """Read recent logs to diagnose backend issues."""
    log_file = os.path.join(BASE_DIR, 'app.log')
    try:
        with open(log_file, 'r') as f:
            lines = f.readlines()
            return "".join(lines[-30:])
    except Exception as e:
        return f"Could not read logs: {e}"

@chat_bp.route("/", methods=["POST"], strict_slashes=False)
def chat():
    try:
        data = request.get_json(force=True)
        messages = data.get("messages", [])
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400
            
        if not groq_client:
            return jsonify({"error": "Groq API key not configured properly in the backend. Please add GROQ_API_KEY to your .env file."}), 500

        system_prompt = {
            "role": "system",
            "content": "You are HelpBot, the intelligent assistant for GrowthMap. "
                       "Your goal is to help users navigate the platform and answer their questions. "
                       "You can use tools to search the web for real-time data or read backend logs if asked to diagnose issues. "
                       "Keep responses helpful, friendly, and concise. Do not expose sensitive internal data."
        }
        
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "search_web",
                    "description": "Searches the web using DuckDuckGo for up-to-date information or current events.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "The search query"}
                        },
                        "required": ["query"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "read_logs",
                    "description": "Reads the most recent application log lines to check for backend errors or state.",
                    "parameters": {"type": "object", "properties": {}},
                },
            }
        ]

        logger.info(f"Received chat request with {len(messages)} messages")
        
        # Determine if we should parse dict objects instead of full ChatCompletion
        formatted_messages = [system_prompt] + messages
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=1024
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        if tool_calls:
            import json
            available_functions = {
                "search_web": search_web,
                "read_logs": read_logs,
            }
            
            # Use `model_dump()` to ensure tool_calls dicts can be serialized correctly if required by Groq API
            formatted_messages.append(response_message.model_dump())
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_to_call = available_functions[function_name]
                function_args = json.loads(tool_call.function.arguments)
                if function_name == "search_web":
                    function_response = function_to_call(query=function_args.get("query"))
                else:
                    function_response = function_to_call()
                
                formatted_messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )
            
            second_response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=formatted_messages
            )
            final_content = second_response.choices[0].message.content
        else:
            final_content = response_message.content

        return jsonify({"reply": final_content}), 200

    except Exception as e:
        logger.error(f"Chat endpoint error: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

app.register_blueprint(ml_bp, url_prefix="/api/ml")
app.register_blueprint(careers_bp, url_prefix="/api/careers")
app.register_blueprint(roadmaps_bp, url_prefix="/api/roadmaps")
app.register_blueprint(chat_bp, url_prefix="/api/chat")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

