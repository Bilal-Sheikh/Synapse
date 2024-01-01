import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const BOT = "🤖 BOT";

interface User {
    id: string;
    username: string;
    room: string;
}

let users: User[] = [];
let usersInRoom: User[] = [];

function leaveRoom(userId: string, roomUsers: User[]) {
    return roomUsers.filter((user) => user.id !== userId);
}

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    // Add user to room
    socket.on("join_room", (data) => {
        const { username, room } = data;
        socket.join(room);

        const currentTime = Date.now(); // Send message to all clients in that specific room
        socket.to(room).emit("recieve_message", {
            username: BOT,
            message: `${username} has joined the room.`,
            time: currentTime,
        });

        // Send welcome message to single user
        socket.emit("recieve_message", {
            username: BOT,
            message: `Welcome ${username}`,
            time: currentTime,
        });

        users.push({ id: socket.id, username, room });
        usersInRoom = users.filter((user) => user.room === room);
        socket.to(room).emit("users_in_Room", usersInRoom);
        socket.emit("users_in_Room", usersInRoom);

        // console.log(":USER:::::::::::::::::::::::", users);
        // console.log("INROOM::::::::::::::::::::::", usersInRoom);
    });

    socket.on("send_message", (data) => {
        const { room } = data;
        io.in(room).emit("recieve_message", data);
    });

    socket.on("leave_room", (data) => {
        const { username, room } = data;
        socket.leave(room);
        users = leaveRoom(socket.id, users);
        socket.to(room).emit("users_in_Room", users);
        socket.to(room).emit("recieve_message", {
            username: BOT,
            message: `${username} has left the room.`,
            time: Date.now(),
        });
    });

    socket.on("disconnect", () => {
        const user = users.find((user) => user.id == socket.id);
        if (user) {
            users = leaveRoom(socket.id, users);
            socket.to(user.room).emit("users_in_Room", users);
            socket.to(user.room).emit("recieve_message", {
                username: BOT,
                message: `${user.username} has disconnected from the chat.`,
                time: Date.now(),
            });
        }
    });
});

server.listen(PORT, () => `Server is running on port ${PORT}`);
