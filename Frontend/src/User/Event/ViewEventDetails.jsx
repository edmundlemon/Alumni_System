import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import MMULOGO from '../../assets/MMULOGO.png';
import { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";

export default function ViewEventDetails() {
    const { state } = useLocation();
    const event = state?.event;
    const value = window.location.href;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!event) return <div className="text-center py-10 text-gray-600">No event found</div>;

    return (
        <section className="px-4 py-8 md:px-20 bg-gray-50 min-h-screen">
            <div className="rounded-md p-6 border shadow-lg bg-white">
                <h1 className="font-semibold text-3xl mb-2">{event.title}</h1>
                <hr className="mb-6 border-gray-200" />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Image */}
                    <div className="w-full lg:w-[60%]">
                        <img
                            className="w-full h-[380px] object-cover rounded-md shadow-sm"
                            src={event.image}
                            alt={event.title}
                        />
                    </div>

                    {/* Right: QR Code + Details */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-6">
                        {/* QR Code */}
                        <div className="border shadow-md rounded-md p-4">
                            <div className="flex items-center gap-6">
                                <div className="relative w-[100px] h-[100px]">
                                    <QRCode
                                        value={value}
                                        size={200}
                                        className="w-full h-full"
                                        viewBox="0 0 256 256"
                                    />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25px] h-[25px] rounded-md bg-white">
                                        <img
                                            src={MMULOGO}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Scan and Share</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Scan the QR to open on mobile or copy the link below:
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-blue-600 text-sm break-words">{value}</p>
                                        <button
                                            onClick={handleCopy}
                                            className="mt-1 text-xs text-blue-500 underline hover:text-blue-700"
                                        >
                                            {copied ? "Link copied!" : "Copy link"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event Info */}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800">Event Details</h2>
                            <div className="text-sm text-gray-700 space-y-2">
                                <div className="flex items-center gap-2">
                                    <SlCalender />
                                    <span className="font-medium">Date:</span> {event.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdOutlineAccessTime />
                                    <span className="font-medium ">Time:</span> {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <GrLocationPin />
                                    <span className="font-medium">Location:</span> {event.location}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
