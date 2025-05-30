import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function ViewCreateEvent() {
    const [events, setEvents] = useState([]);
    const token = Cookies.get("token");
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/view_my_upcoming_events", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(response.data.events);
                setEvents(response.data.events);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (token) {
            fetchEvents();
        }

    }, []);

    return(
        <div className="px-20 py-10 bg-[#f7f9f9]">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 ">
                        <button className="bg-denim px-4 py-2 rounded-md text-white text-xl font-semibold"><IoIosArrowRoundBack /></button>
                        <p className="text-xl font-semibold">December 2024</p>
                        <button className="bg-denim px-4 py-2 rounded-md text-white text-xl font-semibold"><IoIosArrowRoundForward /></button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-denim text-white rounded hover:bg-blue-700">
                            Month
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                            List
                        </button>
                    </div>
                </div>
                {
                    events.length > 0 ? (
                        <div className="mt-6">
                            {events.map((event) => (
                                <div key={event.id} className="border-b py-4">
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <p className="text-gray-600">{new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}</p>
                                    <p className="text-gray-500">{event.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-6">No upcoming events found.</p>
                    )
                }
            </div>
        </div>
    )
}