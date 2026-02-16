import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">GrowthMap</h1>

      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/results">Results</Link>
      </div>
    </nav>
  );
}
