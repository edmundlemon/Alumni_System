import { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaDonate } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Fake Donation Data for Donut Chart
const donationData = [
  { name: "Scholarship Fund", value: 40000 },
  { name: "Library Expansion", value: 25000 },
  { name: "Athletic Program", value: 15000 },
  { name: "Research Grants", value: 10000 },
  { name: "Other", value: 5000 },
];

const COLORS = ["#4285F4", "#FB8C00", "#34A853", "#EA4335", "#9E9E9E"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    donations: 0,
    connections: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 1089,
        events: 42,
        donations: 32000,
        connections: 154,
      });
    }, 1000);
  }, []);

  const userActivityData = [
    { name: "Mon", logins: 65, events: 28, connections: 45 },
    { name: "Tue", logins: 60, events: 48, connections: 25 },
    { name: "Wed", logins: 78, events: 40, connections: 40 },
    { name: "Thu", logins: 80, events: 20, connections: 60 },
    { name: "Fri", logins: 65, events: 88, connections: 35 },
    { name: "Sat", logins: 50, events: 25, connections: 48 },
    { name: "Sun", logins: 58, events: 42, connections: 40 },
  ];

  return (
    <div className="p-6 bg-gray-50 max-h-[666px] overflow-y-auto rounded-lg"
         style={{
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaUsers />} label="Total Users" value={stats.users} />
        <StatCard
          icon={<FaCalendarAlt />}
          label="Events"
          value={stats.events}
        />
        <StatCard
          icon={<FaDonate />}
          label="Donations (RM)"
          value={`RM ${stats.donations.toLocaleString()}`}
        />
        <StatCard
          icon={<MdPeople />}
          label="Connections"
          value={stats.connections}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activity Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">User Activity</h2>
            <div className="space-x-2">
              <button className="px-2 py-1 border rounded">Day</button>
              <button className="px-2 py-1 border rounded bg-gray-200">
                Week
              </button>
              <button className="px-2 py-1 border rounded">Month</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#4285F4"
                strokeWidth={3}
                name="User Logins"
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#34A853"
                strokeWidth={3}
                name="Event Registrations"
              />
              <Line
                type="monotone"
                dataKey="connections"
                stroke="#FB8C00"
                strokeWidth={3}
                name="Connections Made"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donation Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Donation Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donationData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                label
              >
                {donationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donation Table */}
      <div className="bg-white p-4 rounded-lg shadow-md ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Donation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="py-2 px-4 border">Donor</th>
                <th className="py-2 px-4 border">Amount (RM)</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border">John Doe</td>
                <td className="py-2 px-4 border">RM 1,000</td>
                <td className="py-2 px-4 border">2025-05-01</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border">Jane Lim</td>
                <td className="py-2 px-4 border">RM 500</td>
                <td className="py-2 px-4 border">2025-05-20</td>
              </tr>
              {/* Add API data dynamically later */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 border border-gray-200">
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
