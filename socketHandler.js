// Export a function to initialize our Socket.IO events.

const { Notification } = require("./models/Notification");

/**
 * Socket.IO Connection Event:
 * This is where every new client connection is handled.
 * We also define events like "getNotifications", "joinRoom", etc.
 */

function socketHandler(io) {
  // Listen for new client connections.
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle "getNotifications" event.
    socket.on("getNotifications", async () => {
      try {
        // Fetch notifications from your DB, sorting them with the most recent first.
        // Here, Notification is assumed to be your Mongoose model.
        const notifications = await Notification.find().sort({
          createdAt: -1,
        });
        // Send the notifications back to the requesting client.
        socket.emit("loadNotifications", notifications);
      } catch (err) {
        console.error(err);
      }
    });

    // Handle "joinRoom" event for subscribing to a room.
    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
    });

    // Handle "leaveRoom" event.
    socket.on("leaveRoom", (roomName) => {
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room: ${roomName}`);
    });

    // Handle "markAsRead" event with an acknowledgement callback.
    socket.on("markAsRead", async (notificationId, callback) => {
      try {
        // Update the notification in the database.
        const updatedNotification = await Notification.findByIdAndUpdate(
          notificationId,
          { read: true },
          { new: true }
        );
        // Acknowledge success to the client.
        callback({ status: "success", notification: updatedNotification });
        // Optionally broadcast the updated notification to all connected clients.
        io.emit("notificationUpdated", updatedNotification);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Acknowledge failure to the client.
        callback({ status: "error", error: error.message });
      }
    });

    // Add handler for marking all notifications as read
    socket.on("markAllAsRead", async (callback) => {
      try {
        await Notification.updateMany({}, { read: true });
        const updatedNotifications = await Notification.find().sort({
          createdAt: -1,
        });
        callback({ status: "success" });
        io.emit("loadNotifications", updatedNotifications);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        callback({ status: "error", error: error.message });
      }
    });

    // Add handler for clearing all notifications
    socket.on("clearAllNotifications", async (callback) => {
      try {
        await Notification.deleteMany({});
        callback({ status: "success" });
        io.emit("loadNotifications", []);
      } catch (error) {
        console.error("Error clearing all notifications:", error);
        callback({ status: "error", error: error.message });
      }
    });

    // Log when a client disconnects.
    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`);
    });
  });
}
module.exports = socketHandler;
