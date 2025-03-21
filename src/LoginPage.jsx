import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom"; // ADDED

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // ADDED

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!"); // ADDED
      navigate("/");              // ADDED - Go to home page on success
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
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
      <h2 style={{ marginBottom: "1rem" }}>Log In</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
