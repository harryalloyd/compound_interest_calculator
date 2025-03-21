import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { onAuthStateChanged, signOut } from "firebase/auth"; // ADDED
import { auth } from "./firebase";                         // ADDED

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function HomePage() {
  const navigate = useNavigate();

  // Track the current user
  const [currentUser, setCurrentUser] = useState(null); // ADDED

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
      } else {
        // No user is signed in
        setCurrentUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // ADDED: Log out function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally navigate somewhere if you want
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message);
    }
  };

  // Existing state for the calculator...
  const [initialDeposit, setInitialDeposit] = useState(5000);
  const [years, setYears] = useState(10);
  const [rateOfReturn, setRateOfReturn] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState("Monthly");
  const [contributionAmount, setContributionAmount] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState("Monthly");

  const [chartData, setChartData] = useState(null);
  const [finalBalance, setFinalBalance] = useState(0);

  useEffect(() => {
    const { labels, principalData, totalData, finalBalance: computedFinal } =
      calculateChartData(
        initialDeposit,
        years,
        rateOfReturn,
        compoundFrequency,
        contributionAmount,
        contributionFrequency
      );

    setFinalBalance(computedFinal);

    const newChartData = {
      labels,
      datasets: [
        {
          label: "Principal",
          data: principalData,
          borderColor: "#39A2DB",
          backgroundColor: "rgba(57,162,219,0.2)",
          fill: true,
          order: 1
        },
        {
          label: "Total Balance",
          data: totalData,
          borderColor: "#55D8A3",
          backgroundColor: "rgba(85,216,163,0.4)",
          fill: "-1",
          order: 2
        }
      ]
    };

    setChartData(newChartData);
  }, [
    initialDeposit,
    years,
    rateOfReturn,
    compoundFrequency,
    contributionAmount,
    contributionFrequency
  ]);

  return (
    <div style={{ position: "relative" }}>
      {/* TOP-RIGHT BUTTONS */}
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "1.5rem",
          display: "flex",
          gap: "1rem"
        }}
      >
        {currentUser ? (
          // If user is logged in, show Log Out button
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#fff",
              color: "#1565C0",
              border: "2px solid #1565C0",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Log Out
          </button>
        ) : (
          // If no user, show Login and Sign Up buttons
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#fff",
                color: "#1565C0",
                border: "2px solid #1565C0",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                backgroundColor: "#1565C0",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* TITLE / SUBTITLE */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "30px"
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>
          Compound Interest Calculator
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          Enter your details to project your investment growth
        </p>
      </header>

      {/* MAIN CONTENT */}
      <div
        className="app-container"
        style={{
          display: "flex",
          gap: "2rem",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem"
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            width: 300,
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
            Investment details
          </h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Initial deposit
            </label>
            <input
              type="text"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Years of growth
            </label>
            <input
              type="text"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Estimated rate of return (%)
            </label>
            <input
              type="text"
              value={rateOfReturn}
              onChange={(e) => setRateOfReturn(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Compound frequency
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Contribution amount
            </label>
            <input
              type="text"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}
            >
              Contribution frequency
            </label>
            <select
              value={contributionFrequency}
              onChange={(e) => setContributionFrequency(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Total Balance{" "}
            {finalBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}
          </h2>
          <div style={{ flex: 1 }}>
            {chartData && (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    title: {
                      display: true,
                      text: "Growth Over Time",
                      font: { size: 18 }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: { color: "#eee" },
                      ticks: {
                        callback: (value) => "$" + Number(value).toLocaleString()
                      }
                    },
                    x: {
                      grid: { color: "#eee" },
                      ticks: { maxRotation: 45, minRotation: 0 }
                    }
                  }
                }}
                height={400}
              />
            )}
          </div>
          <div style={{ marginTop: "1rem", textAlign: "center", color: "#666" }}>
            <small>
              Disclaimer: This calculator provides an estimate for illustration
              purposes only. Actual returns may vary.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

// No changes here, just included for completeness.
function calculateChartData(
  initialDeposit,
  years,
  rateOfReturn,
  compoundFrequency,
  contributionAmount,
  contributionFrequency
) {
  const labels = [];
  const principalData = [];
  const totalData = [];

  let balance = initialDeposit;
  let totalPrincipalContributed = initialDeposit;

  const monthlyRate = rateOfReturn / 100 / 12;
  const annualRate = rateOfReturn / 100;

  for (let year = 0; year <= years; year++) {
    labels.push(year === 0 ? "Now" : `${new Date().getFullYear() + year}`);
    principalData.push(totalPrincipalContributed);
    totalData.push(balance);

    if (year === years) break;

    if (compoundFrequency === "Monthly") {
      for (let m = 0; m < 12; m++) {
        balance *= 1 + monthlyRate;
        if (contributionFrequency === "Monthly") {
          balance += contributionAmount;
          totalPrincipalContributed += contributionAmount;
        }
      }
      if (contributionFrequency === "Annually") {
        balance += contributionAmount;
        totalPrincipalContributed += contributionAmount;
      }
    } else {
      balance *= 1 + annualRate;
      if (contributionFrequency === "Monthly") {
        const annualContribution = contributionAmount * 12;
        balance += annualContribution;
        totalPrincipalContributed += annualContribution;
      } else {
        balance += contributionAmount;
        totalPrincipalContributed += contributionAmount;
      }
    }
  }

  return { labels, principalData, totalData, finalBalance: balance };
}

export default HomePage;
