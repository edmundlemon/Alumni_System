import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { BiExport, BiSortAlt2 } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiEdit3 } from "react-icons/fi";
import ViewForum from "./ViewForum";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForumTable() {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [selectForum, setSelectForum] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "", order: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const printRef = useRef();
  const token = Cookies.get("adminToken");
  const viewportHeight = window.innerHeight;
  const [showForum, setShowForum] = useState(false);
  const [selectedForumID, setSelectedForumID] = useState(null);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/discussions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setForums(response.data.discussions.data);
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchForum();
    } else {
      navigate("/403");
    }
  }, [token, navigate]);

  const handleDeleteForum = async (ForumId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/delete_discussion/${ForumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Event deleted successfully");
      toast.success("Forum deleted successfully");
      setForums((prevForums) =>
        prevForums.filter((forum) => forum.id !== ForumId)
      );
      setSelectForum((prevSelect) => prevSelect.filter((id) => id !== ForumId));
    } catch (error) {
      console.error("Error deleting forum:", error);
      toast.error("Failed to delete forum");
    }
  };

  const handleDeleteSelectedForums = async () => {
    if (selectForum.length === 0) return;
    try {
      await Promise.all(
        selectForum.map((ForumId) =>
          axios.delete(
            `http://localhost:8000/api/delete_discussion/${ForumId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      setForums((prevForums) =>
        prevForums.filter((forum) => !selectForum.includes(forum.id))
      );
      setSelectForum([]);
      toast.success("Selected forums deleted successfully");
    } catch (error) {
      console.error("Error deleting selected forums:", error);
      toast.error("Failed to delete selected forums");
    }
  };

  const handleViewForum = (forum) => {
    setSelectedForumID(forum);
    setShowForum(true);
  };

  // Fixed table columns to match actual forum object properties
  const columns = [
    { key: "id", label: "Forum ID" },
    { key: "subject", label: "Title" },
    { key: "comments", label: "Comments" },
    { key: "user_id", label: "User ID" },
    { key: "created_at", label: "Created At" },
    { key: "Action", label: "Action" },
  ];

  const filteredForums = forums.filter(
    (forum) =>
      forum.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fixed sorting logic with proper handling for different data types
  const sortedForums = [...filteredForums].sort((a, b) => {
    let aVal = a[sortCriteria.key];
    let bVal = b[sortCriteria.key];

    // Handle special cases for different data types
    if (sortCriteria.key === "comments") {
      aVal = a.comments?.length || 0;
      bVal = b.comments?.length || 0;
    } else if (sortCriteria.key === "created_at") {
      aVal = new Date(a.created_at);
      bVal = new Date(b.created_at);
    } else if (sortCriteria.key === "id" || sortCriteria.key === "user_id") {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortCriteria.order === "asc" ? 1 : -1;
    if (bVal == null) return sortCriteria.order === "asc" ? -1 : 1;

    if (aVal < bVal) return sortCriteria.order === "asc" ? -1 : 1;
    if (aVal > bVal) return sortCriteria.order === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedForums.length / itemsPerPage);
  const displayForums = sortedForums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked) => {
    setSelectForum(checked ? displayForums.map((u) => u.id) : []);
  };

  const handleSelectOne = (id, checked) => {
    setSelectForum((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSort = (key) => {
    setSortCriteria((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    pdf.setFontSize(18);
    pdf.text("Forum Discussions Report", 40, 40);
    pdf.setFontSize(12);
    pdf.setTextColor(100);

    const headers = [
      ["Forum ID", "Title", "Comments", "User ID", "Created At"],
    ];
    const data = forums.map((forum) => [
      forum.id,
      forum.subject
        ? forum.subject.slice(0, 30) + (forum.subject.length > 30 ? "..." : "")
        : "",
      forum.comments?.length ?? 0,
      forum.user_id,
      forum.created_at ? new Date(forum.created_at).toLocaleDateString() : "",
    ]);

    autoTable(pdf, {
      head: headers,
      body: data,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [21, 96, 189],
        textColor: [255, 255, 255],
        halign: "center",
      },
      margin: { top: 60 },
    });

    const dateStr = new Date().toLocaleString();
    pdf.setFontSize(10);
    pdf.text(
      `Generated on: ${dateStr}`,
      40,
      pdf.internal.pageSize.getHeight() - 30
    );

    pdf.save("forums_report.pdf");
  };

  return (
    <div
      className="h-full p-4 rounded-lg bg-white"
      style={{
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-center pb-4">
        <p className="font-bold text-xl">Forum Management Table</p>
        <div className="flex h-9 gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search forum..."
              className="w-[300px] h-9 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-md text-sm"
            />
            <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button 
            onClick={handleDeleteSelectedForums}
            className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
            <MdDeleteOutline size={16} />
            Delete
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 border-2 bg-[#1560bd] text-white px-2 py-2 rounded-md text-xs"
          >
            <BiExport size={16} />
            Export
          </button>
        </div>
      </div>

      <div ref={printRef}>
        <table className="min-w-full bg-white rounded-t-md shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 text-center rounded-tl-md">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    displayForums.length > 0 &&
                    displayForums.every((u) => selectForum.includes(u.id))
                  }
                />
              </th>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`p-2 border-b text-left cursor-pointer transition-colors ${
                    index === columns.length - 1 ? "rounded-tr-md" : ""
                  } ${sortCriteria.key === col.key ? "bg-blue-100" : ""}`}
                  onClick={() => col.key !== "Action" && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2 capitalize">
                    {col.label}
                    {col.key !== "Action" && (
                      <BiSortAlt2 
                        size={20} 
                        className={`transform transition-transform ${
                          sortCriteria.key === col.key && sortCriteria.order === "desc" 
                            ? "rotate-180" 
                            : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: itemsPerPage }, (_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2 text-center">
                      <Skeleton circle height={16} width={16} />
                    </td>
                    {columns.map((_, j) => (
                      <td key={j} className="px-2 py-3 text-left">
                        <Skeleton height={10} width="80%" />
                      </td>
                    ))}
                  </tr>
                ))
              : displayForums.map((forum) => (
                  <tr
                    key={forum.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectOne(forum.id, e.target.checked)
                        }
                        checked={selectForum.includes(forum.id)}
                      />
                    </td>
                    <td className="px-2 py-3 text-left">
                      <div className="line-clamp-1">{forum.id}</div>
                    </td>
                    <td className="px-2 py-3 text-left">
                      <div className="line-clamp-1">
                        {forum.subject && forum.subject.length > 20
                          ? forum.subject.slice(0, 20) + "..."
                          : forum.subject}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-left">
                      {forum.comments?.length || 0}
                    </td>
                    <td className="px-2 py-3 text-left">{forum.user_id}</td>
                    <td className="px-2 py-3 text-left">
                      {forum.created_at
                        ? new Date(forum.created_at).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="flex px-2 pt-3 gap-2">
                      <button
                        className="p-1 rounded border border-gray-300 shadow hover:bg-gray-100"
                        onClick={() => handleViewForum(forum)}
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => handleDeleteForum(forum.id)}
                        className="p-1 rounded border border-gray-300 shadow hover:bg-gray-100"
                      >
                        <MdDeleteOutline />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center bg-white rounded-b-md shadow px-4 py-2">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedForums.length)} of{" "}
          {sortedForums.length}
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handleChangePage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm border ${
                currentPage === i + 1
                  ? "bg-[#1560bd] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {showForum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50  flex items-center justify-end p-4">
          <div
            className="bg-[#F8FAFC] rounded-lg w-[50%] "
            style={{ height: `${viewportHeight - 30}px` }}
          >
            <ViewForum
              onClose={() => setShowForum(false)}
              forum={selectedForumID}
            />
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName={(context) =>
          `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`
        }
      />
    </div>
  );
}