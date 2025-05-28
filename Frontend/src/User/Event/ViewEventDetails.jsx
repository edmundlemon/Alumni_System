import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import MMULOGO from '../../assets/MMULOGO.png';
import { useState, useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaShare, FaCopy, FaUser, FaStar } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoTimeOutline } from "react-icons/io5";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { IoReturnUpBackSharp } from "react-icons/io5";

export default function ViewEventDetails() {
    const { state } = useLocation();
    const event = state?.event;
    const eventUrl = window.location.href;
    const value = window.location.href;
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [status, setStatus] = useState(event?.status || "upcoming");
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    // Mock feedback data - replace with actual API calls
    useEffect(() => {
        if (event?.id) {
            // Fetch feedback for this event from API
            const mockFeedbacks = [
                {
                    id: 1,
                    user: "John Doe",
                    rating: 4,
                    comment: "Great event! Learned a lot.",
                    date: "2023-05-15"
                },
                {
                    id: 2,
                    user: "Jane Smith",
                    rating: 5,
                    comment: "Excellent organization and content.",
                    date: "2023-05-16"
                }
            ];
            setFeedbacks(mockFeedbacks);
        }
    }, [event]);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!feedback || rating === 0) return;

        // In a real app, you would submit this to your API
        const newFeedback = {
            id: feedbacks.length + 1,
            user: "Current User", // Replace with actual user name
            rating,
            comment: feedback,
            date: new Date().toISOString().split('T')[0]
        };

        setFeedbacks([...feedbacks, newFeedback]);
        setFeedback("");
        setRating(0);
        setShowFeedbackForm(false);
    };

    if (!event) return <div className="text-center py-10 text-gray-600">No event found</div>;

    return (
        <section className="px-20 py-5 bg-gray-50 min-h-screen">
            <button 
                className="flex items-center rounded p-2 text-white bg-denim font-medium mb-4 gap-2 text-sm" 
                onClick={() => window.history.back()}
            >
                <IoReturnUpBackSharp size={18} />
                Back to Events
            </button>

            {status === "upcoming" ? (
                <div className="rounded p-7 border shadow-lg bg-white">
                <h1 className="font-semibold text-3xl mb-2 mt-[-10px]">{event.title}</h1>
                <hr className="mb-6 border-gray-200" />
            <div className="flex w-full justify-between">
                {/* left Column Image and event details */}
                <div className="w-[800px] ">
                    <div className="relative w-[830px]">
                            <img
                                className="w-full h-[390px] object-cover rounded shadow-sm"
                                src={event.image}
                                alt={event.title}
                            />
                            <div className=" rounded-sm absolute translate-y-20 bottom-0 left-4 bg-denim text-white px-4 py-2 text-center w-[80px]">
                            <p className="text-xs font-semibold">
                                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                            </p>
                            <p className="text-3xl font-bold leading-tight">
                                {new Date(event.date).getDate()}
                            </p>
                            <p className="text-[10px] font-semibold mt-1 leading-tight">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} {new Date(event.date).getFullYear()}
                            </p>
                        </div>
                    </div>
                    <div className="text-base text-gray-700 space-y-2 ml-28 my-3">
                            <div className="flex items-center gap-2 mt-4">
                                <MdOutlineAccessTime size={20} className="text-denim"/>
                                <span className="font-medium text-denim"> {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdOutlineLocationOn size={20} className="text-denim"/>
                                <span className="font-medium">{event.location} | {event.type}</span> 
                            </div>
                        </div>
                     <div className="lg:col-span-2 p-4">
                        
                            <div className="space-y-6">
                                <div className="border-t">
                                    <h2 className="mt-4 text-xl font-semibold mb-3">About This Event</h2>
                                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <LuCalendarDays className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-medium">
                                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MdOutlineAccessTime className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Time</p>
                                                <p className="font-medium">{event.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <GrLocationPin className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-medium">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <BiCategory className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Event Type</p>
                                                <p className="font-medium capitalize">{event.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                
                <div className=" flex flex-col items-center w-[450px]">
                    {/* Right Column - Action Panel */}
                    <div className="space-y-6 w-full">
                        {/* Countdown Timer */}
                        {timeLeft && (
                            <div className="w-full bg-denim/10 p-5 rounded">
                                <h3 className="text-lg font-semibold text-center text-denim mb-4">Event Starts In</h3>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                        <p className="text-2xl font-bold text-denim">{timeLeft.days}</p>
                                        <p className="text-xs text-gray-600">Days</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                        <p className="text-2xl font-bold text-denim">{timeLeft.hours}</p>
                                        <p className="text-xs text-gray-600">Hours</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                        <p className="text-2xl font-bold text-denim">{timeLeft.minutes}</p>
                                        <p className="text-xs text-gray-600">Minutes</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                        <p className="text-2xl font-bold text-denim">{timeLeft.seconds}</p>
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
                                    <h3 className="font-semibold text-gray-800">Share Event</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Scan or share this event with friends
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={handleCopy}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                                        >
                                            <FaCopy size={10} /> {copied ? "Copied!" : "Copy Link"}
                                        </button>
                                        <button
                                            onClick={() => navigator.share?.({
                                                title: event.title,
                                                text: event.description,
                                                url: eventUrl
                                            })}
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
                                <h3 className="text-lg font-semibold mb-4">Organizer Information</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FaUser size={24} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold">{event.organiser || "Event Organizer"}</h4>
                                        <p className="text-gray-600 text-sm">Organizer</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FaUser className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Person</p>
                                            <p className="font-medium">{event.postedBy || "Organizer"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MdOutlineLocationOn className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{event.email || "organizer@example.com"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MdOutlineAccessTime className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium">{event.phone || "+1 (123) 456-7890"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <BiCategory className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-sm text-gray-500">Major</p>
                                            <p className="font-medium">{event.major || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>                   
                        {/* Register Button */}
                        <button className=" w-full bg-denim hover:bg-denim-dark text-white font-medium py-3 px-4 rounded transition duration-200 shadow-md hover:shadow-lg">
                            Register Now
                        </button>
                        
                        {/* Event Metadata */}
                        <div className="w-full text-sm text-gray-500 space-y-2">
                            <div className="flex items-center gap-2">
                                <IoTimeOutline size={14} />
                                <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IoTimeOutline size={14} />
                                <span>Last updated: {new Date(event.lastUpdated_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUser size={14} />
                                <span>Posted by: {event.postedBy || "Organizer"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            </div>         
            ) : (
                <div className="rounded p-7 border shadow-lg bg-white">
                    <h1 className="font-semibold text-3xl mb-2 mt-[-10px]">{event.title}</h1>
                    <p className="text-gray-600 mb-4">This event has ended. Share your experience!</p>
                    <hr className="mb-6 border-gray-200" />

                    <div className="flex w-full justify-between">
                        {/* Left Column - Event Details */}
                        <div className="w-[800px]">
                            <div className="relative w-[830px]">
                                <img
                                    className="w-full h-[390px] object-cover rounded shadow-sm"
                                    src={event.image}
                                    alt={event.title}
                                />
                                <div className="rounded-sm absolute translate-y-20 bottom-0 left-4 bg-denim text-white px-4 py-2 text-center w-[80px]">
                                    <p className="text-xs font-semibold">
                                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                    </p>
                                    <p className="text-3xl font-bold leading-tight">
                                        {new Date(event.date).getDate()}
                                    </p>
                                    <p className="text-[10px] font-semibold mt-1 leading-tight">
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} {new Date(event.date).getFullYear()}
                                    </p>
                                </div>
                            </div>

                            <div className="text-base text-gray-700 space-y-2 ml-28 my-3">
                                <div className="flex items-center gap-2 mt-4">
                                    <MdOutlineAccessTime size={20} className="text-denim" />
                                    <span className="font-medium text-denim"> {event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdOutlineLocationOn size={20} className="text-denim" />
                                    <span className="font-medium">{event.location} | {event.type}</span>
                                </div>
                            </div>

                            <div className="lg:col-span-2 p-4">
                                <div className="space-y-6">
                                    <div className="border-t">
                                        <h2 className="mt-4 text-xl font-semibold mb-3">Event Recap</h2>
                                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold">Feedback ({feedbacks.length})</h2>
                                            <button
                                                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                                                className="bg-denim text-white px-4 py-2 rounded hover:bg-denim-dark transition"
                                            >
                                                {showFeedbackForm ? "Cancel" : "Add Feedback"}
                                            </button>
                                        </div>

                                        {showFeedbackForm && (
                                            <div className="bg-gray-50 p-5 rounded-lg mb-6">
                                                <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                                                <form onSubmit={handleFeedbackSubmit}>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 mb-2">Your Rating</label>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    className={`cursor-pointer text-2xl ${
                                                                        (hoverRating || rating) >= star 
                                                                            ? "text-yellow-500" 
                                                                            : "text-gray-300"
                                                                    }`}
                                                                    onMouseEnter={() => setHoverRating(star)}
                                                                    onMouseLeave={() => setHoverRating(0)}
                                                                    onClick={() => setRating(star)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="feedback" className="block text-gray-700 mb-2">
                                                            Your Feedback
                                                        </label>
                                                        <textarea
                                                            id="feedback"
                                                            rows="4"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-denim"
                                                            placeholder="Share your thoughts about the event..."
                                                            value={feedback}
                                                            onChange={(e) => setFeedback(e.target.value)}
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
                                                    <div key={fb.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <FaUser className="text-gray-500" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">{fb.user}</h4>
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
                                                                {new Date(fb.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="mt-3 text-gray-700">{fb.comment}</p>
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
                                            <h3 className="font-semibold text-gray-800">Share Event</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Scan or share this event with friends
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={handleCopy}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center gap-1"
                                                >
                                                    <FaCopy size={10} /> {copied ? "Copied!" : "Copy Link"}
                                                </button>
                                                <button
                                                    onClick={() => navigator.share?.({
                                                        title: event.title,
                                                        text: event.description,
                                                        url: eventUrl
                                                    })}
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
                                    <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-start gap-3">
                                            <LuCalendarDays className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-medium">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MdOutlineAccessTime className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Time</p>
                                                <p className="font-medium">{event.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <GrLocationPin className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-medium">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <BiCategory className="text-denim mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Event Type</p>
                                                <p className="font-medium capitalize">{event.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Organizer Information */}
                                <div className="bg-white border border-gray-200 p-5 rounded shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Organizer Information</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                            <FaUser size={24} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold">{event.organiser || "Event Organizer"}</h4>
                                            <p className="text-gray-600 text-sm">Organizer</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <FaUser className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                            <div>
                                                <p className="text-sm text-gray-500">Contact Person</p>
                                                <p className="font-medium">{event.postedBy || "Organizer"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MdOutlineLocationOn className="text-denim mt-0.5 flex-shrink-0" size={16} />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{event.email || "organizer@example.com"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}