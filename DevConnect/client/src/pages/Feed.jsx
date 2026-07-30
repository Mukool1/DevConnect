import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import { Sparkles, Send } from "lucide-react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    const res = await api.get("/posts/feed");
    setPosts(res.data.posts);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    await api.post("/posts", { content });
    setContent("");
    await fetchFeed();
    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <form
          onSubmit={handlePost}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 mb-8 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles size={15} />
            <span>Create a Post</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update, snippet, or thought with fellow devs..."
            rows={3}
            className="w-full bg-transparent resize-none border-none focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm leading-relaxed"
          />
          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
            <button
              type="submit"
              disabled={posting}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={15} />
              <span>{posting ? "Posting..." : "Share Post"}</span>
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading feed posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No posts yet — follow people or write your first post!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
