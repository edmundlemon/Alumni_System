import { FaTimes } from "react-icons/fa";

export default function ViewEventA({ onClose, event }) {
    console.log("Event Data:", event);
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#1560bd] scrollbar-track-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Event Info */}
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Title</h3>
          <p className="text-gray-600">{event.event_title || "N/A"}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{event.description || "N/A"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Location</h3>
            <p className="text-gray-600">{event.location || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Mode</h3>
            <p className="text-gray-600">{event.event_mode || "N/A"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Date</h3>
            <p className="text-gray-600">{event.event_date}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Time</h3>
            <p className="text-gray-600">{event.event_time}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Status</h3>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                event.status === "upcoming"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {event.status}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Registration Close Date</h3>
            <p className="text-gray-600">{event.registration_close_date}</p>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800">Organizer Information</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Name</h3>
            <p className="text-gray-600">{event.organizer?.name || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{event.organizer?.email || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Phone</h3>
            <p className="text-gray-600">{event.organizer?.phone || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Major</h3>
            <p className="text-gray-600">
              {event.organizer?.major_name} ({event.organizer?.faculty})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
