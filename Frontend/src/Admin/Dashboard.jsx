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
import axios from "axios";
import Cookies from "js-cookie";

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
    Forum: 0,
  });
  
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, eventRes, donationPostRes, donationRes, forumRes] = await Promise.all([
          axios.get("http://localhost:8000/api/view_all_users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/view_all_events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/view_all_donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/view_all_donation_posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/discussions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log(userRes.data);
        console.log(eventRes.data);
        console.log(donationPostRes.data);
        console.log(donationRes.data);
        console.log(forumRes.data);

        // Calculate total donation amount
        const totalDonations = donationRes.data.donations?.reduce((sum, donation) => {
          return sum + (donation.amount || 0);
        }, 0) || 0;

        // Get forum discussions count
        const forumCount = forumRes.data.discussions?.total || 
                          Object.keys(forumRes.data.discussions || {}).length || 0;

        // Update stats with actual API data
        setStats({
          users: userRes.data.length || 0, // Assuming userRes.data is an array
          events: eventRes.data.events?.length || 0,
          donations: totalDonations,
          Forum: forumCount,
        });

        // Set recent donations for the table (take first 5)
        const donations = donationRes.data.donations || [];
        setRecentDonations(donations.slice(0, 5));

      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data if API fails
        setStats({
          users: 1089,
          events: 42,
          donations: 32000,
          Forum: 154,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const userActivityData = [
    { name: "Mon", logins: 65, events: 28, Forum: 45 },
    { name: "Tue", logins: 60, events: 48, Forum: 25 },
    { name: "Wed", logins: 78, events: 40, Forum: 40 },
    { name: "Thu", logins: 80, events: 20, Forum: 60 },
    { name: "Fri", logins: 65, events: 88, Forum: 35 },
    { name: "Sat", logins: 50, events: 25, Forum: 48 },
    { name: "Sun", logins: 58, events: 42, Forum: 40 },
  ];

  return (
    <div className="p-6 bg-gray-50 max-h-[666px]  rounded-lg overflow-y-auto"
         style={{
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
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
          label="Forum"
          value={stats.Forum}
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
                dataKey="Forum"
                stroke="#FB8C00"
                strokeWidth={3}
                name="Forum Made"
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
          <h2 className="text-xl font-bold">Recent Donations</h2>
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
              {recentDonations.length > 0 ? (
                recentDonations.map((donation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      {donation.donor_name || donation.name || 'Anonymous'}
                    </td>
                    <td className="py-2 px-4 border">
                      RM {(donation.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">
                      {donation.date || donation.created_at || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                // Fallback static data when no API data available
                <>
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
                </>
              )}
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