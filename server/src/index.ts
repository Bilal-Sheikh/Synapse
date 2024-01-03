import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

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

enum ROLE {
    ADMIN = "ADMIN",
    USER = "USER",
}

interface User {
    id: string;
    username: string;
    room: string;
    role: ROLE;
}

interface UsersInRoom {
    room: string;
    users: User[];
}

let users: User[] = [];
let usersInRoom: UsersInRoom[] = [];
const currentTime = Date.now();

function sendJoined(socket: Socket, room: string, username: string) {
    socket.to(room).emit("recieve_message", {
        username: BOT,
        message: `${username} has joined the room.`,
        time: currentTime,
    });
}

function sendWelcome(socket: Socket, username: string) {
    socket.emit("recieve_message", {
        username: BOT,
        message: `Welcome ${username}`,
        time: currentTime,
    });
}

function removeUser(userId: string, roomUsers: User[]) {
    return roomUsers.filter((user) => user.id !== userId);
}

function leaveRoom(room: string, userId: string) {
    usersInRoom = usersInRoom.map((roomid) => {
        if (roomid.room === room) {
            roomid.users = removeUser(userId, roomid.users);
        }
        return roomid;
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
        // usersInRoom = users.filter((user) => user.room === room);
        usersInRoom = users.reduce((acc, user) => {
            const existingRoom = acc.find((room) => room.room === user.room);
            if (existingRoom) {
                existingRoom.users.push(user);
            } else {
                acc.push({ room: user.room, users: [user] });
            }
            return acc;
        }, [] as UsersInRoom[]);

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
        // usersInRoom = users.filter((user) => user.room === room);
        usersInRoom = users.reduce((acc, user) => {
            const existingRoom = acc.find((room) => room.room === user.room);
            if (existingRoom) {
                existingRoom.users.push(user);
            } else {
                acc.push({ room: user.room, users: [user] });
            }
            return acc;
        }, [] as UsersInRoom[]);

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
        users = removeUser(userId, users);
        socket.to(room).emit("users_in_Room", users);
        socket.to(room).emit("recieve_message", {
            username: BOT,
            message: `${username} has been kicked from the room.`,
            time: Date.now(),
        });
        socket.to(room).emit("kicked", {
            message: "You have been kicked from the room.",
        });
    });

    socket.on("leave_room", (data) => {
        const { userId, username, room } = data;

        // usersInRoom = usersInRoom.map((roomid) => {
        //     if (roomid.room === room) {
        //         roomid.users = removeUser(userId, roomid.users);
        //     }
        //     return roomid;
        // });
        socket.leave(room);
        leaveRoom(room, userId);

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
            // users = removeUser(socket.id, users);
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
