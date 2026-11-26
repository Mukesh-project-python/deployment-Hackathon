
import { useState } from "react";
import TutorCard from "../components/TutorCard";
import BookingModal from "../components/BookingModal";
import { getTutors, saveBooking } from "../data/tutors";

function Home() {
  const [tutors] = useState(getTutors);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState("All");
  const [selectedTutor, setSelectedTutor] = useState(null);

  const filteredTutors = tutors.filter((tutor) => {
    const searchMatch =
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.subjects.join(" ").toLowerCase().includes(search.toLowerCase());

    const cityMatch = tutor.city.toLowerCase().includes(city.toLowerCase());

    const subjectMatch =
      subject === "All" || tutor.subjects.includes(subject);

    const modeMatch =
      mode === "All" ||
      (tutor.mode || []).includes(mode);

    return searchMatch && cityMatch && subjectMatch && modeMatch;
  });

  function handleBooking(data) {
    const user = JSON.parse(
      localStorage.getItem("htf_current_user") || "null"
    );

    if (!user || user.role !== "student") {
      alert("Please login as a student before booking.");
      setSelectedTutor(null);
      return;
    }

    const bookingData = {
      ...data,
      studentId: user.id,
      student: user.name
    };

    saveBooking(bookingData);

    alert("Booking submitted successfully!");

    setSelectedTutor(null);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">YOUR LEARNING PARTNER</span>
          <h1>Find the Perfect Tutor for Your Learning Journey</h1>
          <p>
            Learn better with experienced tutors. Find trusted home
            tutors and online teachers for every subject.
          </p>
        </div>
      </section>

      <main className="container">
        <div className="search-box">
          <input
            placeholder="Search tutor or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="All">All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Coding</option>
            <option>Python</option>
            <option>English</option>
            <option>Commerce</option>
          </select>

          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="All">All Modes</option>
            <option>Home Tuition</option>
            <option>Online</option>
          </select>
        </div>

        <section className="tutors-section">
          <div className="tutors-heading">
            <div>
              <span className="section-tag">EXPLORE EXPERTS</span>
              <h2>Find Your Best Tutor</h2>
              <p>Connect with verified and experienced tutors.</p>
            </div>

            <span className="tutor-count">
              {filteredTutors.length} tutors found
            </span>
          </div>

          <div className="tutor-grid">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onBook={setSelectedTutor}
                />
              ))
            ) : (
              <div className="empty-message">
                <h3>No tutors found</h3>
                <p>Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BookingModal
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
        onSubmit={handleBooking}
      />
    </>
  );
}

export default Home;
