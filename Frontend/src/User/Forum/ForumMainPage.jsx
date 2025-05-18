import { GoHomeFill } from "react-icons/go";
import { FaRegBell } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsEmojiSmile } from "react-icons/bs";
import { PiGif } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { PiShareFatBold } from "react-icons/pi";
import AddComment from "./AddComment";
import AddPost from "./AddPost";
import { LiaPollSolid } from "react-icons/lia";
import { MdOutlineGifBox } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";

export default function ForumMainPage() {
  const [posts, setPosts] = useState([]);
  const [user, setUsers] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [userMap, setUserMap] = useState({});
  const [showAddComment, setShowAddComment] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetails, setShowPostDetails] = useState(false);

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onEmojiClick = (emojiObject) => {
    setContent((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ⭐️ Upload or preview the image here
    // Example: set a preview URL
    // setSelectedImage(URL.createObjectURL(file));
  };

  const handleClickComment = (post, user) => {
    setShowAddComment(!showAddComment);
    setSelectedPost(post, user);
    setSelectedPost({ post, user: userMap[post.user_id] });
  };
  const handlePostDetails = (post, user) => {
    setShowPostDetails(!showPostDetails);
    setSelectedPost(post, user);
    setSelectedPost({ post, user: userMap[post.user_id] });
  }

  const menus = [
    { text: "Home", link: "/AdminDashboard", icon: GoHomeFill },
    { text: "Notifications", link: "/jobSeekerTable", icon: FaRegBell },
    { text: "Connect", link: "/employerTable", icon: FiUsers },
    { text: "Posted", link: "/adminTable", icon: FaRegFile },
  ];

  useEffect(() => {
    const getPostsAndUsers = async () => {
      try {
        console.log("Token:", token);
        // Call both APIs in parallel
        const [postsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:8000/api/discussions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/view_all_users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPosts(postsRes.data.discussions.data);
        setUsers(usersRes.data);
        const map = {};
        usersRes.data.forEach((user) => {
          map[user.id] = user;
        });
        setUserMap(map);
      } catch (error) {
        console.error("Error Response:", error.response);
        setError(error.response?.data?.message || "An error occurred");
        console.error("There was an error!", error.message);
      }
    };

    if (token) {
      getPostsAndUsers();
    } else {
      console.error("No token found, user might not be authenticated");
      setError("User not authenticated");
      navigate("/403");
    }
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen bg-white px-20 relative">
      {/* Left Sidebar - Fixed */}
      <div className="w-64 fixed h-[calc(100vh-87px)] p-4  border-gray-200  shadow ">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="w-full h-9  flex items-center justify-start mb-4 border-b">
            <div className="pl-3 text-3xl pb-2 font-semibold text-denim">Forum</div>
          </div>
          <nav className="space-y-2 flex-1">
            {menus.map((item, index) => (
              <button
                key={index}
                className="flex items-center p-3 rounded-full hover:bg-gray-800 w-full"
              >
                <span className="w-6 h-6 mr-4">
                  <item.icon className="w-6 h-6 text-denim" />
                </span>
                <span className="text-base text-gray-700">{item.text}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="space-y-3">
            {" "}
            {/* Added space between buttons */}
            {/* Post Button */}
            <button
              onClick={()=>setShowAddPost(!showAddPost)}
              className="
                    bg-denim hover:bg-blue-600 
                    text-white font-semibold 
                    py-2.5 px-4 rounded-full 
                    w-full transition-colors duration-200
                    shadow-md hover:shadow-lg
                "
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 border-x border-gray-200 border rounded ml-64 mr-80">
        {/* Header */}
        <div className="sticky top-24 translate-y-[-9PX] bg-white border-gray-300 border-y z-10 flex bg-blur">
          {showPostDetails === false ? (
            <>
             {["For you", "Following"].map((tab, i) => (
              <button
                key={i}
                className={`flex-1 text-center py-3 font-semibold hover:bg-gray-100 transition ${
                  i === 0
                    ? "text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
            </>
            ):(
              <div className="flex items-center gap-7 py-3 px-8 ">
                <button onClick={()=>setShowPostDetails(!showPostDetails)} className="p-1 text-gray-600">
                  <IoArrowBackOutline size={23}/>
                </button>
                <p className="text-lg font-semibold">Post</p>
              </div>
            )}
         
        </div>
            
        
      </div>

      {/* Right Sidebar - Fixed */}
      <div className="w-80 fixed right-16 h-[calc(100vh-4rem)] py-2 px-4 hidden lg:block">
        {/* Search */}
        <div className="sticky top-0">
          <div className="relative  mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchSharp />
            </div>
            <input
              type="text"
              className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Who to follow */}
        <div className="bg-gray-100 rounded-2xl">
          <h2 className="text-xl font-bold p-4">Who to follow</h2>
          {[
            { name: "React", handle: "@reactjs", avatar: "R" },
            { name: "Tailwind CSS", handle: "@tailwindcss", avatar: "T" },
            { name: "Next.js", handle: "@nextjs", avatar: "N" },
          ].map((user, i) => (
            <div
              key={i}
              className="p-4 hover:bg-gray-700/50 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                  {user.avatar}
                </div>
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-gray-500">{user.handle}</div>
                </div>
              </div>
              <button className="bg-white text-black font-bold px-4 py-1 rounded-full hover:bg-gray-200">
                Follow
              </button>
            </div>
          ))}
          <div className="p-4 text-blue-500 hover:bg-gray-700/50 rounded-b-2xl cursor-pointer">
            Show more
          </div>
        </div>
        {/* Footer with legal links */}
        <div className="mt-auto pt-4">
          {" "}
          {/* mt-auto pushes it to bottom */}
          <div className="flex flex-wrap gap-x-1 gap-y-2 text-gray-500 text-xs">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Cookie Policy
            </a>
          </div>
          <div className="mt-2 text-gray-500 text-xs">© 2025 X Corp.</div>
        </div>
      </div>
      {showAddComment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <AddComment post={selectedPost} onClose={() => setShowAddComment(false)}></AddComment>
        </div>
      )}
      {showAddPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <AddPost onClose={()=>setShowAddPost(!showAddPost)}/>
        </div>
      )}
    </div>
  );
}
