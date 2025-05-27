import mmuCampus from "../assets/mmuCampus.png";
import { FaUsers } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import { FaComments } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";

export default function MainPage() {
  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  const mokVioce = [
    { id: 1, name: "Dr. Sarah Lim", email: "sarah.lim@email.com", description: "The alumni network helped me find my current research position at MIT." },
    { id: 2, name: "James Wong", email: "james.wong@email.com", description: "Attending alumni events connected me with investors for my startup." },
    { id: 3, name: "Nurul Hassan", email: "nurul.hassan@email.com", description: "I mentor current students through the alumni program - incredibly rewarding!" },
    { id: 4, name: "David Chen", email: "david.chen@email.com", description: "The career services for alumni helped me transition into tech from finance." },
    { id: 5, name: "Aisha Abdullah", email: "aisha.abd@email.com", description: "My scholarship donation helped a first-gen student complete their degree." },
    { id: 6, name: "Raj Patel", email: "raj.patel@email.com", description: "The global alumni network helped me settle when I moved to London." },
    { id: 7, name: "Emily Koh", email: "emily.koh@email.com", description: "I found my co-founder through an alumni networking event." },
    { id: 8, name: "Michael Tan", email: "michael.tan@email.com", description: "The alumni portal makes it easy to stay connected no matter where I live." },
  ];

  const renderRow = (direction = "left", rowIndex = 0) => (
  <div className={`w-full overflow-hidden py-4 group`}>
    <div
      className={`flex ${direction === "left" ? "animate-marquee" : "animate-marquee-reverse"} gap-4 w-max group-hover:[animation-play-state:paused]`}
    >
      {[...Array(2)].map((_, idx) => (
        <div key={idx} className="flex gap-4">
          {mokVioce.map((alumni) => (
            <div
              key={`${alumni.id}-${idx}-${rowIndex}`}
              className="w-[280px] h-[200px] bg-white shadow-lg border rounded-xl p-6 flex flex-col items-start text-start"
            >
              <div className="flex gap-4 item-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold">
                  {getInitial(alumni?.name)}
                </div>
                <div className="flex-1 space-y-[-5px]">
                   <h3 className="text-start text-gray-800">{alumni.name}</h3>
                   <p className="text-gray-500 text-sm">{alumni.email}</p>
                </div>
              </div>
              <p className="text-base mt-3 text-gray-800">{alumni.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);


  return (
    <section className="bg-[]">
      {/* Hero Section */}
      <div className="w-full h-[450px] relative bg-blue-900">
        {/* <img src={mmuCampus} alt="MMU Campus" className="w-full h-full object-cover" /> */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-extrabold">Connect. Contribute. Celebrate.</h1>
          <h1 className="text-lg font-medium mt-7">Join the vibrant MMU Alumni Network and stay connected with your alma mater</h1>
          <p className="text-lg font-medium">and fellow graduates. Access exclusive benefits, participate in events, and</p>
          <p className="text-lg font-medium">contribute to the growth of our community.</p>
          <div className="flex gap-2 mt-7">
            <button className="px-4 py-2 text-lg bg-[#65aaf0] text-white rounded-lg hover:bg-blue-700 transition">Join The Network</button>
            <button className="px-4 py-2 border-2 text-lg  text-white rounded-lg hover:bg-gray-300 transition">Learn More</button>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full px-20">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <h1 className="text-5xl font-extrabold text-blue-900">What We Offer</h1>
            <p className="text-base font-medium mt-7">Our alumni network provides multiple ways to stay engaged with the university and</p>
            <p className="text-base font-medium">fellow graduates.</p>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8 w-full">
              <div className="flex flex-col items-center justify-center bg-white shadow-md border rounded-lg p-8">
                <FaUsers size={70} className="text-blue-400"/>
                <p className="text-lg font-semibold text-blue-900 my-4">Connect</p>
                <p>Build professional relationships</p>
                <p>with fellow alumni through our</p>
                <p>global network</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-white shadow-md border rounded-lg p-8">
                <BiSolidDonateHeart size={70} className="text-blue-400"/>
                <p className="text-lg font-semibold text-blue-900 my-4">Donate</p>
                <p>Build professional relationships</p>
                <p>and campus improvements with</p>
                <p>your contribution</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-white shadow-md border rounded-lg p-8">
                <FaComments size={70} className="text-blue-400"/>
                <p className="text-lg font-semibold text-blue-900 my-4">Forum</p>
                <p>Engage in discussions, share</p>
                <p>experiences, and seek advice </p>
                <p>from our community</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-white shadow-md border rounded-lg p-8">
                <FaCalendarDays size={70} className="text-blue-400"/>
                <p className="text-lg font-semibold text-blue-900 my-4">Event</p>
                <p>Participate in and create</p>
                <p>networking events, workshopsd</p>
                <p>and reunions</p>
              </div>
          </div>
      </div>
      
      {/* Impact Section */}
      <div className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#65aaf0] mb-6">Make an Impact</h2>
            <p className="text-lg mb-6 leading-relaxed">
              Your support helps create scholarships, improve campus facilities, and provide resources for current students and future alumni.
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              Every gift, regardless of size, makes a difference and helps us continue the tradition of excellence at MMU. There are many ways to give back, from one-time donations to planned giving.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#65aaf0] hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-lg">
                Donate Now
              </button>
              <button className="px-6 py-3 border-2 border-white hover:bg-white/10 text-white font-medium rounded-lg transition-all">
                Learn About Giving
              </button>
            </div>
          </div>
          <div className="h-full rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={mmuCampus} 
              alt="MMU Campus" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="my-16 mx-20 space-y-[-15px]">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <h1 className="text-5xl font-extrabold text-blue-900">Alumni Voices</h1>
          <p className="text-base font-medium text-gray-500 mt-7">Hear what our alumni have to say about their experience with the MMU Alumni</p>
          <p className="text-base font-medium text-gray-500 mb-8">Network.</p>
        </div>
        {renderRow("left", 1)}
        {renderRow("right", 2)}
      </div>
    </section>
  );
}
