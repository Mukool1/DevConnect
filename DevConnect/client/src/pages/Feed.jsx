import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import { Sparkles, Send, Image as ImageIcon, X } from "lucide-react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFeed = async () => {
    setLoading(true);
    const res = await api.get("/posts/feed");
    setPosts(res.data.posts);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setPosting(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        setUploadingImage(true);
        const data = new FormData();
        data.append("image", imageFile);
        const uploadRes = await api.post("/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
        setUploadingImage(false);
      }

      await api.post("/posts", { content, image: imageUrl });
      setContent("");
      clearImage();
      await fetchFeed();
    } finally {
      setPosting(false);
    }
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

          {imagePreview && (
            <div className="relative mt-2 mb-1 inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="max-h-56 rounded-xl border border-slate-200 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-md hover:bg-slate-700"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
            <label className="cursor-pointer flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ImageIcon size={18} />
              <span>Photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={posting}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={15} />
              <span>
                {uploadingImage
                  ? "Uploading..."
                  : posting
                    ? "Posting..."
                    : "Share Post"}
              </span>
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
