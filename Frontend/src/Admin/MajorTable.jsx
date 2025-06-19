import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { BiSortAlt2 } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Skeleton from "react-loading-skeleton";
import { FiEdit3 } from "react-icons/fi";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MajorTable() {
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [selectMajor, setSelectMajor] = useState([]);
  const [selectMajorId, setSelectMajorId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "", order: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const printRef = useRef();
  const token = Cookies.get("adminToken");
  const [showAddMajor, setShowAddMajor] = useState(false);
  const [showEditMajor, setShowEditMajor] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    major_name: "",
    faculty_id: "",
    faculty_name: "",
  });

 const facultyOptions = faculty.map((f) => ({
    value: f.id,
    label: f.faculty_name,
  }));

  useEffect(() => {
    const fetchMajor = async () => {
      try {
        console.log("Token:", token);
        const [majorRes, facultyRes] = await Promise.all([
          axios.get("http://localhost:8000/api/view_all_majors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8000/api/view_all_faculties", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        console.log(majorRes.data);
        console.log(facultyRes.data.faculties);
        setMajors(majorRes.data);
        setFaculty(facultyRes.data.faculties);
      } catch (error) {
        console.error("Error Response:", error.response);
        console.error("There was an error!", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchMajor();
    } else {
      console.error("No token found, user might not be authenticated");
      setError("User not authenticated");
      navigate("/403");
    }
  }, [token, navigate]);

  const filteredMajors = majors.filter(
    (user) =>
      user.major_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm)
  );

  const sortedMajors = [...filteredMajors].sort((a, b) => {
    const aValue = a[sortCriteria.key];
    const bValue = b[sortCriteria.key];

    if (aValue < bValue) return sortCriteria.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sortCriteria.order === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedMajors.length / itemsPerPage);
  const displayMajors = sortedMajors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (isChecked) => {
    setSelectMajor(isChecked ? displayMajors.map((u) => u.id) : []);
  };

  const handleSelectOne = (id, isChecked) => {
    setSelectMajor((prev) =>
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
    pdf.save("majors_report.pdf");
  };

  const handleAddMajor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/create_major",
        {
          major_name: formData.major_name,
          faculty_id: formData.faculty_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAddMajor(false);
      setFormData({ major_name: "", faculty_id: "", faculty_name: "" });
      const majorRes = await axios.get(
        "http://localhost:8000/api/view_all_majors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMajors(majorRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditMajor = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `http://localhost:8000/api/edit_major/${selectMajorId}`,
      {
        major_name: formData.major_name,
        faculty_id: formData.faculty_id,
        _method: "PUT"
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response)
    setShowEditMajor(false);
    setFormData({ major_name: "", faculty_id: "", faculty_name: "" });
    
    // Refresh the majors list
    const majorRes = await axios.get(
      "http://localhost:8000/api/view_all_majors",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMajors(majorRes.data);
    toast.success("Major updated successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update major");
  }
};

  const handleViewMajor = (major) => {
  setSelectMajorId(major.id); // Store the major ID for editing
  setFormData({
    major_name: major.major_name,
    faculty_id: major.faculty_id,
    faculty_name: major.faculty_name,
  });
  setShowEditMajor(true);
};

  return (
    <div
      className="h-full p-4 rounded-lg bg-white"
      style={{
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-center pb-4 ">
        <p className="font-bold text-xl">Major Management Table</p>
        <div className="flex h-9 gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alumni..."
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
          <button
            className="flex items-center gap-1 bg-[#1560bd] text-white px-6 py-2 rounded text-xs"
            onClick={() => setShowAddMajor(true)}
          >
            <FaPlus size={10} />
            <span>Add Major</span>
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
                    displayMajors.length > 0 &&
                    displayMajors.every((user) => selectMajor.includes(user.id))
                  }
                />
              </th>
              {["Major id", "Major Name", "Faculty Name", "Action"].map(
                (key) => (
                  <th
                    key={key}
                    className={`p-2 border-b text-left cursor-pointer ${
                      key === "created_at" ? "rounded-tr-md" : ""
                    }`}
                    onClick={() => key !== "Action" && handleSort(key)}
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
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-2 py-3 text-left">
                        <Skeleton height={10} width="80%" />
                      </td>
                    ))}
                  </tr>
                ))
              : displayMajors.map((major) => (
                  <tr
                    key={major.id}
                    className="border-b-2 border-gray-100 hover:bg-gray-50"
                  >
                    <td className="border-b border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectOne(major.id, e.target.checked)
                        }
                        checked={selectMajor.includes(major.id)}
                      />
                    </td>
                    <td className="px-2 py-3 text-left">
                      <button>
                        {major.id}
                      </button>
                    </td>
                    <td className="px-2 py-3 text-left">{major.major_name}</td>
                    <td className="px-2 py-3 text-left">
                      {major.faculty_name}
                    </td>
                    <td className="flex px-6 pt-3 gap-2">
                      <button
                        onClick={() => handleViewMajor(major)}
                        className="p-1 rounded border border-gray-300 shadow">
                        <FiEdit3 />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center bg-white rounded-b-md shadow px-4 py-2 ">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedMajors.length)} of{" "}
          {sortedMajors.length}
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
      {showAddMajor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 rounded-t-md px-4 py-2 text-white bg-denim">
              Add Major
            </h2>
            <form className="px-4 pb-4 space-y-4" onSubmit={handleAddMajor}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major Name
                </label>
                <input
                  type="text"
                  name="major_name"
                  value={formData.major_name}
                  onChange={(e) =>
                    setFormData({ ...formData, major_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty Name
                </label>
                <Select
                  name="faculty"
                  options={facultyOptions}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      faculty_id: selectedOption.value,
                      faculty_name: selectedOption.label,
                    })
                  }
                  value={
                    facultyOptions.find(
                      (option) => option.value === formData.faculty_id
                    ) || null
                  }
                  placeholder="Select Faculty"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMajor(false);
                    setFormData({
                      major_name: "",
                      faculty_id: "",
                      faculty_name: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1560bd] text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Major
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditMajor && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4 rounded-t-md px-4 py-2 text-white bg-denim">
        Edit Major
      </h2>
      <form className="px-4 pb-4 space-y-4" onSubmit={handleEditMajor}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Major Name
          </label>
          <input
            type="text"
            name="major_name"
            value={formData.major_name}
            onChange={(e) =>
              setFormData({ ...formData, major_name: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculty Name
          </label>
          <Select
            name="faculty"
            options={facultyOptions}
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                faculty_id: selectedOption.value,
                faculty_name: selectedOption.label,
              })
            }
            value={
              facultyOptions.find(
                (option) => option.value === formData.faculty_id
              ) || null
            }
            placeholder="Select Faculty"
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              setShowEditMajor(false);
              setFormData({
                major_name: "",
                faculty_id: "",
                faculty_name: "",
              });
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1560bd] text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* Toast notifications container */}
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
