import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { BiExport, BiSortAlt2 } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ViewEventA from "./ViewEvent";

export default function EventTable() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectEvent, setSelectEvent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "", order: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const [showEvent, setShowEvent] = useState(false);
  const [selectEventId, setSelectEventId] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const token = Cookies.get("adminToken");
  const printRef = useRef();
  const itemsPerPage = 10;

  // Extract fetchEvent function so it can be reused
  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/api/view_all_events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error Response:", error.response);
      navigate("/403");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvent();
  }, [token, navigate]);

  const handleDeleteEvent = async (EventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/cancel_event/${EventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Event deleted successfully");
      
      // Refetch data instead of manually removing from list
      await fetchEvent();
      
      // Clear selection for the deleted event
      setSelectEvent((prev) => prev.filter((id) => id !== EventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to cancel event");
    }
  };

  const handleViewEvent = (event) => {
    setSelectEventId(event);
    setShowEvent(true);
  };

  const handleSelectAll = (isChecked) => {
    setSelectEvent(isChecked ? displayEvent.map((u) => u.id) : []);
  };

  const handleSelectOne = (id, isChecked) => {
    setSelectEvent((prev) =>
      isChecked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSort = (key) => {
    setSortCriteria((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExport = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    if (sortedEvent.length === 0) {
      toast.info("No events to export.");
      return;
    }

    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    pdf.setFontSize(18);
    pdf.text("Event Report", 40, 40);
    pdf.setFontSize(12);

    const headers = [["ID", "Title", "Host", "Location", "Status", "Created At"]];
    const data = sortedEvent.map((event) => [
      event.id,
      event.event_title,
      event.host_name,
      event.location,
      event.status,
      new Date(event.created_at).toLocaleDateString(),
    ]);

    autoTable(pdf, {
      head: headers,
      body: data,
      startY: 60,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [21, 96, 189], textColor: [255, 255, 255], halign: "center" },
      margin: { top: 60 },
    });

    const generatedAt = new Date().toLocaleString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${generatedAt}`, 40, pdf.internal.pageSize.getHeight() - 30);
    pdf.save("event_report.pdf");
  };

  const filteredEvent = events.filter((event) =>
    event.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.host_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Improved sorting function
  const sortedEvent = [...filteredEvent].sort((a, b) => {
    if (!sortCriteria.key) return 0;
    
    let aVal = a[sortCriteria.key];
    let bVal = b[sortCriteria.key];
    
    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortCriteria.order === "asc" ? 1 : -1;
    if (bVal == null) return sortCriteria.order === "asc" ? -1 : 1;
    
    // Handle date sorting for created_at
    if (sortCriteria.key === "created_at") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    // Handle numeric sorting for id
    if (sortCriteria.key === "id") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    
    // Handle string sorting (case insensitive)
    if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    // Compare values
    if (aVal < bVal) return sortCriteria.order === "asc" ? -1 : 1;
    if (aVal > bVal) return sortCriteria.order === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedEvent.length / itemsPerPage);
  const displayEvent = sortedEvent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center pb-4">
        <p className="font-bold text-xl">Event Management Table</p>
        <div className="flex h-9 gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-[300px] h-9 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-md text-sm"
            />
            <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
          </div>
          <button className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
            <MdDeleteOutline size={16} /> Delete
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
            <BiExport size={16} /> Export
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-t-md shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2 text-center rounded-tl-md">
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={displayEvent.length > 0 && displayEvent.every((u) => selectEvent.includes(u.id))}
              />
            </th>
            {["id", "event_title", "host_name", "location", "created_at", "status", "Action"].map((key) => (
              <th
                key={key}
                className={`p-2 border-b text-left cursor-pointer ${key === "Action" ? "rounded-tr-md cursor-default" : ""}`}
                onClick={() => key !== "Action" && handleSort(key)}
              >
                <p className="flex items-center gap-2 capitalize">
                  {key.replace("_", " ")} 
                  {key !== "Action" && (
                    <BiSortAlt2 
                      size={20} 
                      className={sortCriteria.key === key ? 
                        (sortCriteria.order === "asc" ? "text-blue-600" : "text-blue-600 rotate-180") : 
                        "text-gray-400"
                      }
                    />
                  )}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: itemsPerPage }, (_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-2 py-3 text-left">
                      <Skeleton height={10} width="80%" />
                    </td>
                  ))}
                </tr>
              ))
            : displayEvent.map((event) => (
                <tr key={event.id} className="border-b-2 border-gray-100 hover:bg-gray-50">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectEvent.includes(event.id)}
                      onChange={(e) => handleSelectOne(event.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-2 py-3 text-left"><button onClick={() => handleViewEvent(event)}>{event.id}</button></td>
                  <td className="px-2 py-3 text-left">{event.event_title}</td>
                  <td className="px-2 py-3 text-left">{event.host_name}</td>
                  <td className="px-2 py-3 text-left">{event.location}</td>
                  <td className="px-2 py-3 text-left">{new Date(event.created_at).toLocaleDateString()}</td>
                  <td className="px-2 py-3 text-left">
                    {event.status === "upcoming" ? (
                      <span className="text-green-600 bg-green-50 px-2 rounded-md text-sm">{event.status}</span>
                    ) : (
                      <span className="text-red-500 bg-red-50 px-2 rounded-md text-sm">{event.status}</span>
                    )}
                  </td>
                  <td className="flex px-2 pt-3 gap-2">
                    <button onClick={() => handleViewEvent(event)} className="p-1 rounded border border-gray-300 shadow">
                      <FiEdit3 />
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="p-1 rounded border border-gray-300 shadow">
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center bg-white rounded-b-md shadow px-4 py-2">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedEvent.length)} of {sortedEvent.length}
        </p>
        <div className="flex items-center space-x-2">
          <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50">Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleChangePage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm border ${currentPage === i + 1 ? "bg-[#1560bd] text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      </div>

      {showEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-4">
          <div className="bg-[#F8FAFC] rounded-lg p-6 w-[50%]" style={{ height: `${window.innerHeight - 30}px` }}>
            <ViewEventA onClose={() => setShowEvent(false)} event={selectEventId} />
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} toastClassName={() => `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`} />
    </div>
  );
}