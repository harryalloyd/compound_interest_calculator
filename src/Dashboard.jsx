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
  Legend
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Twelve Data API key is:", import.meta.env.VITE_TWELVE_DATA_API_KEY);
  }, []);

  const fetchStockData = async (ticker) => {
    try {
      setLoading(true);
      setError("");

      const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&outputsize=1300&apikey=${import.meta.env.VITE_TWELVE_DATA_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "error") {
        setError(data.message || "Error fetching data.");
        setChartData(null);
        setLoading(false);
        return;
      }

      const timeSeries = data.values?.slice().reverse() || [];
      const labels = timeSeries.map((item) => item.datetime);
      const closes = timeSeries.map((item) => parseFloat(item.close));

      setChartData({
        labels,
        datasets: [
          {
            label: `${ticker.toUpperCase()} Closing Price`,
            data: closes,
            borderColor: "#1565C0",
            backgroundColor: "rgba(21, 101, 192, 0.2)",
            fill: true
          }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!symbol) {
      setError("Please enter a ticker symbol.");
      return;
    }
    fetchStockData(symbol);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      {/* Back to Calculator button with pill style */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => navigate("/")}
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
          Back to Calculator
        </button>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Dashboard</h2>

      <form
        onSubmit={handleSearch}
        style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
      >
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter symbol (e.g. TSLA)"
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "0.5rem"
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#1565C0",
            color: "#fff",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </form>

      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "1rem"
          }}
        >
          {error}
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {chartData && !loading && (
        <div style={{ height: "400px" }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: true,
                  title: { display: true, text: "Date" }
                },
                y: {
                  display: true,
                  title: { display: true, text: "Price (USD)" }
                }
              },
              plugins: {
                legend: {
                  position: "top"
                },
                title: {
                  display: true,
                  text: `5-Year Historical Prices`
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
