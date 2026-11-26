
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";

// Protect Admin Dashboard
function ProtectedAdmin() {
  const isAdmin = localStorage.getItem("htf_admin_session");

  if (isAdmin !== "true") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Admin />;
}

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/bookings" element={<Bookings />} />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<ProtectedAdmin />}
        />

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* Tutor Dashboard */}
        <Route
          path="/tutor-dashboard"
          element={<TutorDashboard />}
        />

        <Route
          path="*"
          element={
            <div className="container">
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
