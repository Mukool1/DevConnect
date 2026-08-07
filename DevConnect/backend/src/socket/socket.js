import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import User from "../models/user.js";

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error("Not authorized, no cookie"));

      const parsedCookies = parseCookie(rawCookie);
      const token = parsedCookies.token;
      if (!token) return next(new Error("Not authorized, no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User no longer exists"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Not authorized, invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

export const getIO = () => io;
