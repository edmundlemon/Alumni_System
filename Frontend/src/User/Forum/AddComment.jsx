import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { PiGif } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { LiaPollSolid } from "react-icons/lia";

const getInitial = (name = "") => name.charAt(0).toUpperCase();

export default function AddComment({ onClose, post }) {
  const { post: postV, user } = post;
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [expanded, setExpanded] = useState(false); // 👈 New state

  const onEmojiClick = (emoji) => {
    setContent((prev) => prev + emoji.emoji);
    setShowPicker(false);
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
        <div className="flex gap-3 px-5 py-4 border-b border-gray-800">
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
                          <button
                            type="button"
                            className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                            title="Add Image"
                          >
                            <CiImageOn size={24} />
                          </button>
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

              <button
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
        </div>
      </div>
  );
}
