import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import MMULOGO from "../../assets/MMULOGO.png";
import { useState, useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaShare, FaCopy, FaUser, FaStar } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoTimeOutline } from "react-icons/io5";
import { IoReturnUpBackSharp } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fallbackImage from '../../assets/fallback-image.jpg';

// Skeleton Loading Components
const SkeletonText = ({ width = "100%", height = "1rem", className = "" }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ width, height }}
  ></div>
);

const SkeletonImage = ({ className = "" }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
  ></div>
);

const SkeletonAvatar = ({ size = "2.5rem" }) => (
  <div
    className="bg-gray-200 rounded-full animate-pulse"
    style={{ width: size, height: size }}
  ></div>
);

const EventDetailsSkeleton = () => (
  <section className=" bg-gray-50 min-h-screen">

    <div className="rounded p-7 border shadow-lg bg-white">
      {/* Event Title */}
      <div className="mb-6">
        <SkeletonText width="70%" height="2rem" className="mb-2" />
        <SkeletonText width="30%" height="1rem" />
      </div>
      <hr className="mb-6 border-gray-200" />

      <div className="flex w-full justify-between">
        {/* Left Column */}
        <div className="w-[800px]">
          {/* Event Image */}
          <div className="relative w-[830px] mb-6">
            <SkeletonImage className="w-full h-[390px]" />
            <div className="absolute bottom-0 left-4 w-20 h-20 bg-gray-200 rounded-sm animate-pulse"></div>
          </div>

          {/* Event Time/Location */}
          <div className="space-y-2 ml-28 my-3">
            <div className="flex items-center gap-2">
              <SkeletonText width="1.25rem" height="1.25rem" />
              <SkeletonText width="8rem" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonText width="1.25rem" height="1.25rem" />
              <SkeletonText width="12rem" />
            </div>
          </div>

          {/* Event Description */}
          <div className="lg:col-span-2 p-4 space-y-6">
            <div>
              <SkeletonText width="40%" height="1.5rem" className="mb-3" />
              <div className="space-y-2">
                <SkeletonText width="100%" />
                <SkeletonText width="90%" />
                <SkeletonText width="95%" />
                <SkeletonText width="85%" />
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <SkeletonText width="40%" height="1.5rem" className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <SkeletonText width="1.25rem" height="1.25rem" />
                    <div>
                      <SkeletonText width="5rem" height="0.875rem" className="mb-1" />
                      <SkeletonText width="10rem" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-[450px]">
          <div className="space-y-6 w-full">
            {/* Countdown Timer */}
            <div className="w-full bg-gray-200 p-5 rounded animate-pulse">
              <SkeletonText width="60%" height="1.25rem" className="mx-auto mb-4" />
              <div className="grid grid-cols-4 gap-2 text-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-3 rounded-md shadow-sm">
                    <SkeletonText width="2rem" height="2rem" className="mx-auto mb-1" />
                    <SkeletonText width="3rem" height="0.75rem" className="mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="w-full bg-white border border-gray-200 p-5 rounded shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <SkeletonImage className="w-[100px] h-[100px]" />
                </div>
                <div className="flex-1">
                  <SkeletonText width="60%" height="1rem" className="mb-2" />
                  <SkeletonText width="90%" height="0.75rem" className="mb-3" />
                  <div className="flex gap-2">
                    <SkeletonText width="5rem" height="1.75rem" className="rounded-full" />
                    <SkeletonText width="4rem" height="1.75rem" className="rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm">
              <SkeletonText width="60%" height="1.5rem" className="mb-4" />
              <div className="flex items-center gap-4 mb-4">
                <SkeletonAvatar size="4rem" />
                <div>
                  <SkeletonText width="8rem" height="1.25rem" className="mb-1" />
                  <SkeletonText width="5rem" height="0.875rem" />
                </div>
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <SkeletonText width="1rem" height="1rem" />
                    <div>
                      <SkeletonText width="5rem" height="0.875rem" className="mb-1" />
                      <SkeletonText width="10rem" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Register Button */}
            <SkeletonText width="100%" height="3rem" className="rounded" />

            {/* Metadata */}
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <SkeletonText width="0.875rem" height="0.875rem" />
                  <SkeletonText width="12rem" height="0.875rem" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function ViewEventDetails() {
  const token = Cookies.get("token");
  const { state } = useLocation();
  const event = state?.event;
  const [isLoading, setIsLoading] = useState(true);
  const eventUrl = window.location.href;
  const value = window.location.href;
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const userID = Cookies.get("userId");
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
    const [feedBackForm, setFeedBackForm] = useState({
      rating: 1,
      comment: "",
    });
  const [jion, setJion] = useState(false);

  const handleStarClick = (star) => {
  setFeedBackForm(prev => ({
    ...prev,
    rating: star
  }));
};

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [feedbackRes, joinedRes, userRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/view_feedback/${event.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8000/api/joined_past_events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8000/api/view_all_students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      console.log(feedbackRes.data.feedbacks)
      const feedbacks = feedbackRes.data.feedbacks || [];
      const users = userRes.data || [];
      console.log(userRes.data)
      // 🔁 Attach user name to each feedback
      const feedbacksWithNames = feedbacks.map(fb => {
        const user = users.find(u => u.id === fb.user_id);
        return {
          ...fb,
          user_name: user ? user.name : "Unknown User",
        };
      });

      setFeedbacks(feedbacksWithNames);

      const hasJoined = joinedRes.data.events.some(
        (joined) => joined.event_id === event.id && joined.user_id == userID
      );

      setJion(hasJoined);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  if (token && event?.id) {
    fetchData();
  } else {
    // Still show loading even without token/event for consistency
    setTimeout(() => setIsLoading(false), 300);
  }
}, [event, token, userID]);

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/give_feedback/${event.id}`,
        {
          feedback_remarks: feedBackForm.comment,
          rating: feedBackForm.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newFeedback = response.data.feedback;

      if (newFeedback) {
        setFeedbacks((prev) => [...prev, newFeedback]); // ✅ append new item
      }

      toast.success("Feedback submitted successfully!");
      setFeedBackForm({ comment: "", rating: 0 });
      setRating(0);
      setHoverRating(0);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback.");
    }
  };


  useEffect(() => {
    if (!event || !event.event_date || !event.event_time) {
      setTimeLeft(null);
      return;
    }

    const [hours, minutes] = event.event_time.split(':');
    const eventDateTime = new Date(event.event_date);
    eventDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const updateTimeLeft = () => {
      const now = new Date();
      const diff = eventDateTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [event]);

  useEffect(() => {
    if (!event?.event_date || !event?.status) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.event_date);
    eventDate.setHours(0, 0, 0, 0);

    let computedStatus;

    if (eventDate >= today) {
      computedStatus = "upcoming";
    } else {
      computedStatus = "past";
    }
    setStatus(computedStatus);

    if (event.status === "cancelled") {
      setCancelled(true);
    }
  }, [event]);

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

  function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval > 0) {
      return `${interval} ${key}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return "just now";
}


  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = async (eventId) => {
    if (!token) {
      console.error("User not authenticated");
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
      toast.success("Successfully registered for the event!");
    } catch (error) {
      console.error("Error connecting with alumni:", error);
      toast.error(
        error.response?.data?.message || "Failed to register for the event"
      );
    }
  };

  return (
    <section className="px-20 py-5 bg-gray-50 min-h-screen">
      <button
        className="flex items-center rounded p-2 text-white bg-denim font-medium mb-4 gap-2 text-sm"
        onClick={() => window.history.back()}
      >
        <IoReturnUpBackSharp size={18} />
        Back to Events
      </button>

       {isLoading ? (
      <EventDetailsSkeleton />
    ) : !event ? (
      <div className="text-center py-10 text-gray-600">No event found</div>
    ) : (
      status === "upcoming" ? (
        <div className="rounded p-7 border shadow-lg bg-white">
          <h1 className="font-semibold text-3xl mb-2 mt-[-10px]">
            {event.event_title}
          </h1>
          <hr className="mb-6 border-gray-200" />
           
          <div className="flex w-full justify-between">
            {/* left Column Image and event details */}
            <div className="w-[800px] ">
              <div className="relative w-[830px]">
                <img
                  className="w-full h-[390px] border object-cover rounded shadow-sm"
                  src={event.photo || fallbackImage}
                  alt={event.event_title}
                />
                <div className=" rounded-sm absolute translate-y-20 bottom-0 left-4 bg-denim text-white px-4 py-2 text-center w-[80px]">
                  <p className="text-xs font-semibold">
                    {new Date(event.event_date)
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </p>
                  <p className="text-3xl font-bold leading-tight">
                    {new Date(event.event_date).getDate()}
                  </p>
                  <p className="text-[10px] font-semibold mt-1 leading-tight">
                    {new Date(event.event_date)
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}{" "}
                    {new Date(event.event_date).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="text-base text-gray-700 space-y-2 ml-28 my-3">
                <div className="flex items-center gap-2 mt-4">
                  <MdOutlineAccessTime size={20} className="text-denim" />
                  <span className="font-medium text-denim"> {formatTime(event.event_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineLocationOn size={20} className="text-denim" />
                  <span className="font-medium">
                    {event.location} | {event.event_mode}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-2 p-4">
                <div className="space-y-6">
                  <div className="border-t">
                    <h2 className="mt-4 text-xl font-semibold mb-3">
                      About This Event
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Event Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <LuCalendarDays
                          className="text-denim mt-1 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MdOutlineAccessTime
                          className="text-denim mt-1 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{formatTime(event.event_time)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <GrLocationPin
                          className="text-denim mt-1 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BiCategory
                          className="text-denim mt-1 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Event Type</p>
                          <p className="font-medium capitalize">{event.event_mode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex flex-col items-center w-[450px]">
              {/* Right Column - Action Panel */}
              {cancelled && (
                <div className="flex py-2 font-bold text-red-500 rounded bg-red-200 justify-center text-center w-full items-center mb-4">
                    <p>Event Cancelled</p>
                </div>  
              )}
              <div className="space-y-6 w-full">
                {/* Countdown Timer */}
                {timeLeft && (
                  <div className="w-full bg-denim/10 p-5 rounded">
                    <h3 className="text-lg font-semibold text-center text-denim mb-4">
                      Event Starts In
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.days}
                        </p>
                        <p className="text-xs text-gray-600">Days</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.hours}
                        </p>
                        <p className="text-xs text-gray-600">Hours</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.minutes}
                        </p>
                        <p className="text-xs text-gray-600">Minutes</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.seconds}
                        </p>
                        <p className="text-xs text-gray-600">Seconds</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code */}
                <div className="w-full bg-white border border-gray-200 p-5 rounded shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <QRCode
                        value={value}
                        size={100}
                        className="w-full h-full"
                        viewBox="0 0 256 256"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-white">
                        <img
                          src={MMULOGO}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Share Event
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Scan or share this event with friends
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                        >
                          <FaCopy size={10} />{" "}
                          {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <button
                          onClick={() =>
                            navigator.share?.({
                              title: event.event_title,
                              text: event.description,
                              url: eventUrl,
                            })
                          }
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                        >
                          <FaShare size={10} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer Information */}
                <div className="bg-white border border-gray-200 p-5 rounded shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Organizer Information
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                     {
                        event.organizer?.image ? (
                          <img 
                            src={event.organizer.image} 
                            alt={event.organizer.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full text-xl font-bold flex items-center text-blue-900 justify-center bg-blue-100 rounded-full">
                            {getInitial(event.organizer?.name || "Event Organizer")}
                          </div>
                        )   
                      }
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        {event.organizer?.name || "Event Organizer"}
                      </h4>
                      <p className="text-gray-600 text-sm">Organizer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaUser
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">
                          {event.host_name || event.organizer?.name || "Organizer"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineLocationOn
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {event.organizer?.email || "organizer@example.com"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineAccessTime
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">
                          {event.organizer?.phone || "+1 (123) 456-7890"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BiCategory
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Major</p>
                        <p className="font-medium">
                          {event.organizer?.major?.major_name || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Register Button */}
                <button
                  onClick={() => handleRegister(event.id)}
                  className=" w-full bg-denim hover:bg-denim-dark text-white font-medium py-3 px-4 rounded transition duration-200 shadow-md hover:shadow-lg"
                >
                  Register Now
                </button>

                {/* Event Metadata */}
                <div className="w-full text-sm text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <IoTimeOutline size={14} />
                    <span>
                      Created: {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoTimeOutline size={14} />
                    <span>
                      Last updated:{" "}
                      {new Date(event.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser size={14} />
                    <span>Posted by: {event.host_name || event.organizer?.name || "Organizer"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded p-7 border shadow-lg bg-white">
          <h1 className="font-semibold text-3xl mb-2 mt-[-10px]">
            {event.event_title}
          </h1>
          <p className="text-gray-600 mb-4">
            This event has ended. Share your experience!
          </p>
          <hr className="mb-6 border-gray-200" />

          <div className="flex w-full justify-between">
            {/* Left Column - Event Details */}
            <div className="w-[800px]">
              <div className="relative w-[830px]">
                <img
                  className="w-full h-[390px] object-cover rounded shadow-sm"
                  src={event.photo || fallbackImage}
                  alt={event.event_title}
                />
                <div className="rounded-sm absolute translate-y-20 bottom-0 left-4 bg-denim text-white px-4 py-2 text-center w-[80px]">
                  <p className="text-xs font-semibold">
                    {new Date(event.event_date)
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </p>
                  <p className="text-3xl font-bold leading-tight">
                    {new Date(event.event_date).getDate()}
                  </p>
                  <p className="text-[10px] font-semibold mt-1 leading-tight">
                    {new Date(event.event_date)
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}{" "}
                    {new Date(event.event_date).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="text-base text-gray-700 space-y-2 ml-28 my-3">
                <div className="flex items-center gap-2 mt-4">
                  <MdOutlineAccessTime size={20} className="text-denim" />
                  <span className="font-medium text-denim"> {formatTime(event.event_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineLocationOn size={20} className="text-denim" />
                  <span className="font-medium">
                    {event.location} | {event.event_mode}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-2 p-4">
                <div className="space-y-6">
                  <div className="border-t">
                    <h2 className="mt-4 text-xl font-semibold mb-3">
                      Event Recap
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Feedback Section */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Feedback ({feedbacks.length})
                      </h2>
                      {jion &&( 
                        <button
                        onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                        className="bg-denim text-white px-4 py-2 rounded hover:bg-denim-dark transition"
                        >
                          {showFeedbackForm ? "Cancel" : "Add Feedback"}
                        </button>)
                      }
                    </div>

                    {showFeedbackForm && (
                      <div className="bg-gray-50 p-5 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Share Your Experience
                        </h3>
                        <form onSubmit={handleAddFeedback}>
                            <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                              Your Rating
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`cursor-pointer text-2xl ${
                                    (hoverRating || feedBackForm.rating) >= star
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => handleStarClick(star)}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="feedback"
                              className="block text-gray-700 mb-2"
                            >
                              Your Feedback
                            </label>
                            <textarea
                              id="feedback"
                              rows="4"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-denim"
                              placeholder="Share your thoughts about the event..."
                              value={feedBackForm.comment}
                              onChange={(e) =>
                                setFeedBackForm({
                                  ...feedBackForm,
                                  comment: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-denim text-white px-4 py-2 rounded hover:bg-denim-dark transition"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      </div>
                    )}

                    {feedbacks.length > 0 ? (
                      <div className="space-y-4">
                        {feedbacks.map((fb) => (
                          <div
                            key={fb.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="text-gray-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{fb.user_name}</h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={`${
                                          i < fb.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {timeAgo(fb.created_at)}
                              </span>
                            </div>
                            <p className="mt-3 text-gray-700">{fb.feedback_remarks}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        No feedback yet. Be the first to share your experience!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Event Info & QR Code */}
            <div className="flex flex-col items-center w-[450px]">
              <div className="space-y-6 w-full">
                {/* Countdown Timer */}
                {cancelled && (
                  <div className="flex py-2 font-bold text-red-500 rounded bg-red-200 justify-center text-center w-full items-center mb-4">
                      <p>Event Cancelled</p>
                  </div>  
                )}
                {timeLeft && (
                  <div className="w-full bg-denim/10 p-5 rounded">
                    <h3 className="text-lg font-semibold text-center text-denim mb-4">
                        Event Ended
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.days}
                        </p>
                        <p className="text-xs text-gray-600">Days</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.hours}
                        </p>
                        <p className="text-xs text-gray-600">Hours</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.minutes}
                        </p>
                        <p className="text-xs text-gray-600">Minutes</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-2xl font-bold text-denim">
                          {timeLeft.seconds}
                        </p>
                        <p className="text-xs text-gray-600">Seconds</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* QR Code */}
                <div className="w-full bg-white border border-gray-200 p-5 rounded shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <QRCode
                        value={value}
                        size={100}
                        className="w-full h-full"
                        viewBox="0 0 256 256"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-white">
                        <img
                          src={MMULOGO}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Share Event
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Scan or share this event with friends
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                        >
                          <FaCopy size={10} />{" "}
                          {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <button
                          onClick={() =>
                            navigator.share?.({
                              title: event.event_title,
                              text: event.description,
                              url: eventUrl,
                            })
                          }
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                        >
                          <FaShare size={10} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Event Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-3">
                      <LuCalendarDays
                        className="text-denim mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(event.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineAccessTime
                        className="text-denim mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(event.event_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GrLocationPin
                        className="text-denim mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BiCategory
                        className="text-denim mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Event Type</p>
                        <p className="font-medium capitalize">{event.event_mode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer Information */}
                <div className="bg-white border border-gray-200 p-5 rounded shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Organizer Information
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      {
                        event.organizer?.image ? (
                          <img 
                            src={event.organizer.image} 
                            alt={event.organizer.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full text-xl font-bold flex items-center text-blue-900 justify-center bg-blue-100 rounded-full">
                            {getInitial(event.organizer?.name || "Event Organizer")}
                          </div>
                        )   
                      }
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        {event.organizer?.name || "Event Organizer"}
                      </h4>
                      <p className="text-gray-600 text-sm">Organizer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaUser
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">
                          {event.host_name || event.organizer?.name || "Organizer"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineLocationOn
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {event.organizer?.email || "organizer@example.com"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineAccessTime
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">
                          {event.organizer?.phone || "+1 (123) 456-7890"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BiCategory
                        className="text-denim mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Major</p>
                        <p className="font-medium">
                          {event.organizer?.major?.major_name || "Not specified"}
                        </p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Event Metadata */}
                <div className="w-full text-sm text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <IoTimeOutline size={14} />
                    <span>
                      Created: {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoTimeOutline size={14} />
                    <span>
                      Last updated:{" "}
                      {new Date(event.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser size={14} />
                    <span>Posted by: {event.host_name || event.organizer?.name || "Organizer"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )
      
    )}
    {/* Toast notifications container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName={(context) =>
          `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`
        }
      />
    </section>
  );
}