import { FaTimes } from "react-icons/fa";

export default function ViewForum({ onClose, forum }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{forum.subject}</h1>
          <p className="text-sm text-gray-500 mt-1">Posted by {forum.name} on {new Date(forum.created_at).toLocaleString()}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Forum Content */}
      <div className="text-gray-700 whitespace-pre-line">
        {forum.content}
      </div>

      {/* Comments Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-2">Comments ({forum.comments.length})</h2>
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
          {forum.comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm text-gray-700">{comment.user_name}</span>
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-line">{comment.comment_content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
