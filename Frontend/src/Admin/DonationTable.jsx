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


export default function DonationTable() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [selectDonation, setSelectDonation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "", order: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const printRef = useRef();
  const token = Cookies.get("adminToken");

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

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donation_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    const aValue = a[sortCriteria.key];
    const bValue = b[sortCriteria.key];
    if (aValue < bValue) return sortCriteria.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sortCriteria.order === "asc" ? 1 : -1;
    return 0;
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
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
          <button className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
            <MdDeleteOutline size={16} />
            Delete
          </button>
          <button
            className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs"
            onClick={handleExport}
          >
            <BiExport size={16} />
            Export
          </button>
          <button className="flex items-center gap-1 bg-[#1560bd] text-white px-6 py-2 rounded text-xs">
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
                    displayDonations.every((d) =>
                      selectDonation.includes(d.id)
                    )
                  }
                />
              </th>
              {["id", "admin_id", "donation_title", "Raise" ,"Target", "status", "created_at","Action"].map(
                (key) => (
                  <th
                    key={key}
                    className={`p-2 border-b text-left cursor-pointer ${
                      key === "Action" ? "rounded-tr-md" : ""
                    }`}
                    onClick={() => handleSort(key)}
                  >
                    <p className="flex items-center gap-2 capitalize">
                      {key.replace("_", " ")} 
                      {key !== "Action" && <BiSortAlt2 size={20} />}
                    </p>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: itemsPerPage }, (_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2 text-center">
                      <Skeleton circle height={16} width={16} />
                    </td>
                    {[...Array(6)].map((_, j) => (
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
                    <td className="px-2 py-3 text-left">{donation.donation_title}</td>
                    <td className="px-2 py-3 text-left">{donation.current_amount}</td>
                    <td className="px-2 py-3 text-left">{donation.target_amount}</td>
                    {
                      donation.status === "completed" ? (
                        <td>
                          <span className="text-red-500 bg-red-50 px-2 rounded-md text-sm">Close</span>
                        </td>
                      ) : (
                        <td >
                           <span className="text-green-600 bg-green-50 px-2 rounded-md text-sm">{donation.status}</span>
                        </td>
                      )
                    }
                    <td className="px-2 py-3 text-left">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    <td className="flex px-2 pt-3 gap-2">
                      <button className="p-1 rounded border border-gray-300 shadow" onClick={() => handleViewUser(user)}><FiEdit3 /></button>
                      <button className="p-1 rounded border border-gray-300 shadow"><MdDeleteOutline /></button>
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
    </div>
  );
}
