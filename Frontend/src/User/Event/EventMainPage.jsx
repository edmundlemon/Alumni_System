import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import event from "../../assets/event.jpg";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";


export default function EventMainPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [dayTimeFilter, setDayTimeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; 
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const navigate = useNavigate();

  const mockEvents = [
    {
      id: 1,
      title: "Friday Night Football",
      description: "High school teams clash under stadium lights in an exciting evening match.",
      date: "2025-05-12",
      time: "7:00 PM",
      location: "High School Stadium",
      image: "https://picsum.photos/400/250?random=1",
      type: "online",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Spooky Time! Pumpkin Carving",
      description: "Get ready for an electrifying evening of music, lights, and unforgettable energy as [Artist Name] takes the stage live at Zepp KL, Kuala Lumpur’s premier concert venue. This one-night-only performance is part of their highly anticipated 2025 world tour and promises to deliver an immersive experience that blends powerful vocals, captivating visuals, and a setlist packed with fan favorites and brand-new releases.With state-of-the-art acoustics and an intimate atmosphere, Zepp KL offers the perfect setting for a night of live music you won’t forget. Fans can expect an emotionally charged performance, interactive moments, and stunning stage design that enhances every beat and lyric.Whether you've been following [Artist Name]'s journey from the beginning or are just discovering their music, this concert is your chance to connect with a global music sensation up close and personal. Arrive early to grab exclusive merchandise, meet fellow fans, and soak in the pre-show vibes.",
      date: "2025-05-25",
      time: "6:00 PM",
      location: "Community Hall",
      image: "https://picsum.photos/400/250?random=2",
      type: "online",
      status: "upcoming",
      created_at: "2025-04-25",
      lastUpdated_at: "2025-04-26",
      postedBy: "John Doe"
    },
    {
      id: 3,
      title: "Karaoke Night",
      description: "Bring your best voice and compete for prizes in our weekly competition!",
      date: "2023-05-16",
      time: "8:00 PM",
      location: "Cafe Lounge",
      image: "https://picsum.photos/400/250?random=3",
      type: "physical",
      status: "upcoming"
    },
    {
      id: 9,
      title: "Virtual Reality Gaming Tournament",
      description: "Compete in the latest VR games for a chance to win amazing prizes.",
      date: "2023-10-30",
      time: "1:00 PM",
      location: "Online",
      image: "https://picsum.photos/400/250?random=7",
      type: "hybrid",
      status: "upcoming"
    },
    {
      id: 10,
      title: "Photography Workshop",
      description: "Learn the art of photography with hands-on experience and expert guidance.",
      date: "2025-11-15",
      time: "10:00 AM",
      location: "Art Studio",
      image: "https://picsum.photos/400/250?random=8",
      type: "hybrid",
      status: "upcoming"
    },
    {
      id: 11,
      title: "Yoga Retreat",
      description: "Relax and rejuvenate with a weekend of yoga and meditation in nature.",
      date: "2023-12-01",
      time: "8:00 AM",
      location: "Mountain Resort",
      image: "https://picsum.photos/400/250?random=9",
      type: "physical",
      status: "upcoming"
    },
    {
      id: 12,
      title: "Food Truck Festival",
      description: "Taste delicious food from local food trucks and enjoy live music.",
      date: "2023-11-20",
      time: "11:00 AM",
      location: "Downtown Square",
      image: "https://picsum.photos/400/250?random=10",
      type: "online",
      status: "upcoming"
    },
    // Past Events
    {
      id: 7,
      title: "Summer Music Festival",
      description: "Enjoy live music from local bands and food trucks at the park.",
      date: "2023-08-15",
      time: "2:00 PM",
      location: "City Park",
      image: "https://picsum.photos/400/250?random=1",
      type: "physical",
      status: "past"
    },
    {
      id: 8,
      title: "Tech Conference 2023",
      description: "Join industry leaders for a day of talks and networking.",
      date: "2023-07-10",
      time: "9:00 AM",
      location: "Convention Center",
      image: "https://picsum.photos/400/250?random=2",
      type: "hybrid",
      status: "past"
    },
    {
      id: 4,
      title: "Art Exhibition",
      description: "Explore local artists' works and meet the creators at this special showcase.",
      date: "2023-09-15",
      time: "5:00 PM",
      location: "Art Gallery",
      image: "https://picsum.photos/400/250?random=4",
      type: "hybrid",
      status: "past"
    },
    {
      id: 5,
      title: "Charity Run",
      description: "Run for a cause! All proceeds go to local children's charities.",
      date: "2023-08-01",
      time: "9:00 AM",
      location: "City Park",
      image: "https://picsum.photos/400/250?random=5",
      type: "online",
      status: "past"
    },
    {
      id: 6,
      title: "Cooking Class",
      description: "Learn to cook delicious meals with our award-winning local chefs.",
      date: "2023-09-20",
      time: "3:00 PM",
      location: "Community Kitchen",
      image: "https://picsum.photos/400/250?random=6",
      type: "online",
      status: "past"
    }
  ];

  const [filteredEvents, setFilteredEvents] = useState([]);

  // Pagination calculations
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const parseHour = (timeStr) => {
    const [hour, minutesPart] = timeStr.split(":");
    const hourInt = parseInt(hour);
    const isPM = timeStr.toLowerCase().includes("pm");
    return isPM && hourInt < 12 ? hourInt + 12 : hourInt;
  };

  const filterByDayTime = (event, dayTimeFilter) => {
  if (!dayTimeFilter) return true;

  const eventDate = new Date(event.date);
  const today = new Date();

  if (dayTimeFilter === "thisWeek") {
    const startOfWeek = getStartOfWeek(new Date(today));
    const endOfWeek = getEndOfWeek(new Date(today));
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  }

  if (dayTimeFilter === "thisMonth") {
    return (
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  }

  return true;
};


  useEffect(() => {
    const filtered = mockEvents.filter(event => {
      const matchesStatus = event.status === activeTab;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "" || 
                        (typeFilter === "physical" && event.type !== "Online") ||
                        (typeFilter === "online" && event.type === "Online") ||
                        (typeFilter === "hybrid" && event.type.includes("Hybrid"));

      const matchesDayTime = filterByDayTime(event, dayTimeFilter);

      return matchesStatus && matchesSearch && matchesType && matchesDayTime;
    });
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, searchQuery, dayTimeFilter, typeFilter]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);

   window.scrollTo({
  top: 500,
  behavior: 'smooth',
})
};



  return (
    <section className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-96 flex items-end" style={{ backgroundImage: `url(${event})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Events</h1>
          <p className="text-xl text-white/90">Discover and join exciting events happening around you</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "upcoming" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "past" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>

        <div className="px-20">
          {/* Filters */}
          <div className="flex justify-between items-center mb-6 w-full">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab} Events</h2>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="py-3 px-5 pr-12 rounded-lg shadow-md w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  className="
                  w-full
                  py-3 px-4 pr-10
                  rounded-lg border
                  bg-white text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  shadow-md
                  appearance-none
                  cursor-pointer
                  transition-all
                  hover:border-gray-400"
                  onChange={(e) => setDayTimeFilter(e.target.value)}
                  value={dayTimeFilter}
                  onFocus={() => setIsDayOpen(true)}
                  onBlur={() => setIsDayOpen(false)}
                >
                  <option value="">All Days</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-2 text-gray-500">
                  {isDayOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              </div>

              <div className="relative">
                <select
                  className="
                    w-full
                    py-3 px-4 pr-10
                    rounded-lg border 
                    bg-white text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    shadow-md
                    appearance-none
                    cursor-pointer
                    transition-all
                    hover:border-gray-400
                  "
                  onChange={(e) => setTypeFilter(e.target.value)}
                  value={typeFilter}
                  onFocus={() => setIsTypeOpen(true)}
                  onBlur={() => setIsTypeOpen(false)}
                >
                  <option className="mt-10" value="">All Types</option>
                  <option value="physical">Physical</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-2 text-gray-500">
                  {isTypeOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              </div>
            </div>
          </div>

          {currentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {activeTab} events found. Check back later!</p>
              {(searchQuery || dayTimeFilter || typeFilter) && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setDayTimeFilter("");
                    setTypeFilter("");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg p-4 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full max-h-[460px]">
                    <div className="relative h-80  overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      {/* Status Badge */}
                      {event.status === "past" ? (
                        <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs">
                          Past Event
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-sm text-xs font-bold border border-gray-300">
                          <span className="block">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                          <span className="block text-[10px] mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col h-full">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(event.date)} • {event.time}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="hi inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {event.type}
                        </span>
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => navigate("/viewEventDetails", { state: { event } })}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>

                ))}
              </div>

                <div className="flex justify-between items-center mt-8">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaChevronLeft />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}