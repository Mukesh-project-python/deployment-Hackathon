
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TutorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("htf_current_user") || "null"
  );

  const [activeTab, setActiveTab] = useState("overview");

  const [bookings] = useState(() =>
    JSON.parse(localStorage.getItem("htf_bookings") || "[]")
  );

  if (!user || user.role !== "tutor") {
    return (
      <div className="container">
        <h2>Please login as a tutor first.</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/signup")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Get bookings made for this tutor
  const myBookings = bookings.filter(
    booking => booking.tutor === user.name
  );

  const pending = myBookings.filter(
    booking => booking.status === "Pending"
  ).length;

  const approved = myBookings.filter(
    booking => booking.status === "Approved"
  ).length;

  const rejected = myBookings.filter(
    booking => booking.status === "Rejected"
  ).length;

  function logout() {
    localStorage.removeItem("htf_current_user");
    navigate("/signup");
  }

  function getStatusClass(status) {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  }

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h2>🎓 TutorFinder</h2>

        <p className="sidebar-label">TUTOR MENU</p>

        <button
          className={activeTab === "overview" ? "side-active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          🏠 Overview
        </button>

        <button
          className={activeTab === "bookings" ? "side-active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          📅 Student Bookings
        </button>

        <button
          className={activeTab === "profile" ? "side-active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          👤 My Profile
        </button>

        <button onClick={() => navigate("/")}>
          🔍 Find Tutors
        </button>

        <button className="logout-button" onClick={logout}>
          ↪ Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>
              {activeTab === "overview" && "Tutor Dashboard"}
              {activeTab === "bookings" && "Student Bookings"}
              {activeTab === "profile" && "My Profile"}
            </h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <div className="dashboard-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="dashboard-welcome">
              <div>
                <h2>Hello, {user.name} 👋</h2>
                <p>
                  Manage your teaching sessions and student requests.
                </p>
              </div>
              <span>📚</span>
            </div>

            <div className="dashboard-stats">

              <div className="stat-card">
                <span>📅</span>
                <h2>{myBookings.length}</h2>
                <p>Total Bookings</p>
              </div>

              <div className="stat-card">
                <span>⏳</span>
                <h2>{pending}</h2>
                <p>Pending Requests</p>
              </div>

              <div className="stat-card">
                <span>✅</span>
                <h2>{approved}</h2>
                <p>Approved Bookings</p>
              </div>

              <div className="stat-card">
                <span>❌</span>
                <h2>{rejected}</h2>
                <p>Rejected Bookings</p>
              </div>

            </div>

            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Recent Student Bookings</h2>

                <button onClick={() => setActiveTab("bookings")}>
                  View All
                </button>
              </div>

              {myBookings.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No bookings yet</h3>
                  <p>Student booking requests will appear here.</p>
                </div>
              ) : (
                myBookings.slice().reverse().slice(0, 3).map(b => (
                  <div className="dashboard-booking" key={b.id}>
                    <div>
                      <h3>{b.student}</h3>
                      <p>{b.subject} • {b.date}</p>
                    </div>

                    <span className={getStatusClass(b.status)}>
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <section className="dashboard-section">
            <h2>All Student Bookings</h2>

            {myBookings.length === 0 ? (
              <div className="dashboard-empty">
                <h3>No student bookings found</h3>
                <p>Your bookings will appear here.</p>
              </div>
            ) : (
              myBookings.slice().reverse().map(b => (
                <div className="dashboard-booking" key={b.id}>
                  <div>
                    <h3>{b.student}</h3>
                    <p>Subject: {b.subject}</p>
                    <p>Date: {b.date}</p>
                    <p>Time: {b.time}</p>
                    <p>Location: {b.address}</p>
                    <p>Session Fee: ₹{b.rate}</p>

                    <span className={getStatusClass(b.status)}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <section className="dashboard-section">
            <h2>Personal Information</h2>

            <div className="profile-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Qualification:</strong> {user.qualification}</p>
              <p><strong>Subject:</strong> {user.subject}</p>
              <p><strong>Experience:</strong> {user.experience}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Session Fee:</strong> ₹{user.rate}</p>
              <p><strong>Account Status:</strong> {user.status}</p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default TutorDashboard;
