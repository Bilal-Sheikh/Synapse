"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
let FE_URL = process.env.FE_URL;
app.use((0, cors_1.default)({ origin: FE_URL }));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: FE_URL,
    },
});
const BOT = "🤖 BOT";
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "ADMIN";
    ROLE["USER"] = "USER";
})(ROLE || (ROLE = {}));
let users = [];
let usersInRoom = [];
const currentTime = Date.now();
function sendJoined(socket, room, username) {
    socket.to(room).emit("recieve_message", {
        username: BOT,
        message: `${username} has joined the room.`,
        time: currentTime,
    });
}
function sendWelcome(socket, username) {
    socket.emit("recieve_message", {
        username: BOT,
        message: `Welcome ${username}`,
        time: currentTime,
    });
}
function removeUser(userId, roomUsers) {
    return roomUsers.filter((user) => user.id !== userId);
}
function leaveRoom(roomId, userId) {
    usersInRoom = usersInRoom.map((room) => {
        if (room.roomId === roomId) {
            room.users = removeUser(userId, room.users);
            users = removeUser(userId, users);
        }
        return room;
    });
}
io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on("join_room", (data) => {
        const { username, room } = data;
        socket.join(room);
        sendJoined(socket, room, username);
        sendWelcome(socket, username);
        users.push({ id: socket.id, username, room, role: ROLE.USER });
        usersInRoom = users.reduce((acc, user) => {
            const existingRoom = acc.find((room) => room.roomId === user.room);
            if (existingRoom) {
                existingRoom.users.push(user);
            }
            else {
                acc.push({ roomId: user.room, users: [user] });
            }
            return acc;
        }, []);
        socket.to(room).emit("users_in_Room", usersInRoom);
        socket.emit("users_in_Room", usersInRoom);
        // console.log("USERSIN ROOM:::::::::::", usersInRoom);
        // console.log("USERSSSSSSSSS:::::::::::", users);
    });
    socket.on("create_room", (data) => {
        const { username, room } = data;
        socket.join(room);
        sendJoined(socket, room, username);
        sendWelcome(socket, username);
        users.push({ id: socket.id, username, room, role: ROLE.ADMIN });
        usersInRoom = users.reduce((acc, user) => {
            const existingRoom = acc.find((room) => room.roomId === user.room);
            if (existingRoom) {
                existingRoom.users.push(user);
            }
            else {
                acc.push({ roomId: user.room, users: [user] });
            }
            return acc;
        }, []);
        socket.to(room).emit("users_in_Room", usersInRoom);
        socket.emit("users_in_Room", usersInRoom);
    });
    socket.on("send_message", (data) => {
        const { room } = data;
        io.in(room).emit("recieve_message", data);
    });
    socket.on("is_typing", (data) => {
        const { username, room } = data;
        socket.to(room).emit("user_typing", { username });
    });
    socket.on("kick_user", (data) => {
        const { userId, username, room } = data;
        if (userId) {
            const clientSocket = io.sockets.sockets.get(userId);
            // console.log("Client socket: ", clientSocket);
            if (clientSocket) {
                leaveRoom(room, userId);
                socket.to(room).emit("kicked", { userId, username, room });
                socket.to(room).emit("users_in_Room", usersInRoom);
                socket.emit("users_in_Room", usersInRoom);
                clientSocket.disconnect(true);
                console.log("Disconnected client: " + userId);
            }
            else {
                console.log("Client not found");
            }
        }
    });
    socket.on("leave_room", (data) => {
        const { userId, username, room } = data;
        leaveRoom(room, userId);
        socket.leave(room);
        socket.to(room).emit("users_in_Room", usersInRoom);
        socket.to(room).emit("recieve_message", {
            username: BOT,
            message: `${username} has left the room.`,
            time: Date.now(),
        });
    });
    socket.on("disconnect", () => {
        const user = users.find((user) => user.id == socket.id);
        if (user) {
            leaveRoom(user.room, user.id);
            socket.to(user.room).emit("users_in_Room", usersInRoom);
            socket.to(user.room).emit("recieve_message", {
                username: BOT,
                message: `${user.username} has disconnected from the chat.`,
                time: Date.now(),
            });
        }
    });
});
server.listen(PORT, () => `Server is running on port ${PORT}`);
