import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import MMULOGO from '../../assets/MMULOGO.png';
import { useState, useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import { MdOutlineLocationOn } from "react-icons/md";
import {  FaShare, FaCopy, FaUser } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoTimeOutline } from "react-icons/io5";
import { TiChevronLeft, TiChevronRight  } from "react-icons/ti";
import { IoReturnUpBackSharp } from "react-icons/io5";

export default function ViewEventDetails() {
    const { state } = useLocation();
    const event = state?.event;
    const eventUrl = window.location.href;
    const value= window.location.href;
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => (prev === 0 ? eventImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev => (prev === eventImages.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
         window.scrollTo(0, 0);
        if (!event || !event.date || !event.time) return;

        const countdownDate = new Date(`${event.date} ${event.time}`).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [event]);

    if (!event) return <div className="text-center py-10 text-gray-600">No event found</div>;

    return (
        <section className="px-20 py-5 bg-gray-50 min-h-screen">
            
            <button className="flex items-center rounded p-2 text-white bg-denim font-medium mb-4 gap-2 text-sm" onClick={() => window.history.back()}>
                <IoReturnUpBackSharp size={18}/>
                Back to Events
            </button>
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
        </section>
    );
}