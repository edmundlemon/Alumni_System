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
import { FiEdit3 } from "react-icons/fi";
import AddDonation from "./AddDonation";
import EditDonation from "./EditDonation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineStop } from "react-icons/ai";

export default function DonationTable() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [selectDonation, setSelectDonation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "created_at", order: "desc" });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const printRef = useRef();
  const token = Cookies.get("adminToken");
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [showEditDonation, setShowEditDonation] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const viewportHeight = window.innerHeight;
  const [successAdd, setSuccessAdd] = useState(false);

  // Table headers configuration
  const tableHeaders = [
    { key: "id", label: "ID", sortable: true },
    { key: "admin_id", label: "Admin ID", sortable: true },
    { key: "donation_title", label: "Donation Title", sortable: true },
    { key: "current_amount", label: "Raise", sortable: true },
    { key: "target_amount", label: "Target", sortable: true },
    { key: "created_at", label: "Created At", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "action", label: "Action", sortable: false }
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/view_all_donation_posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations(response.data.donation_posts);
        console.log(response.data.donation_posts);
      } catch (error) {
        console.error("Error fetching donations:", error);
        navigate("/403");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDonations();
    } else {
      navigate("/403");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (successAdd) {
      RefreshPage();
      setSuccessAdd(false); 
    }
  }, [successAdd]);

  const handleDeleteDonation = async (DoantionId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cancel_donation_post/${DoantionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Event deleted successfully");
      toast.success("User deleted successfully");
      RefreshPage();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to cancel event");
    }
  };

  const handleDeleteSelectedDonation = async () => {
    if (selectDonation.length === 0) return;

    try {
      await Promise.all(
        selectDonation.map((donationId) =>
          axios.delete(
            `http://localhost:8000/api/cancel_donation_post/${donationId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      RefreshPage();
      setSelectDonation([]);
      toast.success("Selected donations deleted successfully");
    } catch (error) {
      console.error("Error deleting selected donations:", error);
      toast.error("Failed to delete selected donations");
    }
  };

  const RefreshPage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/view_all_donation_posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonations(response.data.donation_posts);
      console.log(response.data.donation_posts);
    } catch (error) {
      console.error("Error fetching donations:", error);
      navigate("/403");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDonation = (donation) => {
    setSelectedDonationId(donation);
    setShowEditDonation(true);
  };

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donation_title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      donation.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced sorting function
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (!sortCriteria.key) return 0;

    const aValue = a[sortCriteria.key];
    const bValue = b[sortCriteria.key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortCriteria.order === "asc" ? 1 : -1;
    if (bValue == null) return sortCriteria.order === "asc" ? -1 : 1;

    // Handle different data types
    let comparison = 0;

    switch (sortCriteria.key) {
      case "id":
      case "admin_id":
      case "current_amount":
      case "target_amount":
        // Numeric comparison
        comparison = Number(aValue) - Number(bValue);
        break;
      
      case "created_at":
        // Date comparison
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        break;
      
      case "donation_title":
      case "status":
        // String comparison (case-insensitive)
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
        break;
      
      default:
        // Default string comparison
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
    }

    return sortCriteria.order === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const displayDonations = sortedDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (isChecked) => {
    setSelectDonation(isChecked ? displayDonations.map((d) => d.id) : []);
  };

  const handleSelectOne = (id, isChecked) => {
    setSelectDonation((prev) =>
      isChecked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  // Updated handleSort function
  const handleSort = (key) => {
    // Don't sort if key is not sortable
    const header = tableHeaders.find(h => h.key === key);
    if (!header || !header.sortable) return;

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

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    pdf.setFontSize(18);
    pdf.text("Donations Report", 40, 40);
    pdf.setFontSize(12);
    pdf.setTextColor(100);

    const headers = [["ID", "Admin ID", "Title", "Raised", "Target", "Status", "Created At"]];

    const data = donations.map((donation) => [
      donation.id,
      donation.admin_id,
      donation.donation_title,
      `RM ${donation.current_amount.toFixed(2)}`,
      `RM ${donation.target_amount.toFixed(2)}`,
      donation.status === "completed" ? "Closed" : donation.status,
      new Date(donation.created_at).toLocaleDateString(),
    ]);

    autoTable(pdf, {
      head: headers,
      body: data,
      startY: 60,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: {
        fillColor: [21, 96, 189],
        textColor: [255, 255, 255],
        halign: "center",
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });

    const dateStr = new Date().toLocaleString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${dateStr}`, 40, pdf.internal.pageSize.getHeight() - 30);

    pdf.save("donations_report.pdf");
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
        <p className="font-bold text-xl">Donation Management Table</p>
        <div className="flex h-9 gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donations..."
              className="w-[300px] h-9 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-md text-sm"
            />
            <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
          </div>
          <button 
            onClick={handleDeleteSelectedDonation}
            className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
            <AiOutlineStop size={16} />
            Cancel
          </button>
          <button
            className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs"
            onClick={handleExport}
          >
            <BiExport size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAddDonation(!showAddDonation)}
            className="flex items-center gap-1 bg-[#1560bd] text-white px-6 py-2 rounded text-xs"
          >
            <FaPlus size={10} />
            <span>Add Donation</span>
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
                    displayDonations.length > 0 &&
                    displayDonations.every((d) => selectDonation.includes(d.id))
                  }
                />
              </th>
              {tableHeaders.map((header, index) => (
                <th
                  key={header.key}
                  className={`p-2 border-b text-left ${
                    header.sortable ? "cursor-pointer" : ""
                  } ${
                    index === tableHeaders.length - 1 ? "rounded-tr-md" : ""
                  }`}
                  onClick={() => header.sortable && handleSort(header.key)}
                >
                  <p className="flex items-center gap-2 capitalize">
                    {header.label}
                    {header.sortable && (
                      <BiSortAlt2 
                        size={20} 
                        className={
                          sortCriteria.key === header.key 
                            ? sortCriteria.order === "asc" 
                              ? "text-blue-600 transform rotate-180" 
                              : "text-blue-600"
                            : "text-gray-400"
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
                    <td className="p-2 text-center">
                      <Skeleton circle height={16} width={16} />
                    </td>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-2 py-3 text-left">
                        <Skeleton height={10} width="80%" />
                      </td>
                    ))}
                  </tr>
                ))
              : displayDonations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="border-b-2 border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectOne(donation.id, e.target.checked)
                        }
                        checked={selectDonation.includes(donation.id)}
                      />
                    </td>
                    <td className="px-2 py-3 text-left">{donation.id}</td>
                    <td className="px-2 py-3 text-left">{donation.admin_id}</td>
                    <td className="px-2 py-3 text-left">
                      {donation.donation_title}
                    </td>
                    <td className="px-2 py-3 text-left">
                      RM {Number(donation.current_amount).toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-left">
                      RM {Number(donation.target_amount).toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-left">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3 text-left">
                      {donation.status === "completed" ? (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm">
                          {donation.status}
                        </span>
                      ) : donation.status === "cancelled" ? (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm">
                          {donation.status}
                        </span>
                      ) : (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">
                          {donation.status}
                        </span>
                      )}
                    </td>
                    <td className="flex px-2 pt-3 gap-2">
                      <button
                        className="p-1 rounded border border-gray-300 shadow hover:bg-gray-50"
                        onClick={() => handleViewDonation(donation)}
                      >
                        <FiEdit3 />
                      </button>
                      <button 
                        onClick={() => handleDeleteDonation(donation.id)}
                        className="p-1 rounded border border-gray-300 shadow hover:bg-gray-50">
                        <AiOutlineStop />
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
          {Math.min(currentPage * itemsPerPage, sortedDonations.length)} of{" "}
          {sortedDonations.length}
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
              key={i + 1}
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

      {showAddDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-4">
          <div
            className="bg-[#F8FAFC] rounded-lg p-6 w-[50%]"
            style={{ height: `${viewportHeight - 30}px` }}
          >
            <AddDonation 
              onClose={() => {setShowAddDonation(false)}} 
              passMessage={() => {setSuccessAdd(true)}} 
            />
          </div>
        </div>
      )}
      
      {showEditDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-4">
          <div
            className="bg-[#F8FAFC] rounded-lg p-6 w-[50%]"
            style={{ height: `${viewportHeight - 30}px` }}
          >
            <EditDonation
              onClose={() => setShowEditDonation(false)}
              donation={selectedDonationId}
              passMessage={() => {setSuccessAdd(true)}}
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