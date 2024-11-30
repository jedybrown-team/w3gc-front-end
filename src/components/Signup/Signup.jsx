import React, { useState, useEffect } from "react";
import "./signup.css";

const Signup = () => {
  console.log("Inside now ");
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (!csrfToken) {
      console.log("Fetching CSRF token");
      const fetchCsrfToken = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/admin/get-csrf-token",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch CSRF token");
          }

          const data = await response.json();
          console.log("CSRF Token:", data.csrfToken);

          if (data.csrfToken) {
            setCsrfToken(data.csrfToken);
          } else {
            console.error("CSRF token missing from server response.");
          }
        } catch (error) {
          console.error("Failed to fetch CSRF token:", error);
        }
      };

      fetchCsrfToken();
    }
  }, [csrfToken]); // Add csrfToken as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    try {
      const response = await fetch("http://localhost:3000/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        setFormData({ username: "", email: "", password: "" });
      } else {
        alert(`Signup failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Hidden input for CSRF token */}
        <input type="hidden" name="csrfToken" value={csrfToken} />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
