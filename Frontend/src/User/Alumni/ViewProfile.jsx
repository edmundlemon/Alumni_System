import { useState, useEffect } from "react";
import { IoLocation } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import fallbackImage from '../../assets/fallback-image.jpg';
import { LuCalendarDays } from "react-icons/lu";
import { GrLocationPin } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";
import { GoGoal } from "react-icons/go";
import { useLocation } from "react-router-dom";

export default function ViewProfile() {
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
  const location = useLocation();
  const userID = location.state?.userInfo;
  console.log(userID)
  const [activeTab, setActiveTab] = useState("about");
  const [forum, setForum] = useState([]);
  const [user, setUser] = useState({});
  const [connections, setConnections] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredForum, setFilteredForum] = useState([]);

  useEffect(() => {
    // Initialize filtered data with full data
    setFilteredConnections(connections);
    setFilteredEvents(events);
    setFilteredForum(forum);
  }, [connections, events, forum]);

  // Search functions for each tab
  const handleConnectionSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredConnections(connections);
      return;
    }
    const filtered = connections.filter(connection =>
      connection.name.toLowerCase().includes(term.toLowerCase()) ||
      (connection.major_name && connection.major_name.toLowerCase().includes(term.toLowerCase())) ||
      (connection.company && connection.company.toLowerCase().includes(term.toLowerCase())) ||
      (connection.job_title && connection.job_title.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredConnections(filtered);
  };

  const handleEventSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter(event =>
      event.event_title.toLowerCase().includes(term.toLowerCase()) ||
      event.description.toLowerCase().includes(term.toLowerCase()) ||
      event.location.toLowerCase().includes(term.toLowerCase()) ||
      event.event_mode.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleForumSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredForum(forum);
      return;
    }
    const filtered = forum.filter(post =>
      post.subject.toLowerCase().includes(term.toLowerCase()) ||
      post.content.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredForum(filtered);
  };

  const handleRegister = async (eventId) => {
    if (!token) {
      toast.error("Please login to register for events");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/register_for_event/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Register successful:", response.data);
      toast.success("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error(error.response?.data?.message || "Failed to register for the event");
    }
  };

  const handleConnect = async (alumniId) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/connect/${alumniId}`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Connection successful:", response.data);
      toast.success("Connection request sent successfully!");
    } catch (error) {
      console.error("Error connecting with alumni:", error);
      if (error.response && error.response.status === 400) {
        toast.error("You already connected this alumni.");
      } else {
        toast.error("Failed to send connection request");
      }
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/view_user/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const userData = response.data;
        setUser(userData);
        setForum(userData.discussions || []);
        setConnections(userData.connections || []);
        setEvents(userData.events || []);
        
        console.log("User data:", userData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("User not found.");
          toast.error("User not found");
        } else {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && userID) {
      fetchUserData();
    } else {
      console.error("Token or user ID not found");
      setLoading(false);
    }
  }, [token, userID]);

  const LoadingSkeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  const ProfileLoadingSkeleton = () => (
    <section className="min-h-screen">
      <div className="flex w-full h-80 bg-blue-900">
        <div className="flex px-20 items-center h-full w-full">
          <div className="w-48 h-48 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="text-white ml-32 space-y-4 flex-1">
            <LoadingSkeleton className="h-8 w-64 bg-blue-200" />
            <LoadingSkeleton className="h-5 w-80 bg-blue-200" />
            <LoadingSkeleton className="h-4 w-32 bg-blue-200" />
            <LoadingSkeleton className="h-4 w-48 bg-blue-200" />
          </div>
          <LoadingSkeleton className="h-10 w-32 bg-blue-200" />
        </div>
      </div>
      <div className="flex px-20 pt-10 pb-20 gap-4">
        <div className="w-1/4 space-y-4">
          <div className="w-full p-4 border border-gray-300 rounded-md bg-white shadow-sm">
            <LoadingSkeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-6 w-8 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <LoadingSkeleton className="h-4 w-24" />
                <LoadingSkeleton className="h-6 w-8 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-6 w-8 rounded-full" />
              </div>
            </div>
          </div>
          <div className="w-full p-4 border border-gray-300 rounded-md bg-white shadow-sm">
            <LoadingSkeleton className="h-6 w-28 mb-4" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LoadingSkeleton className="h-4 w-4" />
                <LoadingSkeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <LoadingSkeleton className="h-4 w-4" />
                <LoadingSkeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <LoadingSkeleton className="h-4 w-4" />
                <LoadingSkeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4 border rounded-md bg-white shadow-sm">
          <div className="flex py-2 px-4 border-b border-gray-300 space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} className="h-10 w-20" />
            ))}
          </div>
          <div className="p-6 space-y-4">
            <LoadingSkeleton className="h-6 w-32" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-6 w-28 mt-6" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </section>
  );

  const TabLoadingSkeleton = () => (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 border-b pb-4">
          <LoadingSkeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-5 w-48" />
            <LoadingSkeleton className="h-4 w-64" />
            <LoadingSkeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );

  const ForumPostSkeleton = () => (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-300 px-4 pt-3 rounded-lg">
          <LoadingSkeleton className="h-6 w-3/4 mb-2" />
          <LoadingSkeleton className="h-4 w-full mb-1" />
          <LoadingSkeleton className="h-4 w-full mb-1" />
          <LoadingSkeleton className="h-4 w-2/3 mb-3" />
          <div className="flex justify-between items-center py-2 border-t">
            <div className="flex gap-4">
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-20" />
            </div>
            <LoadingSkeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const EventSkeleton = () => (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 border-b pb-4">
          <LoadingSkeleton className="w-32 h-32 rounded-lg" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-6 w-3/4" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-3 w-32" />
            <LoadingSkeleton className="h-3 w-40" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = ({ icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-center">{description}</p>
    </div>
  );

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <section className="min-h-screen">
      <div className="flex w-full h-80 bg-blue-900">
        <div className="flex px-20 items-center h-full w-full">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-sm"
              />
            ) : (
              <div className="w-full h-full text-6xl font-medium flex items-center justify-center rounded-full border-4 border-blue-200 shadow-sm bg-blue-100 text-blue-600">
                {getInitial(user.name)}
              </div>
            )}
          </div>
          <div className="text-white ml-32 space-y-4 flex-1">
            <h1 className="text-3xl font-bold">{user?.name || "Loading..."}</h1>
            <p className="text-lg">
              {user?.major_name && user?.major?.faculty_name 
                ? `${user.major_name}, ${user.major.faculty_name}`
                : "Major information not available"}
            </p>
            <p className="flex items-center gap-2">
              <IoLocation />
              Malaysia
            </p>
            <p className="flex items-center gap-2">
              <MdWork />
              {user?.job_title && user?.company 
                ? `${user.company}, ${user.job_title}`
                : "Work information not available"}
            </p>
          </div>
          <div className="flex justify-end items-start flex-0">
            <button 
              onClick={() => handleConnect(userID)}
              className="border border-white text-white px-4 py-2 rounded-md ml-auto hover:bg-white hover:text-blue-900 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className="flex px-20 pt-10 pb-20 gap-4">
        <div className="w-1/4">
          <div className="w-full p-4 border border-gray-300 space-y-2 rounded-md bg-white shadow-sm">
            <h1 className="font-bold text-xl">Profile Stats</h1>
            <div className="flex w-full justify-between">
              <p>Connections</p>
              <button className="rounded-full text-xs px-3 py-1 text-white bg-denim">
                {user?.connections_count ?? connections.length}
              </button>
            </div>
            <div className="flex w-full justify-between">
              <p>Events Organized</p>
              <button className="rounded-full text-xs px-3 py-1 text-white bg-denim">
                {user?.events_count ?? events.length}
              </button>
            </div>
            <div className="flex w-full justify-between">
              <p>Forum Posts</p>
              <button className="rounded-full text-xs px-3 py-1 text-white bg-denim">
                {user?.discussions_count ?? forum.length}
              </button>
            </div>
          </div>

          <div className="w-full p-4 border border-gray-300 space-y-3 mt-4 rounded-md bg-white shadow-sm">
            <h1 className="font-bold text-xl">Contact Info</h1>
            <p className="flex items-center gap-3">
              <MdEmail />
              <span className="text-sm">{user?.email || "Not provided"}</span>
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt />
              <span className="text-sm">{user?.phone_number || "Not provided"}</span>
            </p>
            <p className="flex items-center gap-3">
              <BsLinkedin />
              <a href="#" className="text-sm text-blue-600 hover:underline">
                {user?.linkedin_url ? "LinkedIn Profile" : "Not provided"}
              </a>
            </p>
          </div>
        </div>

        <div className="w-3/4 border rounded-md bg-white shadow-sm">
          <div className="flex py-2 px-4 border-b border-gray-300 space-x-2">
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === "about" ? "bg-denim text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === "connections" ? "bg-denim text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("connections")}
            >
              Connections
            </button>
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === "events" ? "bg-denim text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === "forum" ? "bg-denim text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("forum")}
            >
              Forum Posts
            </button>
          </div>

          {activeTab === "about" && (
            <div className="p-6">
              <h1 className="font-bold text-xl">Biography</h1>
              <p className="mt-2 text-gray-700">
                {user?.biography || `I'm a ${user?.major_name || "university"} graduate with a passion for ${user?.major?.faculty_name || "my field"}. Currently working as a ${user?.job_title || "professional"} and always looking to connect with fellow alumni and share experiences.`}
              </p>
              
              <h1 className="font-bold text-xl mt-6">Education</h1>
              <div className="mt-2">
                <h2 className="font-medium text-lg">
                  {user?.major_name ? `Bachelor's in ${user.major_name}` : "Bachelor's Degree"}
                </h2>
                <p className="text-gray-500">
                  {user?.major?.faculty_name || "University of Technology, Malaysia"}
                </p>
                {user?.graduation_year && (
                  <p className="text-gray-500">Graduated: {user.graduation_year}</p>
                )}
              </div>

              <h1 className="font-bold text-xl mt-6">Work Experience</h1>
              <div className="mt-2">
                <h2 className="font-medium text-lg">
                  {user?.job_title || "Professional"}
                </h2>
                <p className="text-gray-600">
                  {user?.company || "Current Company"} • Present
                </p>
                <p className="text-gray-500 mt-1">
                  Working in {user?.major?.faculty_name || "my field of expertise"} with focus on professional development and industry best practices.
                </p>
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-xl">Connections</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search connections…"
                    value={searchTerm}
                    onChange={(e) => handleConnectionSearch(e.target.value)}
                    className="py-2 px-5 pr-12 border rounded-md shadow-sm w-[200px] sm:w-[320px] lg:w-[420px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {tabLoading ? (
                <TabLoadingSkeleton />
              ) : filteredConnections.length === 0 ? (
                <EmptyState 
                  icon="👥"
                  title={searchTerm ? "No matching connections" : "No connections yet"}
                  description={searchTerm ? "Try a different search term" : "Start connecting with fellow alumni to build your professional network."}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredConnections.map((connection) => (
                    <div
                      key={connection.id}
                       onClick={() =>
                          navigate("/viewProfile", { state: { userInfo: connection.id } })
                        }
                      className="cursor-pointer flex items-center gap-4 border-b pb-4 w-full hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        {connection.image ? (
                          <img
                            src={connection.image}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-2 border-blue-200"
                          />
                        ) : (
                          <div className="w-full h-full text-xl font-medium flex items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100 text-blue-600">
                            {getInitial(connection.name)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-lg font-bold">{connection.name}</h1>
                        <p className="text-gray-600">
                          {connection.major_name && connection.faculty 
                            ? `${connection.major_name}, ${connection.faculty}`
                            : "Alumni"}
                        </p>
                        {connection.job_title && connection.company && (
                          <p className="text-sm text-gray-500">
                            {connection.job_title} at {connection.company}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end items-start flex-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleConnect(connection.id)}}
                          className="border border-denim text-denim px-4 py-1 rounded-md ml-auto hover:bg-white hover:text-blue-900 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-xl">Events</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => handleEventSearch(e.target.value)}
                    className="py-2 px-5 pr-12 border rounded-md shadow-sm w-[200px] sm:w-[320px] lg:w-[420px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {tabLoading ? (
                <EventSkeleton />
              ) : filteredEvents.length === 0 ? (
                <EmptyState 
                  icon="📅"
                  title={searchTerm ? "No matching events" : "No events organized"}
                  description={searchTerm ? "Try a different search term" : "You haven't organized any events yet. Create your first event to bring alumni together."}
                />
              ) : (
                <div className="flex flex-col gap-6">
  {filteredEvents.map((event) => (
    <div
      key={event.id}
      className="flex gap-6 border rounded-lg p-4 w-full hover:shadow-md transition-all cursor-pointer"
    >
      {/* Event Image */}
      <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={event.photo || fallbackImage}
          alt={event.event_title}
          className="w-full h-full object-cover"
        />
      </div>
    
      {/* Event Details */}
      <div className="flex-1 flex flex-col">
        <div 
          onClick={() => navigate("/viewEventDetails", { state: { event } })}
          className="flex-1"
        >
          <h1 className="text-xl font-bold mb-1 text-gray-800">{event.event_title}</h1>
          <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
          
          <div className="flex justify-between">
            <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                  <LuCalendarDays className="text-denim w-4 h-4" />
                  <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GrLocationPin className="text-denim w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-denim w-4 h-4" />
                  <span>{event.attendeeCount} attendees</span>
                </div>
                <div className="flex items-center gap-2">
                  <GoGoal className="text-denim w-4 h-4" />
                  <span>{event.event_mode === 'physical' ? 'In-person' : 'Virtual'}</span>
                </div>
            </div>
            {/* Register Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); handleRegister(event.id)}}
                className="bg-white border-denim h-10 items-center flex mt-auto border hover:bg-denim-dark text-denim px-4 py-1 rounded-md transition-colors"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
              )}
            </div>
          )}

          {activeTab === "forum" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-xl">Forum</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search discussion post"
                    value={searchTerm}
                    onChange={(e) => handleForumSearch(e.target.value)}
                    className="py-2 px-5 pr-12 border rounded-md shadow-sm w-[200px] sm:w-[320px] lg:w-[420px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {tabLoading ? (
                <ForumPostSkeleton />
              ) : filteredForum.length === 0 ? (
                <EmptyState 
                  icon="💬"
                  title={searchTerm ? "No matching posts" : "No forum posts yet"}
                  description={searchTerm ? "Try a different search term" : "Share your thoughts and experiences with the community by creating your first forum post."}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredForum.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-300 px-4 pt-3 rounded-lg w-full hover:shadow-md transition-shadow"
                    >
                      <h1 className="text-lg font-bold mb-2">{post.subject}</h1>
                      <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                       {post.photo && (
                                <div className="mt-3 mb-5 group">
                                  <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img 
                                      src={post.photo} 
                                      alt="Post content" 
                                      className="w-full h-auto max-h-96 object-cover cursor-pointer"
                                    />
                                  </div>
                                </div>
                        )}
                      <div className="flex gap-2 py-2 border-t items-center justify-between">
                        <div className="flex gap-4">
                          <p className="flex items-center text-sm gap-2 text-gray-600">
                            <FaRegHeart size={16} />
                            {post.likes_count || 0} likes
                          </p>
                          <p className="flex items-center text-sm gap-2 text-gray-600">
                            <FaRegComment size={16} />
                            {post.comments_count || 0} comments
                          </p>
                        </div>
                        <button 
                          onClick={() => navigate("/forumMainPage", { 
                            state: { user, post, showPostDetails: true } 
                          })}
                          className="text-sm border-blue-500 border px-4 py-1 rounded text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          View Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        toastClassName="bg-white shadow-md rounded text-black flex w-auto px-4 py-6 min-w-[400px]"
      />
    </section>
  );
}