import React, { useState, useEffect } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/get-csrf-token`, {
          credentials: "include",
        });
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
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/admin/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      console.error("Error:", error);
      setStatus("There was an error requesting the password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Request Reset"}
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ForgotPassword;
