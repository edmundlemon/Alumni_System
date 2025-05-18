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
  const getInitial = (name = "") => name.charAt(0).toUpperCase();
  const [posts, setPosts] = useState([]);
  const [user, setUsers] = useState([]);
  const [mainUser, setMainUser] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  const [userMap, setUserMap] = useState({});
  const [showAddComment, setShowAddComment] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [joinComment, setJoinComment] = useState(false);
  const [connectPost, setConnectPost] = useState([]);
  const [showConnectPost, setShowConnectPost] = useState(false);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
    const months = Math.floor(seconds / 2592000);
    const years = Math.floor(seconds / 31536000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

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
    // setSelectedImage(URL.createObjectURL(file));
  };

  const handleClickComment = (post) => {
    setShowAddComment(!showAddComment);
    setSelectedPost({ post, user: userMap[post.user_id] });
  };
  const handlePostDetails = (post) => {
    setShowPostDetails(!showPostDetails);
    setSelectedPost({ post, user: userMap[post.user_id] });
  };

  const menus = [
    { text: "Home", link: "/AdminDashboard", icon: GoHomeFill },
    { text: "Notifications", link: "/jobSeekerTable", icon: FaRegBell },
    { text: "Connect", link: "/employerTable", icon: FiUsers },
    { text: "Posted", link: "/adminTable", icon: FaRegFile },
  ];

  useEffect(() => {
    const getPostsAndUsers = async () => {
      try {
        const [postsRes, usersRes, mainRes, connectRes] = await Promise.all([
          axios.get("http://localhost:8000/api/discussions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/view_all_users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8000/api/view_user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            "http://localhost:8000/api/view_connected_users_discussion",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);
        setPosts(postsRes.data.discussions.data);
        setUsers(usersRes.data);
        setMainUser(mainRes.data);
        setConnectPost(connectRes.data);
        console.log("Connected Posts:", connectRes.data);
        console.log("Post:", postsRes.data.discussions.data);
        const map = {};
        usersRes.data.forEach((user) => {
          map[user.id] = user;
        });
        setUserMap(map);
      } catch (error) {
        if (error.response) {
          console.error("Error Response:", error.response);
        } else {
          console.error("Error:", error);
        }
      }
    };

    if (token) {
      getPostsAndUsers();
    } else {
      console.error("No token found, user might not be authenticated");
      navigate("/403");
    }
  }, [token, navigate]);

  useEffect(() => {
  if (showPostDetails) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setJoinComment(false);
  }
  }, [showPostDetails]);

  return (
    <div className="flex min-h-screen bg-white px-20 relative">
      {/* Left Sidebar - Fixed */}
      <div className="w-64 fixed h-[calc(100vh-87px)] p-4  border-gray-200  shadow ">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="w-full h-9  flex items-center justify-start mb-4 border-b">
            <div className="pl-3 text-3xl pb-2 font-semibold text-denim">
              Forum
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            {menus.map((item, index) => (
              <button
                key={index}
                className="flex items-center p-3 rounded-full hover:bg-gray-200 w-full"
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
              onClick={() => {
                setShowAddPost(!showAddPost);
              }}
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
          ) : (
            <div className="flex items-center gap-7 py-3 px-8 ">
              <button
                onClick={() => setShowPostDetails(!showPostDetails)}
                className="p-1 text-gray-600"
              >
                <IoArrowBackOutline size={23} />
              </button>
              <p className="text-lg font-semibold">Post</p>
            </div>
          )}
        </div>
        {/* Posts */}
        {showPostDetails === false ? (
          <>
            <div className="px-8 py-4 border-b border-gray-100">
              <form className="flex  bg-white">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-400 mr-4 font-bold">
                  {getInitial(mainUser?.name)}
                </div>

                {/* Composer */}
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 text-lg outline-none resize-none focus:border-b focus:border-blue-500 transition-colors"
                    placeholder="What's happening?"
                    rows="2"
                  />

                  <div className="flex items-center justify-between mt-3">
                    {/* Action Icons */}
                    <div className="flex items-center space-x-3 text-blue-500">
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                        title="Add Image"
                      >
                        <CiImageOn size={24} />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        hidden
                      />
                      <button
                        type="button"
                        className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                        title="Add Image"
                      >
                        <PiGif size={24} />
                      </button>
                      <button
                        type="button"
                        className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                        title="Add Image"
                      >
                        <LiaPollSolid size={24} />
                      </button>
                      <div className="relative">
                        <button
                          className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPicker(!showPicker);
                          }}
                        >
                          <BsEmojiSmile size={19} />
                        </button>

                        {showPicker && (
                          <div className="absolute top-10 left-0 z-10">
                            <EmojiPicker
                              onEmojiClick={onEmojiClick}
                              width={300}
                              height={350}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                        title="Add Image"
                      >
                        <GoLocation size={19} />
                      </button>
                    </div>

                    {/* Post Button */}
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className={`px-5 py-2 text-sm font-semibold rounded-full transition 
                        ${
                          content.trim()
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-blue-300 text-white cursor-not-allowed opacity-50"
                        }`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div>
              {posts.map((post, i) => {
                const user = userMap[post.user_id];
                return (
                  <div
                    key={i}
                    onClick={() => handlePostDetails(post)}
                    className="px-8 py-4 border-y flex gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-gray-700">
                      {user ? user.name[0] : "?"}
                    </div>
                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {user ? user.name : "Unknown User"}
                        </span>
                        <span className="text-gray-400 text-xs">
                          · {getTimeAgo(post.created_at)}
                        </span>
                      </div>
                      <p>{post.subject}</p>
                      <div className="text-gray-800 text-base pt-3 pb-1">
                        {post.content}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2">
                          <FaRegHeart size={15} />
                        </div>
                        <div
                          onClick={() => handleClickComment(post)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2"
                        >
                          <FaRegComment size={15} />
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2">
                          <PiShareFatBold size={15} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex gap-3 px-9 mt-4 pt-4">
            <div className="w-11 h-11 rounded-full bg-gray-600 flex items-center justify-center font-bold">
              {getInitial(selectedPost?.user.name)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">
                  {selectedPost.user?.name}
                </span>
                <span className="text-gray-400 text-sm">
                  · {getTimeAgo(selectedPost.post.created_at)}
                </span>
              </div>

              <p className="text-lg">{selectedPost.post.subject}</p>
              <div className="text-gray-800 text-lg pt-3 pb-1">
                {selectedPost.post.content}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2">
                  <FaRegHeart size={15} />
                </div>
                <div
                  onClick={() => handleClickComment(post)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2"
                >
                  <FaRegComment size={15} />
                </div>
                <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors mr-2">
                  <PiShareFatBold size={15} />
                </div>
              </div>
              {joinComment === false ? (
                <div
                  onClick={() => setJoinComment(!joinComment)}
                  className="w-full h-10 border border-gray-300 rounded-full mt-4 flex items-center px-4"
                >
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={1}
                    className="w-full placeholder-gray-400 resize-none outline-none"
                    placeholder="Post your reply"
                  ></textarea>
                </div>
              ) : (
                <form className="w-full h-30 border border-gray-300 rounded-xl mt-4 flex flex-col items-center px-4 py-2">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full placeholder-gray-400 resize-none outline-none"
                    placeholder="Post your reply"
                  ></textarea>
                  <div className="flex item-center justify-between w-full text-denim">
                    <div className="relative">
                      <button
                        className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPicker(!showPicker);
                        }}
                      >
                        <BsEmojiSmile size={19} />
                      </button>
                      {showPicker && (
                        <div className="absolute top-10 left-0 z-10">
                          <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            width={300}
                            height={350}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setJoinComment(!joinComment)}
                        className="py-1 px-2 bg-gray-300 text-white rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1 px-2 bg-denim text-white rounded-xl "
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {selectedPost.post.comments.length === 0 ? (
  <div className="py-6 text-center text-gray-500">
    No comments yet. Be the first to comment!
  </div>
) : (
  selectedPost.post.comments.map((comment, i) => {
    console.log("Comment:", comment);
    const user = userMap[comment.user_id];
    return (
      <div
        key={i}
        className="flex gap-3 mt-2 py-4 border-b border-gray-200"
      >
        <div className="w-11 h-11 rounded-full bg-gray-600 flex items-center justify-center font-bold">
          {getInitial(user?.name)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              {user ? user.name : "Unknown User"}
            </span>
            <span className="text-gray-400 text-sm">
              · {getTimeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-lg">{comment.comment_content}</p>
        </div>
      </div>
    );
  })
)}
            </div>
          </div>
        )}
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
          <AddComment
            post={selectedPost}
            onClose={() => setShowAddComment(false)}
          ></AddComment>
        </div>
      )}
      {showAddPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <AddPost onClose={() => setShowAddPost(!showAddPost)} />
        </div>
      )}
    </div>
  );
}
