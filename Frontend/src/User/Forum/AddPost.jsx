import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { PiGif } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { LiaPollSolid } from "react-icons/lia";

export default function AddPost({ onClose }) {
    const [content, setContent] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    
    const onEmojiClick = (emoji) => {
    setContent((prev) => prev + emoji.emoji);
    setShowPicker(false);
  };
    return(
        <div className="w-[512px] bg-white px-4 pb-3 rounded-xl shadow-xl">
            <div>
            {/* Header */}
            <div className="flex items-center justify-end py-3 ">
                <button onClick={onClose} className="p-1 text-gray-40">
                    <MdClose size={22} />
                </button>
            </div>
            <div className="flex gap-3 border-b border-gray-300">
                      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                        
                      </div>
            
                      <div className="flex-1">
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={3}
                          className="w-full placeholder-gray-400 resize-none outline-none"
                          placeholder="What's happening?"
                        />
            
                        
                      </div>
                    </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
    
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
                            className={`px-5 py-2 rounded-full font-semibold text-sm transition border-t border-gray-400 ${
                              content.trim()
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-blue-500/40 text-white cursor-not-allowed"
                            }`}
                          >
                            Post
                          </button>
                        </div>
        </div>
    )
}