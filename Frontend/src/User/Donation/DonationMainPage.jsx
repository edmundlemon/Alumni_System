import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import donationHeader from '../../assets/donation2.jpeg';     // banner image
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DonateNow from './DonateNow';

export default function DonationMainPage() {
  const token = Cookies.get('token');
  const EVENTS_PER_PAGE = 6;
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [showDonate, setShowDonate] = useState(false);
  const [seletedDonate, setSelectedDonate] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ⬅️ Loading state
  const navigate = useNavigate();

  const mockEvents = [
    { id: 1,  name: 'Food Donation',            description: 'Help us provide food to those in need. Your contribution will ensure that families and individuals facing hardship receive nutritious meals and support during difficult times.',              image: 'https://picsum.photos/400/250?random=1',  raised: 12_500, goal: 25_000 },
    { id: 2,  name: 'Clothing Donation',        description: 'Donate clothes to help the less fortunate. Every piece of clothing you give brings warmth and dignity to someone in need, especially during harsh weather.',         image: 'https://picsum.photos/400/250?random=2',  raised: 8_000,  goal: 15_000 },
    { id: 3,  name: 'Book Donation',            description: 'Share your love for reading by donating books. Your donation will help build libraries and provide educational resources to underprivileged children.',     image: 'https://picsum.photos/400/250?random=3',  raised: 3_500,  goal: 10_000 },
    { id: 4,  name: 'Toy Donation',             description: 'Bring joy to children by donating toys. Your generosity will light up a child’s face and create cherished memories for years to come.',            image: 'https://picsum.photos/400/250?random=4',  raised: 12_000, goal: 20_000 },
    { id: 5,  name: 'School Supplies Donation', description: 'Help students succeed by donating school supplies. Your support ensures that every child has the tools they need to learn and thrive in school.', image: 'https://picsum.photos/400/250?random=5',  raised: 4_500,  goal: 12_000 },
    { id: 6,  name: 'Medical Supplies',         description: 'Support healthcare by donating medical supplies. Your help provides essential items to clinics and hospitals serving vulnerable communities.',   image: 'https://picsum.photos/400/250?random=6',  raised: 28_000, goal: 30_000 },
    { id: 7,  name: 'Animal Shelter',           description: 'Help us care for animals in need. Your donation will provide food, shelter, and medical care for rescued animals awaiting loving homes.',                  image: 'https://picsum.photos/400/250?random=7',  raised: 7_500,  goal: 20_000 },
    { id: 8,  name: 'Environmental',            description: 'Support environmental conservation efforts. Your contribution aids in tree planting, clean-up drives, and protecting natural habitats.',        image: 'https://picsum.photos/400/250?random=8',  raised: 18_000, goal: 25_000 },
    { id: 9,  name: 'Disaster Relief',          description: 'Help those affected by natural disasters. Your timely support delivers emergency aid, shelter, and hope to communities in crisis.',          image: 'https://picsum.photos/400/250?random=9',  raised: 42_000, goal: 50_000 },
    { id: 10, name: 'Community Development',    description: 'Support local community development projects. Your donation empowers initiatives that improve infrastructure, education, and quality of life.',      image: 'https://picsum.photos/400/250?random=10', raised: 9_500,  goal: 30_000 },
  ];

  useEffect(() => {
    setIsLoading(true); // Start loading
    setAllEvents(mockEvents); // Replace with real data when API works

    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/view_all_donations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        // setAllEvents(response.data); // if you want to load from API
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    if (token) {
      fetchDonations();
    } else {
      console.error('No token found, user might not be authenticated');
      setIsLoading(false); // End loading even if there's no token
    }
  }, []);

  const filteredEvents = allEvents.filter(e =>
    e.name.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const firstIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentDonates = filteredEvents.slice(firstIndex, firstIndex + EVENTS_PER_PAGE);

  const goToPage = page =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages || 1));

  const formatCurrency = amt =>
    new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(amt);

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
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Donations</h1>
          <p className="text-xl text-white/90">
            Your kindness makes a difference—be the reason someone smiles today.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-20 mt-10 pb-12">
        {/* header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Programs</h2>
          <div className="relative">
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              type="text"
              placeholder="Search programs…"
              className="py-3 px-5 pr-12 rounded-lg shadow-md w-[300px] sm:w-[420px] lg:w-[550px] focus:outline-denim"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white shadow-lg border rounded h-[400px]">
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
        ) : (
          <>
            {/* cards grid */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentDonates.map(dnt => {
                const progress = calcProgress(dnt.raised, dnt.goal);
                return (
                  <div key={dnt.id} className="bg-white shadow-lg border rounded flex flex-col">
                    <div className="relative">
                      <img src={dnt.image} alt={dnt.name} className="w-full h-52 object-cover rounded-t" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t" />
                      <h3 className="absolute bottom-4 left-6 text-xl font-semibold text-white drop-shadow">
                        {dnt.name}
                      </h3>
                    </div>
                    <p className="px-6 py-6 text-gray-600 line-clamp-2 overflow-hidden mb-4">
                      {dnt.description}
                    </p>
                    <div className="px-6 pb-6">
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>Raised: {formatCurrency(dnt.raised)}</span>
                        <span>Goal: {formatCurrency(dnt.goal)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-denim'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right mt-1 text-sm font-medium text-gray-500">
                        {progress}% funded
                      </div>
                    </div>
                    <div className="flex gap-4 border-t px-6 py-4 mt-auto">
                      <button 
                        onClick={()=>clickDonate(dnt)}
                        className="flex-1 py-2 bg-denim text-white rounded hover:opacity-90">
                        Donate
                      </button>
                      <button 
                        onClick={() => navigate("/viewDonateDetails", { state: { dnt } })}
                        className="flex-1 py-2 border border-denim text-denim rounded hover:bg-denim/5">
                        More Info
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pagination */}
            <div className="flex justify-between items-center mt-10">
              <p className="text-sm text-gray-600">
                Showing {firstIndex + 1}-{Math.min(firstIndex + EVENTS_PER_PAGE, filteredEvents.length)} of{' '}
                {filteredEvents.length} programs
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
                      currentPage === i + 1 ? 'bg-denim text-white' : 'border hover:bg-gray-100'
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
            <DonateNow donate={seletedDonate} onClose={() => setShowDonate(false)} />
          </div>
        )}
      </div>
    </section>
  );
}
