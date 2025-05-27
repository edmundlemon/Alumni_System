import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoLocation } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
import Cookies from "js-cookie";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

export default function ViewProfile() {
  const { state } = useLocation();
  const alumni = state?.alumni;
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
  console.log("Alumni Data:", alumni);

  const [activeTab, setActiveTab] = useState("about");

  const [connect, setconnect] = useState([]);
  const [event, setEvent] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const [connectRes, eventRes] = await Promise.all([
          axios.get("http://localhost:8000/api/view_all_alumni", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8000/api/view_event/${alumni.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setconnect(connectRes.data);
        console.log("Alumni events:", eventRes.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Event not found for this alumni.");
        } else {
          console.error("Error fetching alumni data:", error);
        }
      }
    };

    if (token && alumni?.id) {
      fetchAlumni();
    } else {
      console.error("Token or alumni ID not found");
    }
  }, [token, alumni]);

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
    } catch (error) {
      console.error("Error connecting with alumni:", error);
    }
  }

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
    ]

    const mokForum = [
        {
            id:1,
            name:"John Doe",
            title:"How to improve my coding skills?",
            description:"I am looking for resources and tips to enhance my coding skills. Any recommendations?",
        }
        ,
        {
            id:2,
            name:"Jane Smith",
            title:"Best practices for web development",
            description:"What are the best practices for web development in 2025? Looking for insights and resources.",
        },
        {
            id:3,
            name:"Alice Johnson",
            title:"Career advice for fresh graduates",
            description:"I am a recent graduate and would like to know how to kickstart my career in tech. Any advice?",
        }
    ]




  return (
    <section className="min-h-screen">
      <div className="flex w-full h-80 bg-blue-900">
        <div className="flex px-20 items-center h-full w-full">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
            {alumni.image ? (
              <img
                src={alumni.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-sm"
              />
            ) : (
              <div className="w-full h-full text-6xl font-medium flex items-center justify-center rounded-full border-4 border-blue-200 shadow-sm">
                {getInitial(alumni.name)}
              </div>
            )}
          </div>
          <div className="text-white ml-32 space-y-4 flex-1">
            <h1 className="text-3xl font-bold ">{alumni.name}</h1>
            <p className="text-lg">
              {alumni.major_name} , {alumni.major.faculty_name}
            </p>
            <p className="flex items-center gap-2">
              <IoLocation />
              Malaysia
            </p>
            <p className="flex items-center gap-2">
              <MdWork />
              Maybank sdn bhd , Full stack developer
            </p>
          </div>
          <div className="flex justify-end items-start flex-0">
            <button className="border border-white text-white px-4 py-2 rounded-md ml-auto">
              Connect
            </button>
          </div>
        </div>
      </div>
      <div className="flex px-20 pt-10 pb-20 gap-4">
        <div className="w-1/4">
          <div className="w-full p-4 border border-gray-300 space-y-2 rounded-md">
            <h1 className="font-bold text-xl">Profile Stats</h1>
            <div className="flex w-full justify-between">
              <p>Connections</p>
              <button className="rounded-full text-xs px-3 text-medium text-white bg-blue-500">
                215
              </button>
            </div>
            <div className="flex w-full justify-between">
              <p>Events Organize</p>
              <button className="rounded-full text-xs px-3 text-medium text-white bg-blue-500">
                34
              </button>
            </div>
            <div className="flex w-full justify-between">
              <p>Forum Posts</p>
              <button className="rounded-full text-xs px-3 text-medium text-white bg-blue-500">
                2195
              </button>
            </div>
          </div>
          <div className="w-full p-4 border border-gray-300 space-y-3 mt-4 rounded-md">
            <h1 className="font-bold text-xl">About</h1>
            <p className="flex items-center gap-3">
              <MdEmail />
              {alumni.email}
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt />
              (555) 123-4567
            </p>
            <p className="flex items-center gap-3">
              <BsLinkedin />
              <a href="">LinkedIn Profile</a>
            </p>
          </div>
        </div>
        <div className="w-3/4 border rounded-md">
          <div className="flex py-2 px-4 border-b border-gray-300 space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "about" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "connections" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("connections")}
            >
              Connections
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "events" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "forum" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("forum")}
            >
              Forum Post
            </button>
          </div>
          {activeTab === "about" && (
            <div className="p-6">
              <h1 className="font-bold text-xl">Biography</h1>
              <p className="mt-2">
                I'm a software engineer with over 5 years of experience
                specializing in web applications and machine learning. After
                graduating from the Computer Science department in 2018, I've
                worked at several tech companies before joining Tech Solutions
                Inc. where I currently lead a development team building
                innovative SaaS products.
              </p>
              <h1 className="font-bold text-xl mt-4">Education</h1>
              <h2 className="mt-2 font-medium text-lg">
                B.S. in Computer Science
              </h2>
              <p className="text-gray-500">
                University of Technology, Malaysia
              </p>
              <h2 className="mt-3 font-medium text-lg">M.S. in Data Science</h2>
              <p className="text-gray-500">
                University of Technology, Malaysia
              </p>
              <h1 className="font-bold text-xl mt-4">Work Experience</h1>
              <h2 className="mt-2 font-medium text-lg">
                Senior Software Engineer
              </h2>
              <p className="text-gray-600">Tech Solutions Inc., 2020-Present</p>
              <p className="text-gray-500">
                Leading a team of developers building cloud-based enterprise
                applications.
              </p>
              <h2 className="mt-3 font-medium text-lg">Software Developer</h2>
              <p className="text-gray-600">Innovate Systems, 2018-2020</p>
              <p className="text-gray-500">
                Developed front-end applications using React and backend
                services with Node.js.
              </p>
            </div>
          )}
          {activeTab === "connections" && (
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-xl">Connections</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search alumni…"
                    className="py-2 px-5 pr-12 border rounded-md shadow- w-[200px] sm:w-[320px] lg:w-[420px] focus:outline-denim"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {connect.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="flex items-center gap-4 border-b pb-4 w-full"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      {alumni.image ? (
                        <img
                          src={alumni.image}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full text-3xl font-medium flex items-center justify-center rounded-full border-4 border-blue-200 shadow-sm">
                          {getInitial(alumni.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">{alumni.name}</h1>
                      <p>
                        {alumni.major_name} , {alumni.major.faculty_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "events" && (
            <div className="p-6">
              <h1 className="font-bold text-xl">Events</h1>
              <div className="flex flex-col gap-4 mt-4">
                {mockEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 border-b pb-4 w-full"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div>
                      <h1 className="text-lg font-bold">{event.title}</h1>
                      <p className="line-clamp-1">{event.description}</p>
                      <p>{event.date}</p>
                      <p>{event.time}</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "forum" && (
            <div className="p-6">
              <h1 className="font-bold text-xl">Forum Posts</h1>
              <div className="flex flex-col gap-4 mt-4">
                {mokForum.map((forum) => (
                  <div
                    key={forum.id}
                    className="flex items-center gap-4 w-full"
                  >
                    <div className="border border-gray-300 px-4 pt-3 rounded-lg w-full">
                      <h1 className="text-lg font-bold">{forum.title}</h1>
                      <p>{forum.description}</p>
                      <p>{forum.name}</p>
                      <div className="flex gap-2 py-2 border-t items-center justify-between">
                        <div className="flex gap-2">
                            <p className="flex items-center text-sm gap-2"><FaRegHeart size={16}/>37 likes</p>
                            <p className="flex items-center text-sm gap-2"><FaRegComment size={16}/>8 comments</p>
                        </div>
                        <button className="text-sm border-blue-500 border px-4 py-1 rounded text-blue-500">View Post</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}    
        </div>
      </div>
    </section>
  );
}
