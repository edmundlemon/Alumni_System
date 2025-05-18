import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

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
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowPicker(!showPicker)}
                              className="p-2 text-blue-500 hover:bg-blue-900/20 rounded-full transition"
                            >
                              <BsEmojiSmile size={20} />
                            </button>
            
                            {showPicker && (
                              <div className="absolute top-[-7px] left-10 z-20">
                                <EmojiPicker
                                  onEmojiClick={onEmojiClick}
                                  theme="dark"
                                  width={300}
                                  height={300}
                                />
                              </div>
                            )}
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