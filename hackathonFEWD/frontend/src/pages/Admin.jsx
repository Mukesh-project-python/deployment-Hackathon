
import { useState } from "react";
import { getTutors } from "../data/tutors";

function Admin() {
  const [tutors, setTutors] = useState(getTutors());

  const [requests, setRequests] = useState(() => {
    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    return users.filter(
      u => u.role === "tutor" && u.status === "Pending"
    );
  });

  const [bookings, setBookings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("htf_bookings") || "[]"
    );
  });

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [city, setCity] = useState("");
  const [rate, setRate] = useState("");
  const [subject, setSubject] = useState("Mathematics");

  // Approve tutor
  function approveTutor(user) {
    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    const updatedUsers = users.map(u =>
      u.id === user.id
        ? { ...u, status: "Approved" }
        : u
    );

    localStorage.setItem(
      "htf_users",
      JSON.stringify(updatedUsers)
    );

    const newTutor = {
      id: user.id,
      name: user.name,
      image: "https://placehold.co/400x300?text=Tutor",
      qualification: user.qualification,
      experience: user.experience,
      rating: "New",
      reviews: 0,
      rate: Number(user.rate) || 0,
      city: user.city,
      subjects: [user.subject]
    };

    const updatedTutors = [
      ...tutors.filter(t => t.id !== user.id),
      newTutor
    ];

    localStorage.setItem(
      "htf_tutors",
      JSON.stringify(updatedTutors)
    );

    setTutors(updatedTutors);

    setRequests(prev =>
      prev.filter(u => u.id !== user.id)
    );

    alert("Tutor approved successfully!");
  }

  // Reject tutor
  function rejectTutor(user) {
    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    const updatedUsers = users.map(u =>
      u.id === user.id
        ? { ...u, status: "Rejected" }
        : u
    );

    localStorage.setItem(
      "htf_users",
      JSON.stringify(updatedUsers)
    );

    setRequests(prev =>
      prev.filter(u => u.id !== user.id)
    );

    alert("Tutor application rejected.");
  }

  // Add tutor manually
  function addTutor(e) {
    e.preventDefault();

    const newTutor = {
      id: Date.now(),
      name,
      image: "https://placehold.co/400x300?text=Tutor",
      qualification,
      experience: "New Tutor",
      rating: "New",
      reviews: 0,
      rate: Number(rate),
      city,
      subjects: [subject]
    };

    const updated = [...tutors, newTutor];

    setTutors(updated);

    localStorage.setItem(
      "htf_tutors",
      JSON.stringify(updated)
    );

    setName("");
    setQualification("");
    setCity("");
    setRate("");

    alert("Tutor added successfully!");
  }

  // Remove tutor
  function deleteTutor(id) {
    const updated = tutors.filter(
      t => t.id !== id
    );

    setTutors(updated);

    localStorage.setItem(
      "htf_tutors",
      JSON.stringify(updated)
    );
  }

  // Refresh tutor requests
  function refreshRequests() {
    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    setRequests(
      users.filter(
        u => u.role === "tutor" && u.status === "Pending"
      )
    );

    alert("Requests refreshed!");
  }

  // Refresh bookings
  function refreshBookings() {
    const saved = JSON.parse(
      localStorage.getItem("htf_bookings") || "[]"
    );

    setBookings(saved);

    alert("Bookings refreshed!");
  }

  // Update booking status
  function updateBookingStatus(id, status) {
    const updated = bookings.map(b =>
      b.id === id
        ? { ...b, status }
        : b
    );

    setBookings(updated);

    localStorage.setItem(
      "htf_bookings",
      JSON.stringify(updated)
    );

    alert(`Booking ${status.toLowerCase()} successfully!`);
  }

  // Find student information
  function getStudent(booking) {
    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    return users.find(
      u => u.id === booking.studentId
    );
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
    <div className="container page-section">

      <h1>Admin Dashboard</h1>
      <p>Manage TutorFinder profiles, applications and bookings.</p>

      {/* Booking Management */}

      <div className="admin-form">
        <h2>Student Bookings ({bookings.length})</h2>

        <button
          type="button"
          className="primary-btn"
          onClick={refreshBookings}
        >
          Refresh Bookings
        </button>

        {bookings.length === 0 ? (
          <p>No student bookings available.</p>
        ) : (
          <div className="admin-list">

            {bookings.slice().reverse().map(booking => {
              const student = getStudent(booking);

              return (
                <div className="admin-item" key={booking.id}>

                  <div>
                    <h3>{booking.tutor}</h3>

                    <p>Student: {booking.student}</p>
                    <p>Email: {student?.email || "Not available"}</p>
                    <p>Phone: {student?.phone || "Not available"}</p>
                    <p>Subject: {booking.subject}</p>
                    <p>Date: {booking.date}</p>
                    <p>Time: {booking.time}</p>
                    <p>Location: {booking.address}</p>
                    <p>Session Fee: ₹{booking.rate}</p>

                    <p>
                      Status:{" "}
                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  {booking.status === "Pending" && (
                    <div>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* Pending Tutor Requests */}

      <div className="admin-form">

        <h2>Pending Tutor Requests ({requests.length})</h2>

        <button
          type="button"
          className="primary-btn"
          onClick={refreshRequests}
        >
          Refresh Requests
        </button>

        {requests.length === 0 ? (
          <p>No pending tutor applications.</p>
        ) : (
          <div className="admin-list">

            {requests.map(user => (
              <div className="admin-item" key={user.id}>

                <div>
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Qualification: {user.qualification}</p>
                  <p>Subject: {user.subject}</p>
                  <p>Experience: {user.experience}</p>
                  <p>City: {user.city}</p>
                  <p>Session Fee: ₹{user.rate}</p>
                </div>

                <div>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => approveTutor(user)}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => rejectTutor(user)}
                  >
                    Reject
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Add Tutor */}

      <div className="admin-form">

        <h2>Add New Tutor</h2>

        <form onSubmit={addTutor}>

          <input
            placeholder="Tutor Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            placeholder="Qualification"
            value={qualification}
            onChange={e => setQualification(e.target.value)}
            required
          />

          <input
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Session Fee"
            value={rate}
            onChange={e => setRate(e.target.value)}
            required
            min="1"
          />

          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
          >
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Coding</option>
            <option>English</option>
            <option>Commerce</option>
          </select>

          <button className="primary-btn">
            Add Tutor
          </button>

        </form>

      </div>

      {/* Available Tutors */}

      <h2>Available Tutors ({tutors.length})</h2>

      <div className="admin-list">

        {tutors.map(tutor => (
          <div className="admin-item" key={tutor.id}>

            <div>
              <h3>{tutor.name}</h3>
              <p>
                {tutor.subjects.join(", ")} | {tutor.city}
              </p>
            </div>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => deleteTutor(tutor.id)}
            >
              Remove
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Admin;
