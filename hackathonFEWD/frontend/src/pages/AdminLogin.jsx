
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const adminEmail = "admin@tutorfinder.com";
    const adminPassword = "Admin@123";

    if (
      email === adminEmail &&
      password === adminPassword
    ) {
      localStorage.setItem("htf_admin_session", "true");

      alert("Admin login successful!");

      navigate("/admin");
    } else {
      alert("Invalid admin email or password!");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-right">

          <div className="auth-heading">
            <h2>Admin Login</h2>
            <p>Authorized access only</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">

            <div className="auth-field">
              <label>Admin Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Login as Admin
            </button>

          </form>

          <p className="auth-footer">
            This portal is restricted to authorized administrators.
          </p>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
