import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/Dashboard/Home";
import Quiz from "./pages/Dashboard/Quiz";
import Careers from "./pages/Dashboard/Careers";
import Results from "./pages/Dashboard/Results";
import Login from "./pages/Dashboard/Auth/Login";

export default function App() {
  return (
    <Routes>
      {/* 1. Public Route (No Navbar/Sidebar) */}
      <Route path="/login" element={<Login />} />

      {/* 2. Protected/Dashboard Routes (Wrapped in Layout) */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}