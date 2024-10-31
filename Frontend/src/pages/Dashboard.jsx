import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { FaFileExcel, FaFileCode, FaSignOutAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const METRICS = {
  carbonEmissions: {
    label: "Carbon Emissions",
    unit: "tons CO2e",
    color: "#357588",
  },
  waterUsage: { label: "Water Usage", unit: "kiloliters", color: "#4CAF50" },
  wasteGenerated: { label: "Waste Generated", unit: "tons", color: "#FF9800" },
  energyConsumption: {
    label: "Energy Consumption",
    unit: "MWh",
    color: "#E91E63",
  },
};

const YEARS = ["2019", "2020", "2021", "2022", "2023"];

// Industry benchmarks (dummy data)
const BENCHMARKS = {
  carbonEmissions: 75,
  waterUsage: 1200,
  wasteGenerated: 45,
  energyConsumption: 850,
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Dashboard = () => {
  const [sustainabilityData, setSustainabilityData] = useState(
    YEARS.reduce(
      (acc, year) => ({
        ...acc,
        [year]: Object.keys(METRICS).reduce(
          (metrics, metric) => ({
            ...metrics,
            [metric]: null,
          }),
          {}
        ),
      }),
      {}
    )
  );

  const dashboardRef = useRef();

  const handleInputChange = (year, metric, value) => {
    setSustainabilityData((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [metric]: value,
      },
    }));
  };

  // Convert data for charts
  const getChartData = () => {
    return YEARS.map((year) => ({
      year,
      ...Object.keys(METRICS).reduce(
        (acc, metric) => {
          const value = sustainabilityData[year][metric];
          // Only include non-null values
          if (value !== null && value !== '') {
            return {
              ...acc,
              [metric]: Number(value),
            };
          }
          return acc;
        },
        {}
      ),
    })).filter(data =>
      // Only include years that have at least one non-null metric
      Object.keys(data).length > 1 // > 1 because 'year' is always present
    );
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getChartData());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sustainability Data");
    XLSX.writeFile(wb, "sustainability_metrics.xlsx");
  };

  // Prepare pie chart data for waste generated
  const getWasteData = () => {
    return YEARS.map((year) => ({
      name: year,
      value: Number(sustainabilityData[year].wasteGenerated) || 0,
    })).filter((item) => item.value > 0);
  };

  // Add new state for form visibility
  const [showForm, setShowForm] = useState(true);

  // Add JSON export function (replaces handlePrintPDF)
  const exportToJSON = () => {
    const data = getChartData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sustainability_metrics.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add this new function after other handlers
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Add this function to check if all fields are filled
  const isFormComplete = () => {
    return YEARS.every(year =>
      Object.keys(METRICS).every(metric =>
        sustainabilityData[year][metric] !== null &&
        sustainabilityData[year][metric] !== '' &&
        sustainabilityData[year][metric] !== undefined
      )
    );
  };

  // Modify the handleSubmit function
  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Please fill in all metrics for all years before submitting.');
      return;
    }

    try {
      const formattedData = getChartData();
      console.log("Data to be submitted:", formattedData);
      const response = await fetch(`${API_URL}/api/metrics/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data. Please try again.");
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    // Add your logout logic here
    console.log("Logging out...");
  };

  // Modify useEffect to fetch metric data
  useEffect(() => {
    const fetchMetricData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/metrics/get`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const { metrics } = await response.json(); // Destructure the metrics array from the response
          console.log("Raw API metrics:", metrics); // Debug the raw metrics array

          // Initialize empty data structure
          const formattedData = {};

          // First, initialize all years with null values
          YEARS.forEach(year => {
            formattedData[year] = {
              carbonEmissions: null,
              waterUsage: null,
              wasteGenerated: null,
              energyConsumption: null
            };
          });

          // Then, populate with actual data where it exists
          metrics.forEach(item => {
            const year = String(item.year);
            if (YEARS.includes(year)) {
              formattedData[year] = {
                carbonEmissions: item.carbonEmissions !== undefined ? Number(item.carbonEmissions) : null,
                waterUsage: item.waterUsage !== undefined ? Number(item.waterUsage) : null,
                wasteGenerated: item.wasteDistributed !== undefined ? Number(item.wasteDistributed) : null,
                energyConsumption: item.energyConsumption !== undefined ? Number(item.energyConsumption) : null
              };
            }
          });

          console.log("Formatted data structure:", formattedData);
          setSustainabilityData(formattedData);
        } else {
          console.error("Failed to fetch metric data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching metric data:", error);
      }
    };

    fetchMetricData();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div
        ref={dashboardRef}
        className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 bg-white print:p-0"
      >
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
          {/* Modified Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6 hide-in-print">
            <div className="flex items-center gap-4">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#357588]">
                Sustainability Dashboard
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-[#357588] text-white rounded-md hover:bg-[#2c6274] transition-colors duration-200"
              >
                {showForm ? "Hide Form" : "Show Form"}
              </button>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={exportToJSON}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-[#357588] text-white rounded-md hover:bg-[#2c6274] text-xs sm:text-sm md:text-base transition-colors duration-200"
              >
                <FaFileCode className="text-xs sm:text-sm md:text-base" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={exportToExcel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm md:text-base transition-colors duration-200"
              >
                <FaFileExcel className="text-xs sm:text-sm md:text-base" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs sm:text-sm md:text-base transition-colors duration-200"
              >
                <FaSignOutAlt className="text-xs sm:text-sm md:text-base" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Modified Data Input Form with conditional rendering */}
          {showForm && (
            <div>
              <div className="hide-in-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {YEARS.map((year) => (
                  <div key={year} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Year {year}
                    </h3>
                    {Object.entries(METRICS).map(
                      ([metric, { label, unit }]) => (
                        <div key={metric} className="mb-2 sm:mb-3">
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                            {label} ({unit})
                          </label>
                          <input
                            type="number"
                            value={sustainabilityData[year][metric]}
                            onChange={(e) =>
                              handleInputChange(year, metric, e.target.value)
                            }
                            className="w-full p-1.5 sm:p-2 border rounded-md focus:ring-[#357588] focus:border-[#357588] text-sm"
                            required={true}
                            placeholder={`Enter ${label.toLowerCase()}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormComplete()}
                  className={`px-6 py-2 text-white rounded-md transition-colors duration-200 font-medium ${isFormComplete()
                    ? 'bg-sky-800 hover:bg-[#2c6274]'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Submit Data
                </button>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Chart containers */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow min-h-[300px] sm:min-h-[350px]">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-800">
                Carbon Emissions Trends
              </h3>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="carbonEmissions"
                      stroke={METRICS.carbonEmissions.color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow min-h-[300px] sm:min-h-[350px]">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-800">
                Water Usage Analysis
              </h3>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="waterUsage"
                      stroke={METRICS.waterUsage.color}
                      fill={METRICS.waterUsage.color + "80"}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow min-h-[300px] sm:min-h-[350px]">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-800">
                Waste Distribution by Year
              </h3>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getWasteData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value}${METRICS.wasteGenerated.unit}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getWasteData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow min-h-[300px] sm:min-h-[350px]">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-800">
                Energy Consumption Overview
              </h3>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="10%"
                    outerRadius="80%"
                    data={getChartData().map((item, index) => ({
                      name: item.year,
                      value: item.energyConsumption,
                      fill: COLORS[index % COLORS.length],
                    }))}
                  >
                    <RadialBar
                      minAngle={15}
                      label={{ position: "insideStart", fill: "#fff" }}
                      background
                      dataKey="value"
                    />
                    <Legend />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Industry Benchmark Comparison */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Industry Benchmark Comparison
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(METRICS).map(([metric, { label }]) => ({
                    name: label,
                    Current: Number(sustainabilityData["2023"][metric]) || 0,
                    Benchmark: BENCHMARKS[metric],
                    Performance:
                      (
                        ((Number(sustainabilityData["2023"][metric]) || 0) /
                          BENCHMARKS[metric]) *
                        100
                      ).toFixed(1) + "%",
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Current"
                    fill="#357588"
                    name="Your Performance"
                  />
                  <Bar
                    dataKey="Benchmark"
                    fill="#82ca9d"
                    name="Industry Benchmark"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Summary */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(METRICS).map(([metric, { label, color }]) => {
                const currentValue =
                  Number(sustainabilityData["2023"][metric]) || 0;
                const benchmark = BENCHMARKS[metric];
                const performance = ((currentValue / benchmark) * 100).toFixed(
                  1
                );
                const isHigher = performance > 100;

                return (
                  <div
                    key={metric}
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg"
                  >
                    <h4 className="font-medium text-xs sm:text-sm">{label}</h4>
                    <div className="flex items-center">
                      <p
                        className={`text-base sm:text-lg font-bold ${isHigher ? "text-red-500" : "text-green-500"
                          }`}
                      >
                        {performance}%
                      </p>
                      {isHigher ? (
                        <MdArrowDropUp className="text-red-500 text-2xl" />
                      ) : (
                        <MdArrowDropDown className="text-green-500 text-2xl" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      of industry benchmark
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
