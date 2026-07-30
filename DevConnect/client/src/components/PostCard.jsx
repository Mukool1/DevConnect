import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const isLiked =
    likes.includes(user?._id) || likes.some((id) => id === user?._id);

  const handleLike = async () => {
    await api.put(`/posts/${post._id}/like`);
    setLikes((prev) =>
      isLiked ? prev.filter((id) => id !== user._id) : [...prev, user._id],
    );
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await api.post(`/posts/${post._id}/comment`, {
      text: commentText,
    });
    setComments(res.data.comments);
    setCommentText("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 mb-4 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300">
      <Link
        to={`/profile/${post.author?.username}`}
        className="flex items-center gap-3.5 mb-4 group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
          {post.author?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.author?.name}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            @{post.author?.username}
          </p>
        </div>
      </Link>

      <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </p>

      {post.codeSnippet && (
        <pre className="bg-slate-950 text-indigo-300 text-sm rounded-xl p-4 overflow-x-auto mb-4 border border-slate-800 font-mono shadow-inner">
          <code>{post.codeSnippet}</code>
        </pre>
      )}

      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
          <img
            src={post.image}
            alt="post"
            className="max-h-96 object-cover w-full hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-medium transition-all duration-200 group ${
            isLiked
              ? "text-rose-500 dark:text-rose-400"
              : "hover:text-rose-500 dark:hover:text-rose-400"
          }`}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${
            isLiked ? "bg-rose-50 dark:bg-rose-950/50" : "group-hover:bg-rose-50 dark:group-hover:bg-rose-950/50"
          }`}>
            <Heart
              size={18}
              fill={isLiked ? "currentColor" : "none"}
              className={isLiked ? "scale-110 transition-transform" : ""}
            />
          </div>
          <span>{likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 font-medium transition-all duration-200 group ${
            showComments
              ? "text-indigo-600 dark:text-indigo-400"
              : "hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${
            showComments ? "bg-indigo-50 dark:bg-indigo-950/50" : "group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50"
          }`}>
            <MessageCircle size={18} />
          </div>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          {comments.map((c) => (
            <div
              key={c._id}
              className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 text-sm border border-slate-100 dark:border-slate-800"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {c.user?.name}
              </span>{" "}
              <span className="text-slate-700 dark:text-slate-300 ml-1">{c.text}</span>
            </div>
          ))}

          <form onSubmit={handleComment} className="flex gap-2.5 mt-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a thoughtful comment..."
              className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
            >
              <Send size={15} />
              <span>Post</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;

