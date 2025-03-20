import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
import "./App.css";

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

function App() {
  const [initialDeposit, setInitialDeposit] = useState(5000);
  const [years, setYears] = useState(5);
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
    <div
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

        {/* Each label + input in its own container for spacing */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
          <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
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
                  legend: {
                    position: "top"
                  },
                  title: {
                    display: true,
                    text: "Growth Over Time",
                    font: {
                      size: 16
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: {
                      callback: (value) => "$" + Number(value).toLocaleString()
                    }
                  },
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0
                    }
                  }
                }
              }}
              height={400}
            />
          )}
        </div>
      </div>
    </div>
  );
}

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
      // Annual compounding
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

  return {
    labels,
    principalData,
    totalData,
    finalBalance: balance
  };
}

export default App;
