// SignUpPage.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // determine bar color and label
  const getStrength = (len) => {
    if (len === 0) {
      return { color: "transparent", label: "" };
    } else if (len <= 5) {
      return { color: "red", label: "Weak" };
    } else if (len <= 7) {
      return { color: "orange", label: "Fair" };
    } else if (len <= 9) {
      return { color: "#90EE90", label: "Good" };
    } else {
      return { color: "green", label: "Strong" };
    }
  };

  const { color: strengthColor, label: strengthLabel } = getStrength(
    password.length
  );

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created! Please log in.");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Sign Up Error:", error);
      let msg;
      switch (error.code) {
        case "auth/email-already-in-use":
          msg = "That email’s already registered. Try logging in.";
          break;
        case "auth/invalid-email":
          msg = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          msg = "Password is too weak. Use at least 6 characters.";
          break;
        default:
          msg = "Sign‑up failed. Please try again.";
      }
      toast.error(msg);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "1rem" }}>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        {/* Email */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Password */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          {/* strength bar */}
          <div
            style={{
              height: "6px",
              width: "100%",
              backgroundColor: strengthColor,
              borderRadius: "4px",
              marginTop: "4px",
            }}
          />
          {/* strength label */}
          {strengthLabel && (
            <small
              style={{
                display: "block",
                marginTop: "4px",
                fontWeight: 500,
                color: strengthColor,
              }}
            >
              {strengthLabel}
            </small>
          )}
        </div>

        {/* Confirm Password */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

// inline styles
const containerStyle = {
  maxWidth: "400px",
  margin: "3rem auto",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
};
const fieldStyle = { marginBottom: "1rem", textAlign: "left" };
const labelStyle = { display: "block", fontWeight: 600, marginBottom: "0.5rem" };
const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const buttonStyle = {
  backgroundColor: "#1565C0",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "4px",
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
};

export default SignUpPage;
