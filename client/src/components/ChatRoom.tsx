import { Avatar, Button, Card, CardBody, Input } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../providers/SocketContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDown } from "lucide-react";

interface Message {
    message: string;
    username: string;
    time: string;
}

interface Users {
    id: string;
    room: string;
    username: string;
}

export default function ChatRoom() {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    if (!socket) return;

    const ref = useRef<HTMLDivElement>(null);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    // console.log(isScrollingUp);

    const [searchParams] = useSearchParams();
    const username = searchParams.get("user");
    const room = searchParams.get("room");
    const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
    const [outgoingMessage, setOutgoingMessage] = useState("");
    const [usersInRoom, setUsersInRoom] = useState<Users[]>([]);

    // console.log("USERS::::::::::::::::::::::::::::", usersInRoom);
    // console.log("MESSAGES::::::::::::::::::::::::::::", incomingMessages);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsScrollingUp(!entry.isIntersecting);
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        if (isScrollingUp === false) {
            handleScrollDown();
        }

        return () => observer.disconnect();
    }, [incomingMessages]);

    function handleScrollDown() {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "instant" });
        }
    }

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            setIncomingMessages((prevMesaages) => [
                ...prevMesaages,
                {
                    message: data.message,
                    username: data.username,
                    time: data.time,
                },
            ]);
        });

        socket.on("users_in_Room", (data) => {
            setUsersInRoom(data);
        });

        return () => {
            socket.off("recieve_message");
            socket.off("users_in_Room");
        };
    }, [socket]);

    function handleLeaveRoom() {
        socket?.emit("leave_room", {
            username: username,
            room: room,
        });
        navigate("/");
    }

    function sendMessage() {
        if (outgoingMessage.trim().length > 0) {
            const currentTime = Date.now();
            socket?.emit("send_message", {
                username: username,
                room: room,
                message: outgoingMessage,
                time: currentTime,
            });
            setOutgoingMessage("");
        }
    }

    const formatTime = useCallback((time: string) => {
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedHours = hours % 12 || 12;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
        return formattedTime;
    }, []);

    return (
        <div className="flex xl:h-[540px] w-full">
            <div className="flex flex-col w-3/4">
                <div className="flex-grow overflow-auto p-4">
                    {incomingMessages.map((message, index) => (
                        <div ref={ref} key={index}>
                            {message.username === username ? (
                                <div className="flex items-end gap-2 justify-end pt-4">
                                    <div className="rounded-lg bg-blue-500 text-white p-2">
                                        <div className="flex justify-between text-xs pb-1">
                                            <p className="mr-2 font-bold border-b">
                                                {message.username}
                                            </p>
                                            <p>{formatTime(message.time)}</p>
                                        </div>
                                        <div className="max-w-2xl">
                                            <p className="text-sm overflow-hidden">
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-end gap-2 pt-4">
                                    <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
                                        <div className="flex justify-between text-xs pb-1">
                                            <p className="mr-2 font-bold border-b">
                                                {message.username}
                                            </p>
                                            <p>{formatTime(message.time)}</p>
                                        </div>
                                        <div className="max-w-2xl">
                                            <p className="text-sm overflow-hidden">
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-3/4 fixed bottom-0 bg-background border-t p-5">
                    <div className="absolute -top-20 left-1/2">
                        {isScrollingUp && (
                            <Button
                                isIconOnly
                                className="relative -left-1/2 rounded-full"
                                onClick={handleScrollDown}
                            >
                                <ArrowDown size={17} />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Type your message here"
                            onChange={(e) => {
                                setOutgoingMessage(e.target.value);
                            }}
                            value={outgoingMessage}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>
                </div>
            </div>

            <div className="w-1/4 p-4 border-l">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Users</h2>
                    <Button
                        onClick={handleLeaveRoom}
                        variant="solid"
                        color="danger"
                    >
                        Leave
                    </Button>
                </div>
                <div className="border-t p-2 pt-3 xl:h-[500px] overflow-auto">
                    <div className="space-y-2">
                        {usersInRoom.map((user, index) => (
                            <Card key={index}>
                                <CardBody>
                                    <div className="flex gap-2">
                                        <Avatar className="w-6 h-6" />
                                        <h3 className="font-bold">
                                            {user.username}
                                        </h3>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
