import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  const urlParams = new URLSearchParams(location.search);
  const oobCode = urlParams.get("oobCode");

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
      const response = await fetch(`${baseUrl}/api/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ oobCode, newPassword }),
      });

      const data = await response.json();
      setStatus(data.message);

      if (response.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("There was an error resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ResetPassword;
