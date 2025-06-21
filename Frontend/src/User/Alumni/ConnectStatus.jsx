import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConnectStatus() {
  const token = Cookies.get("token");
  const [activeTab, setActiveTab] = useState("Freind Requests");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [pendingAcceptConnections, setPendingAcceptConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
  }, [token]);

  const handleConnect = async (alumniId) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/connect/${alumniId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Find the connected user from allUser list
      const connectedUser = allUser.find((user) => user.id === alumniId);
      if (connectedUser) {
        setPendingAcceptConnections((prev) => [
          ...prev,
          {
            accepting_user: connectedUser,
          },
        ]);
      }

      toast.success("Connection request sent successfully!");
    } catch (error) {
      console.error("Error connecting with alumni:", error);
      if (error.response && error.response.status === 400) {
        toast.error("You already connected this alumni.");
      } else {
        toast.error("Failed to send connection request.");
      }
    }
  };

  const handleUpdateConnect = async (connectID, alumniId, status) => {
    console.log("Status passed:", status); 
    if (!token) {
      console.error("User not authenticated");
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:8000/api/update_connection/${connectID}`,
        { 
          status: status,
          _method: "PUT" 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data)
      toast.success("Connection accepted successfully!");
      if (status === "accepted") {
        // Move user from pending to connected
        const acceptedConnection = pendingConnections.find(
          (conn) => conn.requesting_user.id === alumniId
        );
        
        if (acceptedConnection) {
          setConnectedUsers((prev) => [...prev, acceptedConnection.requesting_user]);
          setPendingConnections((prev) =>
            prev.filter((conn) => conn.requesting_user.id !== alumniId)
          );
        }
      } else if (status === "rejected") {
        // Remove from pending connections
        setPendingConnections((prev) =>
          prev.filter((conn) => conn.requesting_user.id !== alumniId)
        );
        toast.success("Connection rejected successfully!");
      }
    } catch (error) {
      console.error("Error updating connection:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Error updating connection.");
      } else {
        toast.error("Failed to update connection request.");
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = allUser.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.major_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.major.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                activeTab === "Application" ? "bg-blue-900 " : "bg-gray-300"
              } rounded-x rounded-t text-white `}
              onClick={() => setActiveTab("Application")}
            >
              Application List
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
              ) : pendingConnections.length === 0 ? (
                <div className="text-gray-600 italic">
                  No pending friend requests.
                </div>
              ) : (
                pendingConnections.map((connection) => {
                  const user = connection.requesting_user;
                  return(
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
                      <button
                        onClick={() => handleUpdateConnect(connection.id,user.id, "accepted")}
                        className="px-6 py-1.5 text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 rounded-lg transition duration-150"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateConnect(connection.id,user.id, "rejected")}
                        className="px-6 py-1.5 text-sm font-semibold bg-red-100 text-red-600 hover:bg-red-200 border border-red-300 rounded-lg transition duration-150"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )})
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
                        <button className="px-6 py-1.5 bg-green-400 text-sm text-white flex itemcenter rounded-lg">
                          Connected
                        </button>
                      <button className="px-4 py-1.5 bg-blue-900 text-sm text-white rounded-lg">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "Application" && (
            <div className="flex flex-col mt-6">
              {pendingAcceptConnections.length === 0 ? (
                <div className="text-gray-600 italic">
                  No pending applications.
                </div>
              ) : (
                pendingAcceptConnections.map((connections) => {
                  const user = connections.accepting_user;
                  return(
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
                        <button className="px-4 py-1.5 text-sm font-medium flex items-center gap-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-300 cursor-not-allowed">
                          <svg className="w-4 h-4 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Waiting for Acceptance...
                        </button>
                      </div>
                    </div>
                  </div>
                )})
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-5 top-14 transform translate-y-1 text-gray-400" />
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-gray-600 italic">
                  No alumni found matching your search.
                </div>
              ) : (
                filteredUsers.map((user) => (
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
                        <button 
                          onClick={() => handleConnect(user.id)}
                          className="px-6 py-1.5 bg-blue-900 text-sm font-semibold text-white rounded-lg">
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
       {/* Toast notifications container */}
            <ToastContainer position="top-center" autoClose={3000} toastClassName={(context) =>
              `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`
            }/>
    </div>
  );
}