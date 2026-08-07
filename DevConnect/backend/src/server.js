import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./utils/db.js";
import { initSocket } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
