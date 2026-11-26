
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [mode, setMode] = useState("signup");
  const [role, setRole] = useState("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [qualification, setQualification] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState("");
  const [rate, setRate] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("htf_users") || "[]"
    );

    if (mode === "signup") {
      if (password !== confirm) {
        alert("Passwords do not match!");
        return;
      }

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Email already registered. Please login.");
        return;
      }

      if (role === "tutor" && Number(rate) <= 0) {
        alert("Please enter a valid session fee.");
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        role,
        status: role === "tutor" ? "Pending" : "Active",
        ...(role === "student"
          ? { grade }
          : {
              qualification,
              subject,
              experience,
              city,
              rate: Number(rate)
            })
      };

      users.push(newUser);

      localStorage.setItem("htf_users", JSON.stringify(users));

      if (role === "student") {
        localStorage.setItem(
          "htf_current_user",
          JSON.stringify(newUser)
        );

        alert("Student registration successful!");
        navigate("/student-dashboard");
      } else {
        alert("Tutor registration successful! Waiting for admin approval.");
        setMode("login");
        setPassword("");
        setConfirm("");
      }
    } else {
      const user = users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.role === role
      );

      if (!user) {
        alert("Invalid email, password or account type.");
        return;
      }

      if (user.role === "tutor" && user.status === "Pending") {
        alert("Your tutor application is waiting for admin approval.");
        return;
      }

      if (user.role === "tutor" && user.status === "Rejected") {
        alert("Your tutor application was rejected. Please contact the admin.");
        return;
      }

      if (user.role === "tutor" && user.status !== "Approved") {
        alert("Your tutor account is not approved.");
        return;
      }

      localStorage.setItem(
        "htf_current_user",
        JSON.stringify(user)
      );

      alert("Login successful!");

      navigate(
        user.role === "student"
          ? "/student-dashboard"
          : "/tutor-dashboard"
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-left">
          <div className="auth-brand">🎓 TutorFinder</div>

          <div className="auth-left-content">
            <span className="auth-tag">LEARN WITHOUT LIMITS</span>
            <h1>Welcome to TutorFinder</h1>

            <p>
              Connect with expert tutors. Learn new skills
              and achieve your academic goals.
            </p>

            <div className="auth-illustration">📚</div>

            <h3>Learn. Teach. Grow.</h3>
            <p className="auth-small-text">
              Your learning journey starts here.
            </p>
          </div>
        </div>

        <div className="auth-right">

          <div className="auth-heading">
            <h2>
              {mode === "signup" ? "Create Your Account" : "Welcome Back"}
            </h2>

            <p>
              {mode === "signup"
                ? "Join our learning community today"
                : "Login to continue your learning journey"}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="auth-field">
              <label>Account Type</label>

              <div className="role-options">
                <button
                  type="button"
                  className={role === "student" ? "selected" : ""}
                  onClick={() => setRole("student")}
                >
                  🎓 Student
                </button>

                <button
                  type="button"
                  className={role === "tutor" ? "selected" : ""}
                  onClick={() => setRole("tutor")}
                >
                  👨‍🏫 Tutor
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {mode === "signup" && (
              <div className="auth-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            )}

            {mode === "signup" && role === "student" && (
              <div className="auth-field">
                <label>Class / Grade</label>
                <input
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder="e.g. Class 10"
                  required
                />
              </div>
            )}

            {mode === "signup" && role === "tutor" && (
              <>
                <div className="auth-field">
                  <label>Qualification</label>
                  <input
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    placeholder="e.g. M.Sc Mathematics"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>Teaching Subject</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>Experience</label>
                  <input
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="e.g. 3 years"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>City</label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>Session Fee (₹)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    placeholder="Enter your session fee"
                    min="1"
                    required
                  />
                </div>
              </>
            )}

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {mode === "signup" && (
              <div className="auth-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button type="submit" className="auth-submit">
              {mode === "signup" ? "Create Account" : "Login"}
            </button>

          </form>

          <p className="auth-footer">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
