const express = require("express");
const app = express();
const PORT = 4000;
// New imports
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

let waitingUsers = [];

socketIO.on("connection", (socket) => {
  socket.on("newUser", (data) => {
    console.log(`${socket.id} user just connected!`);
    // Check if there is a waiting user to pair with
    if (waitingUsers.length > 0) {
      console.log(`${socket.id} user just got paired!`);
      const partnerSocket = waitingUsers.pop(); // Pair with the waiting user
      socket.partner = partnerSocket;
      partnerSocket.partner = socket;

      socket.emit("paired", { message: "You are paired with a random user." });
      partnerSocket.emit("paired", {
        message: "You are paired with a random user.",
      });

      // Relay messages between paired users
      socket.on("message", (message) => {
        if (socket.partner) {
          socket.partner.emit("messageResponse", message);
        }
      });

      // random user is writing now..
      socket.on("typing", (data) => {
        if (socket.partner) {
          socket.partner.emit("typingResponse", data);
        }
      });

      partnerSocket.on("message", (message) => {
        if (partnerSocket.partner) {
          partnerSocket.partner.emit("messageResponse", message);
        }
      });

      partnerSocket.on("typing", (data) => {
        if (partnerSocket.partner) {
          partnerSocket.partner.emit("typingResponse", data);
        }
      });
    } else {
      // No waiting users, add this user to the queue
      waitingUsers.push(socket);
      socket.emit("waiting", {
        message: "Waiting for another user to connect.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Remove from waiting list if not paired
    if (!socket.partner) {
      waitingUsers = waitingUsers.filter((s) => s !== socket);
    } else {
      // Inform the partner that their partner disconnected
      socket.partner.emit("newUserResponse", {
        message: "Your partner has disconnected.",
      });
      socket.partner.partner = null;
    }
  });
});

// create test get method to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

http.listen(PORT, "192.168.1.4", () => {
  console.log(`Server listening on ${PORT}`);
});
