
function TutorCard({ tutor, onBook }) {
  return (
    <div className="tutor-card">
      <div className="tutor-image">
        <img src={tutor.image} alt={tutor.name} />
        <span className="verified">✓ Verified Tutor</span>
      </div>

      <div className="tutor-info">
        <h3>{tutor.name}</h3>

        <p className="qualification">{tutor.qualification}</p>

        <div className="tutor-details">
          <p>📍 {tutor.city}</p>
          <p>⭐ {tutor.rating} ({tutor.reviews} reviews)</p>
          <p>💼 Experience: {tutor.experience}</p>
        </div>

        <div className="subjects">
          {tutor.subjects.map((subject) => (
            <span key={subject}>{subject}</span>
          ))}
        </div>

        <div className="card-bottom">
          <div>
            <strong>₹{tutor.rate}</strong>
            <small>/session</small>
          </div>

          <button onClick={() => onBook(tutor)}>
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorCard;
