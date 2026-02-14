import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS

from db import careers_col, roadmaps_col

# Try different import approaches
try:
    # First attempt: direct import
    from routes.ml import ml_bp
    from routes.careers import careers_bp
    from routes.roadmaps import roadmaps_bp
except ModuleNotFoundError:
    try:
        # Second attempt: with backend prefix
        from backend.routes.ml import ml_bp
        from backend.routes.careers import careers_bp
        from backend.routes.roadmaps import roadmaps_bp
    except ModuleNotFoundError:
        # Third attempt: relative import
        import importlib.util
        import os
        
        # Manual loading as last resort
        print("Trying manual imports...")
        
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Add to path if not already there
        if current_dir not in sys.path:
            sys.path.insert(0, current_dir)
        
        # Import using full path
        from routes.ml import ml_bp
        from routes.careers import careers_bp
        from routes.roadmaps import roadmaps_bp

print(f"Python path: {sys.path}")
print(f"Current directory: {os.path.dirname(os.path.abspath(__file__))}")

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register API routes
    app.register_blueprint(ml_bp, url_prefix="/api/ml")
    app.register_blueprint(careers_bp, url_prefix="/api/careers")
    app.register_blueprint(roadmaps_bp, url_prefix="/api/roadmaps")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)