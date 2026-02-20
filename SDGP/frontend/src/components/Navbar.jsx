import { Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleLogout = () => {
    // Optional: Add logout logic here (e.g., localStorage.clear())
    console.log("Logging out...");
    
    // 3. Redirect to the login route
    navigate("/login"); 
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">GrowthMap</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/quiz" className="hover:underline">Quiz</Link>
        <Link to="/careers" className="hover:underline">Careers</Link>
        <Link to="/results" className="hover:underline">Results</Link>
      </div>

      <button
        onClick={handleLogout}
        className="text-white hover:text-purple-200 transition flex items-center gap-2"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </nav>
  );
}