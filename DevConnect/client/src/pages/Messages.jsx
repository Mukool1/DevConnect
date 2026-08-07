import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { MessageCircle } from "lucide-react";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const res = await api.get("/messages/conversations");
      setConversations(res.data.conversations);
      setLoading(false);
    };
    fetchConversations();
  }, []);

  const getOtherParticipant = (conversation) =>
    conversation.participants.find((p) => p._id !== user._id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <MessageCircle size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Messages
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No conversations yet — visit a developer's profile to start one
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm dark:shadow-none">
            {conversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              if (!other) return null;

              return (
                <Link
                  to={`/messages/${other.username}`}
                  key={conversation._id}
                  className="flex items-center gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                    {other.avatar ? (
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      other.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                      {other.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {conversation.lastMessage?.text ||
                        "Start the conversation"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
