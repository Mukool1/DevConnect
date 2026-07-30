import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import { Search as SearchIcon, Users, FileText } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    if (tab === "users") {
      const res = await api.get(`/search/users?q=${encodeURIComponent(query)}`);
      setUsers(res.data.users);
    } else {
      const res = await api.get(`/search/posts?q=${encodeURIComponent(query)}`);
      setPosts(res.data.posts);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex gap-2.5 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search developers or posts..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 shadow-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 rounded-2xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 mb-6 p-1.5 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setTab("users")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              tab === "users"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Users size={16} />
            <span>Developers</span>
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              tab === "posts"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText size={16} />
            <span>Posts</span>
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Searching...</p>
          </div>
        )}

        {!loading && searched && tab === "users" && users.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No developers found matching "{query}"</p>
          </div>
        )}

        {!loading &&
          tab === "users" &&
          users.map((u) => (
            <Link
              to={`/profile/${u.username}`}
              key={u._id}
              className="flex items-center gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-3 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-200 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {u.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">@{u.username}</p>
              </div>
            </Link>
          ))}

        {!loading && searched && tab === "posts" && posts.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No posts found matching "{query}"</p>
          </div>
        )}

        {!loading &&
          tab === "posts" &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </main>
    </div>
  );
};

export default Search;

