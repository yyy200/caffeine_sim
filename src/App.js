import "./App.css";
import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import CaffeineReferenceTooltip from "./CaffeineReferenceTooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const DEFAULT_HALF_LIFE_HOURS = 5; // Default half-life in hours

// Helper function to parse time string (HH:MM format)
const parseTimeString = (timeString, referenceDate) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(referenceDate);
  date.setHours(hours, minutes || 0, 0, 0);
  return date;
};

function App() {
  const [caffeineLog, setCaffeineLog] = useState([]);
  const [halfLifeHours, setHalfLifeHours] = useState(DEFAULT_HALF_LIFE_HOURS);
  const [chartRef, setChartRef] = useState(null);

  // Calculate caffeine levels throughout the day
  const caffeineLevels = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    // Generate time points every hour throughout the day for better performance
    const timePoints = [];
    const levels = [];
    const currentTime = new Date(startOfDay);

    while (currentTime <= endOfDay) {
      const timeString = currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
      });

      // Calculate total caffeine at this point in time
      let totalCaffeine = 0;

      caffeineLog.forEach((entry) => {
        // Parse entry time
        const entryTime = parseTimeString(entry.time, now);
        const currentTimeMs = currentTime.getTime();
        const entryTimeMs = entryTime.getTime();

        // Only consider entries that occurred before or at this time
        if (entryTimeMs <= currentTimeMs) {
          const hoursElapsed = (currentTimeMs - entryTimeMs) / (1000 * 60 * 60);
          const halfLives = hoursElapsed / halfLifeHours;
          const remaining = entry.amount * Math.pow(0.5, halfLives);
          totalCaffeine += remaining;
        }
      });

      timePoints.push(timeString);
      levels.push(Math.max(0, totalCaffeine)); // Ensure non-negative

      currentTime.setHours(currentTime.getHours() + 1);
    }

    return { timePoints, levels };
  }, [caffeineLog, halfLifeHours]);

  const chartData = {
    labels: caffeineLevels.timePoints,
    datasets: [
      {
        label: "Caffeine Level (mg)",
        data: caffeineLevels.levels,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: "rgb(59, 130, 246)",
        pointHoverBorderColor: "#fff",
      },
      {
        label: "Sleep Impact Threshold (100 mg)",
        data: caffeineLevels.timePoints.map(() => 100),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
      {
        label: "Dangerous Level (400 mg)",
        data: caffeineLevels.timePoints.map(() => 400),
        borderColor: "rgb(220, 38, 38)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [10, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
    ],
  };

  // Detect mobile screen size
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#cbd5e1",
          font: {
            size: isMobile ? 10 : 12,
          },
          boxWidth: isMobile ? 10 : 12,
          padding: isMobile ? 8 : 10,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#f1f5f9",
        borderColor: "#334155",
        borderWidth: 1,
        titleFont: {
          size: isMobile ? 11 : 12,
        },
        bodyFont: {
          size: isMobile ? 11 : 12,
        },
        padding: isMobile ? 8 : 12,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toFixed(2)} mg`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
          animation: {
            duration: 0,
          },
        },
        pan: {
          enabled: true,
          mode: "xy",
          animation: {
            duration: 0,
          },
        },
        limits: {
          y: {
            min: 0,
            max: 1000,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 450,
        title: {
          display: true,
          text: "Caffeine (mg)",
          color: "#cbd5e1",
          font: {
            size: isMobile ? 10 : 12,
            weight: 500,
          },
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: isMobile ? 9 : 11,
          },
          maxTicksLimit: isMobile ? 6 : 10,
        },
        grid: {
          color: "#334155",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time of Day",
          color: "#cbd5e1",
          font: {
            size: isMobile ? 10 : 12,
            weight: 500,
          },
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: isMobile ? 9 : 11,
          },
          maxTicksLimit: isMobile ? 8 : 12,
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          color: "#334155",
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Caffeine Tracker</h1>
        <p className="subtitle">
          Track your caffeine intake and visualize levels in your body
        </p>

        <div className="main-layout">
          <div className="left-column">
            <div className="settings-section">
              <h3>Settings</h3>
              <div className="half-life-control">
                <label htmlFor="halfLife">Half-life (hours):</label>
                <input
                  type="number"
                  id="halfLife"
                  min="0.1"
                  max="24"
                  step="0.1"
                  value={halfLifeHours}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value > 0) {
                      setHalfLifeHours(value);
                    }
                  }}
                />
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => setHalfLifeHours(DEFAULT_HALF_LIFE_HOURS)}
                >
                  Reset to Default
                </button>
              </div>
            </div>

            <div className="form-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
                  const caffeineAmount = parseFloat(form.caffeineAmount.value);
                  const time =
                    form.time.value ||
                    new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  setCaffeineLog([
                    ...caffeineLog,
                    { amount: caffeineAmount, time },
                  ]);
            form.reset();
          }}
        >
                <div className="form-group">
                  <div className="input-with-hint">
                    <label htmlFor="caffeineAmount" className="input-label">
                      Caffeine Amount (mg)
                      <CaffeineReferenceTooltip />
                    </label>
          <input
            type="number"
                      id="caffeineAmount"
            name="caffeineAmount"
            placeholder="Caffeine Amount (mg)"
                      step="0.1"
                      min="0"
            required
          />
                  </div>
          <input type="time" name="time" />
          <button type="submit">Add Entry</button>
                </div>
        </form>
            </div>

            <div className="log-section">
              <h2>Caffeine Intake Log</h2>
              {caffeineLog.length === 0 ? (
                <p className="empty-message">
                  No entries yet. Add your first caffeine intake!
                </p>
              ) : (
                <ul className="log-list">
                  {caffeineLog.map((entry, index) => (
            <li key={index}>
                      <span className="amount">{entry.amount} mg</span>
                      <span className="time">at {entry.time}</span>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setCaffeineLog(
                            caffeineLog.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        ×
                      </button>
            </li>
          ))}
        </ul>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="chart-section">
              <div className="chart-header">
                <h2>Caffeine Levels in Body</h2>
                {caffeineLog.length > 0 && (
                  <button
                    className="reset-zoom-btn"
                    onClick={() => {
                      if (chartRef) {
                        chartRef.resetZoom();
                      }
                    }}
                    title="Reset zoom"
                  >
                    Reset Zoom
                  </button>
                )}
              </div>
              {caffeineLog.length === 0 ? (
                <p className="empty-message">
                  Add caffeine intake entries to see the chart
                </p>
              ) : (
                <div className="chart-container">
                  <Line
                    data={chartData}
                    options={chartOptions}
                    ref={(reference) => {
                      if (reference) {
                        setChartRef(reference.chartInstance || reference);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}

export default App;
