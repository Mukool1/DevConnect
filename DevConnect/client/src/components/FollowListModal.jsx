import { Link } from "react-router-dom";
import { X } from "lucide-react";

const FollowListModal = ({ title, users, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-2">
          {users.length === 0 ? (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
              Nobody here yet
            </p>
          ) : (
            users.map((u) => (
              <Link
                to={`/profile/${u.username}`}
                key={u._id}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shrink-0">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    u.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{u.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
