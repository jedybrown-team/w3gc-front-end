import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/get-csrf-token`);

        const data = await response.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.error("CSRF token missing from server response.");
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password, mycsrfToken: csrfToken }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.emailVerified) {
          setMessage("Login successful!");
          setError("");
          navigate("/dashboard");
        } else {
          setError("Please verify your email to proceed with the login");
          setMessage("");
        }
      } else {
        setError(result.message || "Login failed");
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      setMessage("");
    }
  };
  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          id="csrfToken"
          name="csrfToken"
          value={csrfToken}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" id="loginBtn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Create Account</Link>
      </p>
    </div>
  );
};

export default Login;
