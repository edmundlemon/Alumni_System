import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect } from "react";
import { PiGif } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { LiaPollSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

const getInitial = (name = "") => name.charAt(0).toUpperCase();

export default function AddComment({post, onClose, setFilteredEvents, setPosts, setConnectPost, setSelectedPost, showConnectPost}) {
  const token = Cookies.get("token")
  const userId = Cookies.get("userId")
  const { post: postV, user } = post;
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [expanded, setExpanded] = useState(false); 
  const postId = post.post.id

  const onEmojiClick = (emoji) => {
    setContent((prev) => prev + emoji.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    console.log(post.post.id);
  }, [post.id]);

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      // Try different payload structures based on common API patterns
      const payload = {
        content: content.trim(),
        // Alternative field names your API might expect:
        comment_content: content.trim(),
        discussion_id: post.post.id,
        post_id: post.post.id,
      };

      const response = await axios.post(
        `http://localhost:8000/api/create_comment/${post.post.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      toast.success("Comment submitted successfully!");

      const newComment = response.data.comment || {
        id: Date.now(), // temporary ID
        comment_content: content.trim(),
        user_id: userId,
        created_at: new Date().toISOString(),
      };

      setSelectedPost(prev => ({
        ...prev,
        post: {
          ...prev.post,
          comments: [...(prev.post.comments || []), newComment]
        }
    }));
      if(showConnectPost){
      setConnectPost(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ));
    }else{
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ));
      setFilteredEvents(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ));
    }
      // Reset form
      setContent("");
      setShowPicker(false);
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
    
    // Log the full error response for debugging
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
    }
    
    // More specific error handling
    if (error.response?.status === 401) {
      toast.error("You need to be logged in to comment");
    } else if (error.response?.status === 404) {
      toast.error("Post not found");
    } else if (error.response?.status === 422) {
      // Validation error - show specific message if available
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          "Please check your input and try again";
      toast.error(`Validation error: ${errorMessage}`);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to submit comment. Please try again.");
    }
  }
  };

  return (
      <div className="w-[512px] bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <MdClose size={22} />
          </button>
        </div>

        {/* Original Post */}
        <div className="flex gap-3 px-5 pt-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
              {getInitial(user?.name)}
            </div>
            <div className="flex-1 w-[1px] bg-gray-300 mt-1" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{user?.name}</span>
              <span className="text-gray-400 text-xs">· {postV.created_at}</span>
            </div>

            <p className="mt-2 leading-relaxed">{postV.subject}</p>

            <p className={`leading-relaxed mt-3 text-gray-800 ${!expanded ? "line-clamp-2" : ""}`}>
              {postV.content}
            </p>

            {postV.content.length > 50 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 text-sm mt-1 focus:outline-none"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
            <div className="mt-3">
              <span className="text-gray-400 text-sm">Replying to</span>
               <span className="text-blue-500 text-sm">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Reply Composer */}
        <form onSubmit={submitComment} className="flex gap-3 px-5 py-4 border-b border-gray-800">
  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
    {getInitial(user?.name)}
  </div>

  <div className="flex-1">
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows={3}
      className="w-full placeholder-gray-400 resize-none outline-none"
      placeholder="Post your reply"
    />

    <div className="flex items-center justify-between mt-3">
      {/* Action Icons */}
      <div className="flex items-center space-x-3 text-blue-500">
        <button type="button" className="hover:bg-blue-100 p-2 rounded-full" title="Add Image">
          <CiImageOn size={24} />
        </button>
        <button type="button" className="hover:bg-blue-100 p-2 rounded-full" title="GIF">
          <PiGif size={24} />
        </button>
        <button type="button" className="hover:bg-blue-100 p-2 rounded-full" title="Poll">
          <LiaPollSolid size={24} />
        </button>
        <div className="relative">
          <button
            type="button"
            className="hover:bg-blue-100 p-2 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setShowPicker(!showPicker);
            }}
          >
            <BsEmojiSmile size={19} />
          </button>
          {showPicker && (
            <div className="absolute top-10 left-0 z-10">
              <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
            </div>
          )}
        </div>
        <button type="button" className="hover:bg-blue-100 p-2 rounded-full" title="Location">
          <GoLocation size={19} />
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!content.trim()}
        className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
          content.trim()
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-blue-500/40 text-white cursor-not-allowed"
        }`}
      >
        Reply
      </button>
    </div>
  </div>
</form>

      </div>
  );
}
