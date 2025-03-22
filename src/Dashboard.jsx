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
  const [compareSymbol, setCompareSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Twelve Data API key is:", import.meta.env.VITE_TWELVE_DATA_API_KEY);
  }, []);

  // ----------------------------------------------------------------
  // Fetch stock data for a given symbol from Twelve Data, return
  // an object mapping date -> closePrice. We'll unify them later.
  // ----------------------------------------------------------------
  const fetchStockData = async (ticker) => {
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&outputsize=1300&apikey=${import.meta.env.VITE_TWELVE_DATA_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Error fetching data.");
    }
    
    const timeSeries = data.values?.slice().reverse() || [];
    
    // Build {dateString: closePrice} object
    const result = {};
    timeSeries.forEach((item) => {
      result[item.datetime] = parseFloat(item.close);
    });
    return result;
  };

  // ----------------------------------------------------------------
  // Handle single search (primary symbol). Resets the chart to show
  // just the main symbol in blue.
  // ----------------------------------------------------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symbol) {
      setError("Please enter a ticker symbol.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const mainData = await fetchStockData(symbol);

      // Build initial chart with just the main dataset.
      const unified = unifyDatasets(mainData, null, symbol, null);
      setChartData(unified);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setChartData(null);
      setError(err.message || "Failed to fetch data.");
    }
  };

  // ----------------------------------------------------------------
  // Handle compare (second symbol). Fetches the second dataset
  // and merges it into the existing chart data (if any).
  // ----------------------------------------------------------------
  const handleCompare = async (e) => {
    e.preventDefault();
    if (!compareSymbol) {
      setError("Please enter a compare ticker symbol.");
      return;
    }
    if (!chartData) {
      setError("Please search for a main symbol first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // fetch second dataset
      const compareData = await fetchStockData(compareSymbol);

      // unify with existing chart data
      const mainDataObj = convertChartDataToObject(chartData.datasets[0]);
      const updated = unifyDatasets(
        mainDataObj, 
        compareData,
        chartData.datasets[0].label.replace(" Closing Price", ""), // main symbol
        compareSymbol
      );

      setChartData(updated);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to compare data.");
    }
  };

  // ----------------------------------------------------------------
  // unifyDatasets: merges two date->price objects into a single
  // chartData with two datasets. The main dataset is in blue,
  // the compare dataset is in green. Returns a structure
  // suitable for react-chartjs-2's "data" prop.
  // ----------------------------------------------------------------
  function unifyDatasets(mainObj, compareObj, mainSymbol, compareSymbol) {
    // 1) Collect all dates from both sets
    const allDatesSet = new Set([
      ...Object.keys(mainObj || {}),
      ...(compareObj ? Object.keys(compareObj) : [])
    ]);
    // Convert to array and sort ascending
    const allDates = Array.from(allDatesSet).sort((a, b) => (a < b ? -1 : 1));

    // 2) Build arrays for both symbols. We'll do a null if no data
    const mainDataArr = allDates.map((date) =>
      mainObj[date] !== undefined ? mainObj[date] : null
    );

    // If compareObj is null, that means we only have one dataset
    let compareDataArr = null;
    if (compareObj) {
      compareDataArr = allDates.map((date) =>
        compareObj[date] !== undefined ? compareObj[date] : null
      );
    }

    // 3) Build the chartData object
    const datasets = [
      {
        label: `${mainSymbol.toUpperCase()} Closing Price`,
        data: mainDataArr,
        borderColor: "#1565C0",
        backgroundColor: "rgba(21, 101, 192, 0.2)",
        fill: true
      }
    ];

    if (compareDataArr) {
      datasets.push({
        label: `${compareSymbol.toUpperCase()} Closing Price`,
        data: compareDataArr,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        fill: true
      });
    }

    return {
      labels: allDates,
      datasets
    };
  }

  // ----------------------------------------------------------------
  // convertChartDataToObject: If we already have a chartData, the
  // main dataset is chartData.datasets[0]. We reconstruct an
  // object {date: price} to unify with new data.
  // This is only used for the main dataset in handleCompare.
  // ----------------------------------------------------------------
  function convertChartDataToObject(dataset) {
    // The x-axis is in chartData.labels
    // The dataset's data array parallels the labels array
    // We want { label -> dataValue, ... }
    const newObj = {};
    if (!chartData || !chartData.labels) return newObj;
    chartData.labels.forEach((label, i) => {
      newObj[label] = dataset.data[i];
    });
    return newObj;
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      {/* BACK TO CALCULATOR BUTTON */}
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

      {/* SEARCH & COMPARE SECTION */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}
      >
        {/* MAIN SYMBOL INPUT */}
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (e.g. TSLA)"
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
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

        {/* COMPARE SYMBOL INPUT */}
        <input
          type="text"
          value={compareSymbol}
          onChange={(e) => setCompareSymbol(e.target.value)}
          placeholder="Compare (e.g. NVDA)"
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        <button
          onClick={handleCompare}
          style={{
            backgroundColor: "green",
            color: "#fff",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer"
          }}
        >
          Compare
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
        <div style={{ height: "500px" }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                point: {
                  // Show a dot every 10th data point
                  radius: (context) => (context.dataIndex % 10 === 0 ? 3 : 0)
                }
              },
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
                  text: "Historical Prices"
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
