import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountManagement = () => {
  const [verificationStatus, setVerificationStatus] = useState(
    "Please wait while we verify your email address."
  );
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const oobCode = urlParams.get("oobCode");

    if (!mode || !oobCode) {
      setVerificationStatus("Invalid verification link.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ mode, oobCode }),
          credentials: "include",
        });

        if (response.ok) {
          setVerificationStatus(
            "Email verified successfully. You will be redirected to the login page shortly..."
          );

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setVerificationStatus(
            "Email verification failed. Please try again later or contact support."
          );
        }
      } catch (error) {
        console.error("Error during email verification:", error);
        setVerificationStatus(
          "An error occurred during verification. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigate, csrfToken]);

  return (
    <div className="form-container">
      <h2>Verifying Your Email...</h2>
      <p id="verificationStatus">
        {loading ? "Verifying..." : verificationStatus}
      </p>
      <input type="hidden" id="csrfToken" name="csrfToken" value={csrfToken} />
    </div>
  );
};

export default AccountManagement;
