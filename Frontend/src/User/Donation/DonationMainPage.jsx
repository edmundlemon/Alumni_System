import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import donationHeader from "../../assets/donation2.jpeg";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DonateNow from "./DonateNow";
import fallbackImage from "../../assets/fallback-image.jpg";

export default function DonationMainPage() {
  const token = Cookies.get("token");
  const EVENTS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [showDonate, setShowDonate] = useState(false);
  const [selectedDonate, setSelectedDonate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [donate, setDonate] = useState([]);
  const [filteredDonates, setFilteredDonates] = useState([]);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      setFilteredDonates(donate);
      setCurrentPage(1);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/search_donation_posts",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: searchQuery },
        }
      );
      const results = response.data.donation_posts || [];
      setFilteredDonates(results);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching donations:", error);
      setFilteredDonates([]);
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/view_all_donation_posts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched donations:", response.data);
        const allDonations = response.data.donation_posts || [];
        setDonate(allDonations);
        setFilteredDonates(allDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchDonations();
    else setIsLoading(false);
  }, [token]);

  const totalPages = Math.ceil(filteredDonates.length / EVENTS_PER_PAGE);
  const firstIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentDonates = filteredDonates.slice(
    firstIndex,
    firstIndex + EVENTS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages || 1));
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(amt);

  const calcProgress = (raised, goal) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const clickDonate = (dnt) => {
    setShowDonate(true);
    setSelectedDonate(dnt);
  };

  return (
    <section>
      {/* Banner */}
      <div
        className="relative w-full h-96 flex items-end"
        style={{ background: `url(${donationHeader}) center/cover no-repeat` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">
            Donations
          </h1>
          <p className="text-xl text-white/90">
            Your kindness makes a difference—be the reason someone smiles today.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-20 mt-10 pb-12">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Programs
          </h2>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
              type="text"
              placeholder="Search programs…"
              className="py-3 px-5 pr-12 rounded-lg shadow-md w-[300px] sm:w-[420px] lg:w-[550px] focus:outline-denim"
            />
            <FaSearch
              onClick={(e) => handleSearchSubmit(e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </form>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white shadow-lg border rounded h-[400px]"
              >
                <div className="h-52 bg-gray-300 rounded-t" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-2/3" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDonates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No donation programs found. Check back later!
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilteredDonates(donate);
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Donation cards */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentDonates.map((dnt) => {
                const progress = calcProgress(
                  dnt.current_amount,
                  dnt.target_amount
                );
                return (
                  <div
                    key={dnt.id}
                    className="bg-white shadow-lg border rounded transition-all duration-300 ease-in-out transform hover:scale-[1.02] 
                                hover:shadow-lg flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={dnt.photo || fallbackImage}
                        alt={dnt.donation_title}
                        className="w-full h-52 object-cover rounded-t"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t" />
                      <h3 className="absolute bottom-4 left-6 text-xl font-semibold text-white drop-shadow">
                        {dnt.donation_title}
                      </h3>
                    </div>
                    <p className="px-6 py-6 text-gray-600 line-clamp-2 overflow-hidden mb-4">
                      {dnt.description}
                    </p>
                    <div className="px-6 pb-6">
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>
                          Raised: {formatCurrency(dnt.current_amount)}
                        </span>
                        <span>Goal: {formatCurrency(dnt.target_amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            progress >= 100 ? "bg-green-500" : "bg-denim"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right mt-1 text-sm font-medium text-gray-500">
                        {progress}% funded
                      </div>
                    </div>
                    <div className="flex gap-4 border-t px-6 py-4 mt-auto">
                      <button
                        onClick={() => clickDonate(dnt)}
                        className="flex-1 py-2 bg-denim text-white rounded hover:opacity-90"
                      >
                        Donate
                      </button>
                      <button
                        onClick={() =>
                          navigate("/viewDonateDetails", { state: { dnt } })
                        }
                        className="flex-1 py-2 border border-denim text-denim rounded hover:bg-denim/5"
                      >
                        More Info
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-10">
              <p className="text-sm text-gray-600">
                Showing {firstIndex + 1}-
                {Math.min(firstIndex + EVENTS_PER_PAGE, filteredDonates.length)}{" "}
                of {filteredDonates.length} programs
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
          </>
        )}

        {/* Donation modal */}
        {showDonate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <DonateNow
              donate={selectedDonate}
              onClose={() => setShowDonate(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
