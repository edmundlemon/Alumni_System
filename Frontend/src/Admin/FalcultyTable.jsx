import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { BiExport, BiSortAlt2 } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit3 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

export default function FacultyTable() {
  const navigate = useNavigate();
  const token = Cookies.get("adminToken");
  const [faculties, setFaculties] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({ key: "", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const printRef = useRef();
  const [content, setContent] = useState("");
  const [showEditFaculty, setShowEditFaculty] = useState(false);
  const [selectFaculty, setSelectFaculty] = useState(null);

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/create_faculty",
        { faculty_name: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Faculty added successfully");
      const newFaculty = res.data.faculty;
      setFaculties((prev) => [...prev, newFaculty]);
      setShowAddFaculty(false);
      setContent("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add faculty");
    }
  };

  const handleEditFaculty = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/edit_faculty/${selectFaculty.id}`,
        { faculty_name: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the local state with the edited faculty
      setFaculties((prev) =>
        prev.map((faculty) =>
          faculty.id === selectFaculty.id
            ? { ...faculty, faculty_name: content }
            : faculty
        )
      );
      
      toast.success("Faculty edited successfully");
      setShowEditFaculty(false);
      setContent("");
      setSelectFaculty(null);
    } catch (error) {
      console.error("Error editing faculty:", error);
      toast.error("Failed to edit faculty.");
    }
  };

  // Initialize content when editing
  useEffect(() => {
    if (showEditFaculty && selectFaculty) {
      setContent(selectFaculty.faculty_name || "");
    }
  }, [showEditFaculty, selectFaculty]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/view_all_faculties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaculties(res.data.faculties || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        navigate("/403");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchFaculties();
    } else {
      toast.error("Unauthorized access");
      navigate("/403");
    }
  }, [token, navigate]);

  const handleDelete = async (facultyId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties((prev) => prev.filter((f) => f.id !== facultyId));
      setSelected((prev) => prev.filter((id) => id !== facultyId));
      toast.success("Faculty deleted successfully");
    } catch (error) {
      toast.error("Failed to delete faculty");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      toast.warning("Please select at least one faculty to delete");
      return;
    }

    try {
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://localhost:8000/api/delete_faculty/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setFaculties((prev) => prev.filter((f) => !selected.includes(f.id)));
      setSelected([]);
      toast.success(`${selected.length} faculties deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete selected faculties");
    }
  };

  const handleExport = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("faculty_report.pdf");
  };

  const handleSort = (key) => {
    setSortCriteria((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (isChecked) => {
    setSelected(isChecked ? displayed.map((f) => f.id) : []);
  };

  const handleSelectOne = (id, isChecked) => {
    setSelected((prev) =>
      isChecked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const filtered = faculties.filter((f) =>
    f.faculty_name && f.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCriteria.key) return 0;
    
    const aVal = a[sortCriteria.key];
    const bVal = b[sortCriteria.key];
    
    // Handle numeric sorting for ID
    if (sortCriteria.key === 'id') {
      const numA = Number(aVal);
      const numB = Number(bVal);
      return sortCriteria.order === "asc" ? numA - numB : numB - numA;
    }
    
    // Handle string sorting for other fields
    if (aVal < bVal) return sortCriteria.order === "asc" ? -1 : 1;
    if (aVal > bVal) return sortCriteria.order === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const displayed = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-full p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center pb-4">
        <p className="text-xl font-bold">Faculty Management Table</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty..."
              className="w-[300px] h-9 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-md text-sm"
            />
            <IoSearchSharp className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs"
          >
            <MdDeleteOutline size={16} />
            Delete Selected
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 border-2 border-gray-100 px-3 py-2 rounded text-xs"
          >
            <BiExport size={16} />
            Export
          </button>
          <button
             className="flex items-center gap-1 bg-[#1560bd] text-white px-6 py-2 rounded text-xs"
             onClick={() => setShowAddFaculty(true)}
          >
            <FaPlus size={10} />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      <div ref={printRef}>
        <table className="min-w-full bg-white rounded shadow ">
          <thead className="bg-blue-100">
            <tr>
              <th className=" text-center rounded-tl-md">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    displayed.length > 0 &&
                    displayed.every((f) => selected.includes(f.id))
                  }
                />
              </th>
              <th 
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-2">
                  Faculty ID
                  <BiSortAlt2 size={18} />
                </div>
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("faculty_name")}
              >
                <div className="flex items-center gap-2">
                  Faculty Name
                  <BiSortAlt2 size={18} />
                </div>
              </th>
              <th className="p-2 text-left rounded-tr-md">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: itemsPerPage }, (_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2 text-center">
                      <Skeleton circle height={16} width={16} />
                    </td>
                    <td className="p-2 text-center">
                      <Skeleton height={10} width="80%" />
                    </td>
                    <td className="p-2">
                      <Skeleton height={10} width="80%" />
                    </td>
                    <td className="p-2">
                      <Skeleton height={10} width="80%" />
                    </td>
                  </tr>
                ))
              : displayed.map((faculty, i) => (
                  <tr key={faculty.id} className="hover:bg-gray-50 border-b">
                    <td className="p-1 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectOne(faculty.id, e.target.checked)
                        }
                        checked={selected.includes(faculty.id)}
                      />
                    </td>
                    <td className="p-2 text-left">
                      {faculty.id}
                    </td>
                    <td className="p-2 py-3 ">{faculty.faculty_name}</td>
                    <td className="flex px-2 pt-3 gap-2">
                       <button
                        className="p-1 rounded border border-gray-300 shadow"
                        onClick={() => {
                          setShowEditFaculty(true);
                          setSelectFaculty(faculty);
                        }}
                       >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => handleDelete(faculty.id)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
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
          {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === i + 1 ? "bg-[#1560bd] text-white" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Add Faculty Modal */}
      {showAddFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 rounded-t-md px-4 py-2 text-white bg-[#1560bd]">
              Add Faculty
            </h2>
            <form className="px-4 pb-4 space-y-4" onSubmit={handleAddFaculty}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty Name :
                </label>
                <input
                  type="text"
                  name="faculty_name"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFaculty(false);
                    setContent("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1560bd] text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {showEditFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 rounded-t-md px-4 py-2 text-white bg-[#1560bd]">
              Edit Faculty
            </h2>
            <form className="px-4 pb-4 space-y-4" onSubmit={handleEditFaculty}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty Name :
                </label>
                <input
                  type="text"
                  name="faculty_name"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditFaculty(false);
                    setContent("");
                    setSelectFaculty(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1560bd] text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Update Faculty
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