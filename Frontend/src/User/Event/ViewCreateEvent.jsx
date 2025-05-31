import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewCreateEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef();
  const popupRef = useRef();
  const token = Cookies.get("token");

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1);
    // Use local time, not UTC
    const formatted = date.toLocaleDateString("en-CA"); // 'YYYY-MM-DD'
    return {
      day: i + 1,
      date: formatted,
      events: events.filter((ev) => ev.event_date === formatted),
    };
  });
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const handleEventClick = (event, dayElement) => {
    setSelectedEvent(event);
    const rect = dayElement.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();
    const top = rect.top - calendarRect.top + rect.height + 90;
    const left = rect.left - calendarRect.left;

    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/view_my_upcoming_events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.events);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Close popup when clicking outside
  useEffect(() => {
    if (!selectedEvent) return;
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedEvent(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [selectedEvent]);

  return (
    <div
      className="px-4 sm:px-8 lg:px-20 py-8 bg-[#f7f9f9] min-h-screen"
      ref={calendarRef}
    >
      {/* Header Section */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-denim mb-1">My Created Events</h1>
          <p className="text-gray-500 text-base">
            View, manage, and create your upcoming events.
          </p>
        </div>
        <button
          onClick={() => navigate("/addEvent")}
          className="flex items-center gap-2 px-6 py-3 bg-denim text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold shadow"
        >
          <FiCalendar size={20} />
          <span>Create Event</span>
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-2 bg-denim text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <IoIosArrowRoundBack size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-800">
                  {monthNames[currentMonth]}
                </span>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="text-xl font-bold text-gray-800 bg-transparent border-none focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleNextMonth}
                className="p-2 bg-denim text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <IoIosArrowRoundForward size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "month"
                    ? "bg-white shadow text-denim"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow text-denim"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Events Content */}
        {viewMode === "month" ? (
          <div className="grid grid-cols-7 gap-4 p-6 bg-white relative">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-sm font-semibold text-center text-gray-600"
              >
                {d}
              </div>
            ))}
            {Array(new Date(currentYear, currentMonth, 1).getDay())
              .fill(null)
              .map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
            {daysArray.map(({ day, date, events }) => {
              const today = new Date();
              const isToday =
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === day;
              return (
                <div
                  key={date}
                  className="border rounded-md p-2 min-h-24 bg-gray-50 relative"
                >
                  <div className="flex items-center justify-center mb-1">
                    <p
                      className={`text-xs text-center h-7 w-7 justify-center items-center flex font-medium ${
                        isToday
                          ? "bg-denim text-white rounded-full px-2 py-0.5"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </p>
                  </div>
                  {events.slice(0, 5).map((ev, idx) => (
                    <div
                      key={ev.id}
                      className={`text-xs mt-1 rounded px-1 py-0.5 truncate cursor-pointer ${
                        ev.event_mode === "online"
                          ? "bg-blue-100 text-blue-800"
                          : ev.event_mode === "physical"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                      onClick={(e) => {
                        handleEventClick(ev, e.currentTarget.parentElement);
                      }}
                    >
                      <span>
                        {new Date(
                          `1970-01-01T${ev.event_time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>{" "}
                      {ev.event_title.slice(0, 10)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : events.length > 0 ? (
          <div className="min-h-screen">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-6 hover:bg-gray-50 transition-colors  border-b border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.event_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString(
                            "en-US",
                            { weekday: "short", month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-gray-400" />
                        <span>
                          {new Date(
                            `1970-01-01T${event.event_time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.event_mode === "online" ? (
                          <FiGlobe className="text-blue-400" />
                        ) : (
                          <FiMapPin className="text-red-400" />
                        )}
                        <span>
                          {event.event_mode === "online" ? (
                            <a
                              href={
                                event.location.startsWith("http")
                                  ? event.location
                                  : `https://${event.location}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Join Online
                            </a>
                          ) : (
                            event.location
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-gray-400" />
                        <span>
                          {event.max_participants
                            ? `${event.max_participants} participants max`
                            : "No participant limit"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        navigate("/editEvent", { state: { event } })
                      }
                      className="px-4 py-2 bg-denim text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Edit Event
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                      Cancel Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiCalendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No upcoming events
            </h3>
            <p className="mt-1 text-gray-500">
              You don't have any events scheduled for this period.
            </p>
            <button
              onClick={() => navigate("/addEvent")}
              className="mt-4 px-6 py-2 bg-denim text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Event
            </button>
          </div>
        )}
      </div>
      {/* Event Details Popup */}
      {selectedEvent && (
        <div
          className="absolute z-50 bg-white border-2  p-4 w-72"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          ref={popupRef}
        >
          <div className="flex items-start gap-2 mb-2">
            <span
              className="h-3 w-3 rounded-full mt-1"
              style={{
                backgroundColor:
                  selectedEvent.event_mode === "online"
                    ? "#cce4ff"
                    : selectedEvent.event_mode === "physical"
                    ? "#d2f8d2"
                    : "#e0d4fc",
              }}
            />
            <h4 className="font-semibold text-gray-900 text-sm">
              {selectedEvent.event_title}
            </h4>
          </div>

          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <FiClock className="text-gray-400" />
            {new Date(
              `1970-01-01T${selectedEvent.event_time}`
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            {new Date(selectedEvent.event_date).toLocaleDateString()}
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            {selectedEvent.description || "No description"}
          </div>

          <div className="mt-3 text-right">
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
