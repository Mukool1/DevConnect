import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { UserCheck, UserPlus, Sparkles } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await api.get(`/users/${username}`);
    setProfile(res.data.user);
    setLoading(false);
  };

  useEffect(() => {
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
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md shadow-indigo-500/20">
                {profile.name?.[0]?.toUpperCase()}
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

            {!isOwnProfile && (
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

          <div className="flex gap-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {profile.following?.length || 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {profile.followers?.length || 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Followers</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
