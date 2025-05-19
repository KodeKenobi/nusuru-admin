import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsProps {
  currentData?: any[];
}

export default function Analytics({ currentData }: AnalyticsProps) {
  // Use aggregated data if available
  const counts = currentData && currentData[0] ? currentData[0] : null;

  // Debug logging
  console.log("Analytics Debug - Full Data:", {
    currentData,
    counts,
    activeUsers: counts?.activeUsers,
    rawActiveUsers: currentData?.[0]?.activeUsers,
  });

  const barData = {
    labels: ["Users", "Sellers", "Providers", "Products", "Services"],
    datasets: [
      {
        label: "Count",
        data: counts
          ? [
              counts.users,
              counts.sellers,
              counts.providers,
              counts.products,
              counts.services,
            ]
          : [120, 45, 30, 80, 60],
        backgroundColor: "#fa5b00",
      },
    ],
  };

  // Busy times chart (sign-ins by hour)
  const busyTimes = counts?.busyTimes ?? null;
  const busyTimesData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Sign-ins (last 7 days)",
        data: busyTimes || Array(24).fill(0),
        backgroundColor: "#fa5b00",
      },
    ],
  };

  // Example pie and line data (can be replaced with real analytics later)
  const pieData = {
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        label: "Status",
        data: [200, 50, 30],
        backgroundColor: ["#fa5b00", "#222", "#888"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [10, 20, 15, 30, 25, 40],
        borderColor: "#fa5b00",
        backgroundColor: "rgba(250,91,0,0.1)",
        tension: 0.4,
      },
    ],
  };

  const totalProducts = counts?.products ?? null;
  const totalServices = counts?.services ?? null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Card 1: Total Products */}
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222] flex flex-col items-center justify-center">
          <h3 className="text-lg text-white mb-4">Total Products</h3>
          <div className="text-5xl font-bold text-[#fa5b00] mb-2">
            {totalProducts !== null ? totalProducts : "-"}
          </div>
        </div>
        {/* Card 2: Total Services */}
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222] flex flex-col items-center justify-center">
          <h3 className="text-lg text-white mb-4">Total Services</h3>
          <div className="text-5xl font-bold text-[#fa5b00] mb-2">
            {totalServices !== null ? totalServices : "-"}
          </div>
        </div>
        {/* Card 3: Active Users */}
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222] flex flex-col items-center justify-center">
          <h3 className="text-lg text-white mb-4">
            Active Users (Last 7 Days)
          </h3>
          <div className="text-5xl font-bold text-[#fa5b00] mb-2">
            {counts?.activeUsers !== null ? counts.activeUsers : "-"}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222]">
          <h3 className="text-lg text-white mb-4">Entity Counts</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222]">
          <h3 className="text-lg text-white mb-4">
            Busy Times (Sign-ins by Hour, last 7 days)
          </h3>
          <Bar
            data={busyTimesData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        {/* Example charts below, can be replaced with real analytics */}
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222]">
          <h3 className="text-lg text-white mb-4">Status Distribution</h3>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
        <div className="bg-[#181818] rounded-xl p-6 border border-[#222]">
          <h3 className="text-lg text-white mb-4">User Growth Over Time</h3>
          <Line data={lineData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
