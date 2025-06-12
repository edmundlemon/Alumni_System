import { useState, useEffect, use } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";

export default function ConnectStatus() {
  const token = Cookies.get("token");
  const [activeTab, setActiveTab] = useState("Freind Requests");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [pendingAcceptConnections, setPendingAcceptConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [connectedRes, userRes, pendingRes, pendingAptRes] =
          await Promise.all([
            axios.get("http://localhost:8000/api/connected_users", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            axios.get("http://localhost:8000/api/view_all_users", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            axios.get("http://localhost:8000/api/view_pending_connections", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            axios.get(
              "http://localhost:8000/api/view_pending_to_accept_connections",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            ),
          ]);
        console.log(connectedRes.data.connected_users);
        console.log(userRes.data);
        console.log("pending:", pendingRes.data.connections);
        console.log("pending accept:", pendingAptRes.data);
        setConnectedUsers(connectedRes.data.connected_users);
        setPendingConnections(pendingRes.data.connections);
        setPendingAcceptConnections(pendingAptRes.data.connections);
        setAllUser(userRes.data);
      } catch (error) {
        console.error("Error fetching connect status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      console.error("No token found, user might not be authenticated");
    }
  }, []);

  return (
    <div className="bg-[#f7f9f9] min-h-screen py-10">
      <div className="mx-20 min-h-screen border bg-white border-gray-300 rounded-lg shadow-lg">
        <div className="px-8 py-4 ">
          <h1 className="text-2xl py-3 font-bold text-blue-900 mb-4 border-b-2 border-blue-900">
            Connect Status
          </h1>
          <div className="flex py-1 gap-2">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "Freind Requests" ? "bg-blue-900" : "bg-gray-300"
              } rounded-x rounded-t text-white `}
              onClick={() => setActiveTab("Freind Requests")}
            >
              Friend Requests
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "Connections" ? "bg-blue-900 " : "bg-gray-300"
              } rounded-x rounded-t text-white `}
              onClick={() => setActiveTab("Connections")}
            >
              Connections
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "Find Alumni" ? "bg-blue-900 " : " bg-gray-300"
              } rounded-x rounded-t text-white `}
              onClick={() => setActiveTab("Find Alumni")}
            >
              Find Alumni
            </button>
          </div>
          {activeTab === "Freind Requests" && (
            <div className="flex flex-col mt-6">
              {loading ? (
                <div className="">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-4 border-b animate-pulse"
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                      </div>
                      <div className="w-24 h-8 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : allUser.length === 0 ? (
                <div className="text-gray-600 italic">
                  Your connections will appear here.
                </div>
              ) : (
                allUser.map((user) => (
                  <div
                    key={user.id}
                    className=" flex items-center justify-between py-6 pr-4 border-b "
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-gray-800 text-lg font-semibold">
                          {user.name}
                        </h3>
                        <p className="text-gray-600">
                          {user.major_name} | {user.major.faculty_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-1 bg-green-50  text-green-600 rounded">
                        Accept
                      </button>
                      <button className="px-4 py-1 bg-red-50  text-red-500 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "Connections" && (
            <div className="flex flex-col mt-6">
              {connectedUsers.length === 0 ? (
                <div className="text-gray-600 italic">
                  Your connections will appear here.
                </div>
              ) : (
                connectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className=" flex items-center justify-between py-6 pr-4 border-b "
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-gray-800 text-lg font-semibold">
                          {user.name}
                        </h3>
                        <p className="text-gray-600">
                          {user.major_name} | {user.faculty}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div>
                        <button className="px-6 py-1 bg-green-400 text-sm text-white rounded">
                          Connected
                        </button>
                      </div>
                      <button className="px-4 py-1 bg-blue-900 text-white rounded">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "Find Alumni" && (
            <div className="flex flex-col mt-8">
              <div className="relative">
                <label className="text-xl font-semibold " htmlFor="alumni">
                  Search for alumni...
                </label>
                <input
                  type="text"
                  placeholder="Search by name, major, or faculty"
                  className="py-3 my-4 px-5 pr-12 rounded-lg shadow-md w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value=""
                  onChange=""
                />
                <FaSearch className="absolute right-5 top-14 transform translate-y-1 text-gray-400" />
              </div>
              {allUser.length === 0 ? (
                <div className="text-gray-600 italic">
                  Your connections will appear here.
                </div>
              ) : (
                allUser.map((user) => (
                  <div
                    key={user.id}
                    className=" flex items-center justify-between py-6 pr-4 border-b "
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-gray-800 text-lg font-semibold">
                          {user.name}
                        </h3>
                        <p className="text-gray-600">
                          {user.major_name} | {user.major.faculty_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div>
                        <button className="px-6 py-1 bg-blue-900 text-sm text-white rounded">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
