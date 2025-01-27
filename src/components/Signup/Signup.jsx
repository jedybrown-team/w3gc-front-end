import React, { useState, useEffect } from "react";
import "./signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      const response = await fetch(`${baseUrl}/api/admin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          username,
          email,
          password,
          mycsrfToken: csrfToken,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Signup successful!");
        setError("");
      } else {
        setError(result.message || "Signup failed");
        setMessage("");
      }
    } catch (error) {
      setMessage("");
      setError("An error occurred during signup. Please try again.");
    }
  };
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          id="csrfToken"
          name="csrfToken"
          value={csrfToken}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
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

        <button type="submit" id="signupBtn">
          Sign Up
        </button>
      </form>
      <p>
        Have an account..? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
