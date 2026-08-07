import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import FollowListModal from "../components/FollowListModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UserCheck,
  UserPlus,
  Sparkles,
  Pencil,
  Camera,
  X,
  Check,
  Link2,
  Globe,
} from "lucide-react";
import { MessageCircle } from "lucide-react";

const normalizeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatar: "",
    skills: "",
    socialLinks: { github: "", linkedin: "", twitter: "", portfolio: "" },
  });

  const [listModal, setListModal] = useState(null); // "followers" | "following" | null
  const [listUsers, setListUsers] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await api.get(`/users/${username}`);
    setProfile(res.data.user);
    setForm({
      name: res.data.user.name || "",
      bio: res.data.user.bio || "",
      avatar: res.data.user.avatar || "",
      skills: (res.data.user.skills || []).join(", "),
      socialLinks: {
        github: res.data.user.socialLinks?.github || "",
        linkedin: res.data.user.socialLinks?.linkedin || "",
        twitter: res.data.user.socialLinks?.twitter || "",
        portfolio: res.data.user.socialLinks?.portfolio || "",
      },
    });
    setLoading(false);
  };

  useEffect(() => {
    setEditing(false);
    fetchProfile();
  }, [username]);

  const isOwnProfile = currentUser?.username === username;
  const isFollowing = profile?.followers?.includes(currentUser?._id);

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    if (isFollowing) {
      await api.put(`/users/unfollow/${profile._id}`);
    } else {
      await api.put(`/users/follow/${profile._id}`);
    }
    await fetchProfile();
    setFollowLoading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, avatar: res.data.url }));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile/update", {
        name: form.name,
        bio: form.bio,
        avatar: form.avatar,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        socialLinks: form.socialLinks,
      });
      await fetchProfile();
      if (refreshUser) await refreshUser();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const openList = async (type) => {
    setListModal(type);
    setListLoading(true);
    const res = await api.get(`/users/${username}/${type}`);
    setListUsers(
      type === "followers" ? res.data.followers : res.data.following,
    );
    setListLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading developer profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
              User @{username} not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none transition-all duration-300">
          {!editing ? (
            <>
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md shadow-indigo-500/20 overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {profile.name}
                    </h1>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      @{profile.username}
                    </p>
                  </div>
                </div>

                {isOwnProfile ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  >
                    <Pencil size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/messages/${profile.username}`)}
                      className="p-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      title="Message"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                        isFollowing
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700"
                          : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-indigo-500/20"
                      } disabled:opacity-50`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={16} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {profile.bio}
                </p>
              )}

              {profile.skills?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                    <Sparkles size={14} className="text-indigo-500" />
                    <span>Skills & Expertise</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 text-xs px-3 py-1.5 rounded-xl font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(profile.socialLinks?.github ||
                profile.socialLinks?.linkedin ||
                profile.socialLinks?.twitter ||
                profile.socialLinks?.portfolio) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.socialLinks?.github && (
                    <a
                      href={normalizeUrl(profile.socialLinks.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Link2 size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.socialLinks?.linkedin && (
                    <a
                      href={normalizeUrl(profile.socialLinks.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Link2 size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.socialLinks?.twitter && (
                    <a
                      href={normalizeUrl(profile.socialLinks.twitter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Link2 size={14} />
                      <span>Twitter</span>
                    </a>
                  )}
                  {profile.socialLinks?.portfolio && (
                    <a
                      href={normalizeUrl(profile.socialLinks.portfolio)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Globe size={14} />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm">
                <button
                  onClick={() => openList("following")}
                  className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {profile.following?.length || 0}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Following
                  </span>
                </button>
                <button
                  onClick={() => openList("followers")}
                  className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {profile.followers?.length || 0}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Followers
                  </span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Edit Profile
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    form.name?.[0]?.toUpperCase()
                  )}
                </div>
                <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors">
                  <Camera size={16} />
                  <span>
                    {avatarUploading ? "Uploading..." : "Change photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["github", "linkedin", "twitter", "portfolio"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={form.socialLinks[field]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: {
                            ...form.socialLinks,
                            [field]: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving || avatarUploading}
                className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>{saving ? "Saving..." : "Save changes"}</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {listModal && (
        <FollowListModal
          title={listModal === "followers" ? "Followers" : "Following"}
          users={listLoading ? [] : listUsers}
          onClose={() => setListModal(null)}
        />
      )}
    </div>
  );
};

export default Profile;
