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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Sign‑up successful! Please log in now.");

      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login");
    } catch (error) {
      console.error("Sign Up Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#1565C0",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "4px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%"
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
