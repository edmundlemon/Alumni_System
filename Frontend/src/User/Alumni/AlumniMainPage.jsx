import mapImage from "../../assets/alumni.jpeg";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AlumniMainPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ALUMNI_PER_PAGE = 6;
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
  const [alumni, setAlumni] = useState([]);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      setFilteredAlumni(alumni); 
      setCurrentPage(1);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/search_users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: searchQuery }
      });
      console.log('Search results:', response.data);
      const results = response.data || [];
      setFilteredAlumni(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching donations:', error);
      setFilteredAlumni([]);
    }
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/view_all_alumni",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setAlumni(response.data);
        setFilteredAlumni(response.data);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false); // End loading after fetch attempt
      }
    };

    if (token) {
      fetchAlumni();
    } else {
      console.error("Token not found");
      setLoading(false);
    }
  }, []);

  const handleConnect = async (alumniId) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/connect/${alumniId}`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Connection successful:", response.data);
      toast.success("Connection request sent successfully!");
    } catch (error) {
      console.error("Error connecting with alumni:", error);
      if (error.response && error.response.status === 400) {
        toast.error("You already connected this alumni.");
      } else {
        toast.error("Failed to send connection request.");
      }
    }
  }

  const SkeletonCard = () => (
    <div className="bg-white shadow-lg border rounded-xl p-2 animate-pulse">
      <div className="bg-blue-900 h-32 rounded-lg relative">
        <div className="w-24 h-24 absolute bottom-[-50px] left-4 bg-gray-300 rounded-full" />
      </div>

      <div className="p-4 mt-10 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
        </div>

        <div className="mt-6 h-10 bg-gray-300 rounded-full w-full" />
      </div>
    </div>
  );

  const totalPages = Math.ceil(filteredAlumni.length / ALUMNI_PER_PAGE);
  const firstIndex = (currentPage - 1) * ALUMNI_PER_PAGE;
  const currentAlumni = filteredAlumni.slice(firstIndex, firstIndex + ALUMNI_PER_PAGE);

  const goToPage = (page) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages || 1));

  return (
    <section>
      {/* Banner */}
      <div
        className="relative w-full h-96 flex items-end"
        style={{ background: `url(${mapImage}) center/cover no-repeat` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">
            Alumni
          </h1>
          <p className="text-xl text-white/90">
            Connecting the Past, Inspiring the Future
          </p>
        </div>
      </div>
      {/* Content */}
      <div className="px-20 mt-10 pb-12">
        {/* header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Distinguished Alumni
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search alumni…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              className="py-3 px-5 pr-12 border rounded-lg shadow-md w-[300px] sm:w-[420px] lg:w-[550px] focus:outline-denim"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {loading
            ? Array.from({ length: ALUMNI_PER_PAGE }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : currentAlumni.map(alumni => (
                <div
                  key={alumni.id}
                  className="bg-white shadow-lg border rounded-xl overflow-hidden p-2 flex flex-col items-start transition hover:shadow-xl duration-300"
                >
                  {/* Profile Picture or Initials */}
                  <div className='w-full bg-blue-900 h-32 rounded-lg relative'>
                    <div className="w-24 h-24 mb-4 absolute bottom-[-50px] left-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      {alumni.profile_picture ? (
                        <img
                          src={alumni.profile_picture}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-900">
                          {getInitial(alumni.name)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='p-4 w-full'>
                    {/* Name */}
                    <div className='flex w-full items-center justify-between mt-8'>
                      <h3 className="text-xl font-semibold text-gray-800 ">
                        {alumni.name}
                      </h3>
                      <button 
                        onClick={() => handleConnect(alumni.id)}
                        className='text-xs text-blue-900 font-bold border border-blue-900 px-4 py-1 rounded-full'>
                        Connect
                      </button>
                    </div>

                    {/* Major / Faculty */}
                    <p className="text-gray-500 text-sm mt-4">
                      {alumni.major_name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {alumni.major?.faculty_name || alumni.faculty}
                    </p>

                    <div className='grid grid-cols-3 gap-4 mt-6'>
                      <div className='flex flex-col items-center'>
                        <p>{alumni.connections_count}</p>
                        <p className='text-gray-400 text-sm'>Connections</p>
                      </div>
                      <div className='flex flex-col items-center border-x'>
                        <p>{alumni.discussions_count}</p>
                        <p className='text-gray-400 text-sm'>Posts</p>
                      </div>
                      <div className='flex flex-col items-center'>
                        <p>{alumni.events_count}</p>
                        <p className='text-gray-400 text-sm'>Events</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center mt-6'>
                      <button
                        onClick={() =>
                          navigate("/viewProfile", { state: { alumni } })
                        }
                        className='w-full bg-blue-900 text-white py-2 rounded-full'>View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {/* pagination */}
        <div className="flex justify-between items-center mt-10">
          <p className="text-sm text-gray-600">
            Showing {firstIndex + 1}-
            {Math.min(firstIndex + ALUMNI_PER_PAGE, alumni.length)} of{" "}
            {alumni.length} programs
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`w-10 h-10 rounded ${
                  currentPage === i + 1
                    ? "bg-denim text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      {/* Toast notifications container */}
      <ToastContainer position="top-center" autoClose={3000} toastClassName={(context) =>
        `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`
      }/>
    </section>
  );
}
