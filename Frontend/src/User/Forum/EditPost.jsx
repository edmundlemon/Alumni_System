import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { PiGif } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { LiaPollSolid } from "react-icons/lia";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function EditPost({ onClose, post, setOwnPost}) {
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postForm, setPostForm] = useState({
    photo: post ? post.photo : null,
    subject: post ? post.subject : null,
    content: post ? post.content : null
  });
  const token = Cookies.get("token");

  useEffect(() => {
    console.log(post);
  }, [post]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostForm(prev => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", postForm.subject);
    formData.append("content", postForm.content);
    formData.append("_method", "PUT");
    if (postForm.photo) {
      formData.append("photo", postForm.photo);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/edit_discussion/${post.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post submitted successfully!");
      const newPost = response.data.discussion;
      setOwnPost((prev) =>
        prev.map((p) => (p.id === newPost.id ? newPost : p))
        );
      fileInputRef.current.value = null;
      onClose(); 
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to submit post.");
    }
  };

  const onEmojiClick = (emoji) => {
    setPostForm(prev => ({
      ...prev,
      content: prev.content + emoji.emoji
    }));
    setShowPicker(false);
  };

  return (
    <div className="w-[512px] bg-white px-4 pb-3 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center border-b pr-2 -mx-4 mb-4 pb-2 justify-end pt-3">
        <button onClick={onClose} className="p-1 text-gray-400">
          <MdClose size={22} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={submitPost}>
        <div className="flex gap-3 border-b border-gray-300 pb-4">
          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
            {/* Optionally show initials */}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={postForm.subject}
              onChange={(e) => setPostForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject (e.g., Event Title or Topic)"
              className="w-full mb-2 text-lg font-medium border-b border-gray-200 focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <textarea
              value={postForm.content}
              onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
              className="w-full placeholder-gray-400 focus:border-b focus:border-blue-500  resize-none outline-none"
              placeholder="What's happening?"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative w-max">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-60 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPostForm(prev => ({ ...prev, photo: null }));
                    setImagePreview(null);
                    fileInputRef.current.value = null;
                  }}
                  className="absolute top-1 right-1 bg-white px-2 py-1 rounded-full shadow hover:bg-red-100"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3 text-denim">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="hover:bg-blue-100 p-2 rounded-full"
              title="Add Image"
            >
              <CiImageOn size={24} />
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button type="button" className="hover:bg-blue-100 p-2 rounded-full">
              <PiGif size={24} />
            </button>
            <button type="button" className="hover:bg-blue-100 p-2 rounded-full">
              <LiaPollSolid size={24} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPicker(!showPicker);
                }}
                className="hover:bg-blue-100 p-2 rounded-full"
              >
                <BsEmojiSmile size={19} />
              </button>
              {showPicker && (
                <div className="absolute top-10 left-0 z-10">
                  <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
                </div>
              )}
            </div>
            <button type="button" className="hover:bg-blue-100 p-2 rounded-full">
              <GoLocation size={19} />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!postForm.subject.trim() || !postForm.content.trim()}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
              postForm.subject.trim() && postForm.content.trim()
                ? "bg-denim hover:bg-blue-600 text-white"
                : "bg-blue-500/40 text-white cursor-not-allowed"
            }`}
          >
            Save & Change
          </button>
        </div>
      </form>
    </div>
  );
}
