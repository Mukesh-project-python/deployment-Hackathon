
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTutors } from "../data/tutors";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("htf_current_user") || "null"
  );

  const [activeTab, setActiveTab] = useState("overview");

  const [bookings, setBookings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("htf_bookings") || "[]"
    );
  });

  const tutors = getTutors();

  const myBookings = user
    ? bookings.filter(
        b =>
          b.studentId === user.id ||
          (b.studentId === undefined && b.student === user.name)
      )
    : [];

  function logout() {
    localStorage.removeItem("htf_current_user");
    navigate("/signup");
  }

  function cancelBooking(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    const updatedBookings = bookings.map(b =>
      b.id === id
        ? { ...b, status: "Cancelled" }
        : b
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      "htf_bookings",
      JSON.stringify(updatedBookings)
    );

    alert("Booking cancelled successfully!");
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

  if (!user || user.role !== "student") {
    return (
      <div className="dashboard-container">
        <h2>Please login as a student first.</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/signup")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      <aside className="dashboard-sidebar">
        <h2>🎓 TutorFinder</h2>

        <p className="sidebar-label">STUDENT MENU</p>

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
          📅 My Bookings
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

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>
              {activeTab === "overview" && "Student Dashboard"}
              {activeTab === "bookings" && "My Bookings"}
              {activeTab === "profile" && "My Profile"}
            </h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <div className="dashboard-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>

        {activeTab === "overview" && (
          <>
            <div className="dashboard-welcome">
              <div>
                <h2>Hello, {user.name} 👋</h2>
                <p>
                  Find the right tutor and continue your learning journey.
                </p>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/")}
                >
                  Explore Tutors
                </button>
              </div>
              <span>📚</span>
            </div>

            <div className="dashboard-stats">

              <div className="stat-card">
                <span>👨‍🏫</span>
                <h2>{tutors.length}</h2>
                <p>Available Tutors</p>
              </div>

              <div className="stat-card">
                <span>📅</span>
                <h2>{myBookings.length}</h2>
                <p>Total Bookings</p>
              </div>

              <div className="stat-card">
                <span>⏳</span>
                <h2>
                  {myBookings.filter(
                    b => b.status === "Pending"
                  ).length}
                </h2>
                <p>Pending Requests</p>
              </div>

              <div className="stat-card">
                <span>✅</span>
                <h2>
                  {myBookings.filter(
                    b => b.status === "Approved"
                  ).length}
                </h2>
                <p>Approved Bookings</p>
              </div>

            </div>

            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Recent Bookings</h2>
                <button onClick={() => setActiveTab("bookings")}>
                  View All
                </button>
              </div>

              {myBookings.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No bookings yet</h3>
                  <p>Start by finding your perfect tutor.</p>
                  <button
                    className="primary-btn"
                    onClick={() => navigate("/")}
                  >
                    Find Tutors
                  </button>
                </div>
              ) : (
                myBookings.slice(-3).reverse().map(b => (
                  <div className="dashboard-booking" key={b.id}>
                    <div>
                      <h3>{b.tutor}</h3>
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

        {activeTab === "bookings" && (
          <section className="dashboard-section">
            <h2>My Booking History</h2>

            {myBookings.length === 0 ? (
              <div className="dashboard-empty">
                <h3>No bookings found</h3>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/")}
                >
                  Book a Tutor
                </button>
              </div>
            ) : (
              myBookings.slice().reverse().map(b => (
                <div className="dashboard-booking" key={b.id}>
                  <div>
                    <h3>{b.tutor}</h3>
                    <p>Subject: {b.subject}</p>
                    <p>Date: {b.date} | Time: {b.time}</p>
                    <p>Fee: ₹{b.rate}</p>
                    <p>Location: {b.address}</p>

                    <span className={getStatusClass(b.status)}>
                      {b.status}
                    </span>

                    {b.status === "Pending" && (
                      <div style={{ marginTop: "12px" }}>
                        <button
                          className="cancel-btn"
                          onClick={() => cancelBooking(b.id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <section className="dashboard-section">
            <h2>Personal Information</h2>

            <div className="profile-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Account:</strong> Student</p>
              <p><strong>Class / Grade:</strong> {user.grade}</p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default StudentDashboard;
