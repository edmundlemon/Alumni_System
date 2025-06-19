import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import event from "../../assets/event.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useMemo } from "react";
import fallbackImage from '../../assets/fallback-image.jpg';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuMoveRight } from "react-icons/lu";

export default function EventMainPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [dayTimeFilter, setDayTimeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = useMemo(() => {
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [filteredEvents, currentPage, indexOfFirstEvent, indexOfLastEvent]);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  };

  // FIXED: Changed from event.date to event.event_date
  const filterByDayTime = (event, dayTimeFilter) => {
    if (!dayTimeFilter) return true;
    const eventDate = new Date(event.event_date); // Fixed field name
    const today = new Date();

    if (dayTimeFilter === "thisWeek") {
      const startOfWeek = getStartOfWeek(today);
      const endOfWeek = getEndOfWeek(today);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }

    if (dayTimeFilter === "thisMonth") {
      return (
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/view_all_events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Events fetched:', response.data.events);
        setEvents(response.data.events || []); // Added fallback
      } catch (error) {
        console.error("Error fetching events:", error);
        console.error("Error response:", error.response?.data);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      // Reset to show filtered events based on current filters
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/search_events", {
        params: { query: searchQuery, status: activeTab },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFilteredEvents(response.data.events || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching events:", error);
      toast.error("Failed to search events");
    }
  };


  useEffect(() => {
    // If there's a search query, don't filter here (handled by search API)
    if (searchQuery.trim() !== "") {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.event_date);
      eventDate.setHours(0, 0, 0, 0);
      // FIXED: Status filtering logic
      let matchesStatus = false;
      
      if (activeTab === "upcoming") {
        // Show events that are today or in the future AND not cancelled
        matchesStatus = eventDate >= today && event.status !== "cancelled";
      } else if (activeTab === "past") {
        // Show events that are in the past AND not cancelled
        matchesStatus = eventDate < today && event.status !== "cancelled";
      } else if (activeTab === "cancelled") {
        // Show only cancelled events
        matchesStatus = event.status === "cancelled";
      }

      // FIXED: Type filtering (case insensitive)
      const matchesType =
        typeFilter === "" ||
        event.event_mode?.toLowerCase() === typeFilter.toLowerCase();

      // Day/time filtering
      const matchesDayTime = filterByDayTime(event, dayTimeFilter);

      const shouldInclude = matchesStatus && matchesType && matchesDayTime;

      return shouldInclude;
    });
    
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, activeTab, searchQuery, dayTimeFilter, typeFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 500, behavior: "smooth" });
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


  return (
    <section className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="relative w-full h-96 flex items-end"
        style={{
          backgroundImage: `url(${event})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Events</h1>
          <p className="text-xl text-white/90">Discover and join exciting events happening around you</p>
        </div>
      </div>

      <div className="px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "upcoming" ? "text-denim border-b-2 border-denim" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "past" ? "text-denim border-b-2 border-denim" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "cancelled" ? "text-denim border-b-2 border-denim" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled Events
          </button>
        </div>

        {/* Filters */}
        <div className="px-20">
          <div className="flex justify-between items-center mb-6 w-full">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab} Events</h2>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="py-3 px-5 pr-12 rounded-lg shadow-md w-[380px] focus:outline-denim"
                  value={searchQuery}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch 
                  onClick={handleSearchSubmit}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              </div>
              <div className="relative">
                <select
                  className="focus:outline-denim appearance-none py-3 w-[170px] px-4 pr-10 rounded-lg border select-none bg-white text-gray-700 shadow-md cursor-pointer hover:border-gray-400"
                  onChange={(e) => setDayTimeFilter(e.target.value)}
                  style={{ backgroundImage: "none" }}
                  value={dayTimeFilter}
                  onFocus={() => setIsDayOpen(true)}
                  onBlur={() => setIsDayOpen(false)}
                >
                  <option value="">All Days</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {isDayOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              </div>
              <div className="relative">
                <select
                  className="focus:outline-denim appearance-none w-[170px] py-3 px-4 pr-10 rounded-lg border bg-white text-gray-700 shadow-md cursor-pointer hover:border-gray-400"
                  style={{ backgroundImage: "none" }}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  value={typeFilter}
                  onFocus={() => setIsTypeOpen(true)}
                  onBlur={() => setIsTypeOpen(false)}
                >
                  <option value="">All Types</option>
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {isTypeOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              </div>
            </div>
          </div>

          {/* Events Display */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
              {Array.from({ length: eventsPerPage }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-md animate-pulse flex flex-col h-[460px]"
                >
                  <div className="bg-gray-300 h-80 w-full rounded mb-4"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {activeTab} events found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Total events: {events.length} | Filtered: {filteredEvents.length}
              </p>
              {(searchQuery || dayTimeFilter || typeFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDayTimeFilter("");
                    setTypeFilter("");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg p-4 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full max-h-[460px]"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={event.photo || fallbackImage}
                        alt={event.event_title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                      />

                      {/* Status Badge */}
                      {activeTab === "past" ? (
                        <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs">
                          Past Event
                        </div>
                      ) : event.status === "cancelled" ? (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs">
                          Cancelled
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-sm text-xs font-bold border border-gray-300">
                          <span className="block">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              day: "numeric",
                            })}
                          </span>
                          <span className="block text-[10px] mt-1">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </span>
                        </div>
                      )}

                      {/* Event Mode Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm border text-xs font-semibold shadow-sm">
                        {event.event_mode?.charAt(0).toUpperCase() + event.event_mode?.slice(1).toLowerCase()}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col h-full">
                      <div>
                        {/* Date & Time */}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>
                            {formatDate(event.event_date)} • {formatTime(event.event_time)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {event.event_title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Attendee Info */}
                      
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500 mb-3">
                            <span>{event.attendeeCount} registered</span>
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            {event.max_participants == null
                              ? <span>No participant limit</span>
                              : <span>Max participant: {event.max_participants}</span>
                            }
                          </div>
                        </div>
                      

                     {/* Buttons */}
                      <div className={`flex items-center mt-auto pt-4 -mb-4 border-t border-gray-200 ${activeTab === "upcoming" && event.status !== "cancelled" ? "justify-between" : "justify-end"}`}>
                        {activeTab === "upcoming" && event.status !== "cancelled" && (
                          <button
                            onClick={() => handleRegister(event.id)}
                            className="bg-denim hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Register Now
                          </button>
                        )}
                        <button
                          className="text-denim hover:text-blue-800 font-medium text-base flex items-center"
                          onClick={() => navigate("/viewEventDetails", { state: { event } })}
                        >
                          View Details
                          <LuMoveRight className="ml-1 text-2xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstEvent + 1} to{" "}
                    {Math.min(indexOfLastEvent, filteredEvents.length)} of{" "}
                    {filteredEvents.length} events
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaChevronLeft />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-md ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast notifications container */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        toastClassName="bg-white shadow-md rounded text-black flex w-auto px-4 py-6 min-w-[400px]"
      />
    </section>
  );
}