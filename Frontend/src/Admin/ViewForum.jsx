import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

export default function ViewForum({ onClose, forum }) {
  const token = Cookies.get("adminToken"); // Adjust token key if needed
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(forum.comments || []);
  }, [forum.comments]);

  const handleDeleteComment = async (commentID) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_comment/${commentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Comment deleted successfully");
      setComments((prev) => prev.filter((comment) => comment.id !== commentID));
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md h-full space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{forum.subject}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Posted by {forum.name} on {new Date(forum.created_at).toLocaleString()}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500">
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Forum Content */}
      <div className="text-gray-700 whitespace-pre-line">{forum.content}</div>

      {/* Comments Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          Comments ({comments.length})
        </h2>
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm text-gray-700">{comment.user_name}</span>
                <MdDeleteOutline
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-500 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-800 text-sm whitespace-pre-line">
                  {comment.comment_content}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
