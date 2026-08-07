import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import { Bell, CheckCheck, UserPlus, Heart, MessageSquare } from "lucide-react";

const messages = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "follow":
      return <UserPlus size={16} className="text-indigo-500" />;
    case "like":
      return <Heart size={16} className="text-rose-500 fill-rose-500/20" />;
    case "comment":
      return <MessageSquare size={16} className="text-blue-500" />;
    default:
      return <Bell size={16} className="text-indigo-500" />;
  }
};

const Notifications = () => {
  const { notifications, loading, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Bell size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Notifications
            </h1>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <CheckCheck size={15} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm dark:shadow-none">
            {notifications.map((n) => (
              <Link
                to={`/profile/${n.sender?.username}`}
                key={n._id}
                className={`flex items-center gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  !n.read ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {n.sender?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-0.5 rounded-full shadow-sm">
                    {getNotificationIcon(n.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {n.sender?.name}
                    </span>{" "}
                    <span className="text-slate-600 dark:text-slate-400 ml-1">
                      {messages[n.type]}
                    </span>
                  </p>
                </div>

                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
