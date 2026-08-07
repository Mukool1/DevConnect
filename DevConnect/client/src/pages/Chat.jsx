import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import { Send, ArrowLeft } from "lucide-react";

const Chat = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const profileRes = await api.get(`/users/${username}`);
      setOtherUser(profileRes.data.user);

      const messagesRes = await api.get(
        `/messages/${profileRes.data.user._id}`,
      );
      setMessages(messagesRes.data.messages);
      setLoading(false);
    };
    load();
  }, [username]);

  // Live-append incoming messages from this specific conversation
  useEffect(() => {
    if (!socket || !otherUser) return;

    const handleNewMessage = (message) => {
      if (message.sender === otherUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, otherUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !otherUser) return;

    setSending(true);
    const res = await api.post(`/messages/${otherUser._id}`, { text });
    setMessages((prev) => [...prev, res.data.message]);
    setText("");
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="max-w-xl w-full mx-auto flex flex-col flex-1 px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/messages"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
            {otherUser?.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              otherUser?.name?.[0]?.toUpperCase()
            )}
          </div>
          <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            {otherUser?.name}
          </p>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 overflow-y-auto flex flex-col gap-2 mb-4 shadow-sm dark:shadow-none min-h-[50vh] max-h-[60vh]">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400 text-center m-auto">
              No messages yet — say hello 👋
            </p>
          ) : (
            messages.map((m) => {
              const isOwn = m.sender === user._id;
              return (
                <div
                  key={m._id}
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                    isOwn
                      ? "self-end bg-indigo-600 text-white rounded-br-sm"
                      : "self-start bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 rounded-xl disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
