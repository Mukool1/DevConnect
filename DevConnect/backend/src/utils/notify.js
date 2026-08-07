import Notification from "../models/notification.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";

export const createAndEmitNotification = async ({
  recipient,
  sender,
  type,
  post,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
  });

  const populated = await notification.populate([
    { path: "sender", select: "name username avatar" },
    { path: "post", select: "content" },
  ]);

  const io = getIO();
  const receiverSocketId = getReceiverSocketId(recipient.toString());
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newNotification", populated);
  }

  return notification;
};
