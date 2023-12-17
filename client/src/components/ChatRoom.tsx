import { Avatar, Button, Card, CardBody, Input } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../providers/SocketContext";
import { useSearchParams } from "react-router-dom";
import { ArrowDown } from "lucide-react";

interface Message {
    message: string;
    username: string;
    time: string;
}

export default function ChatRoom() {
    const socket = useContext(SocketContext);
    if (!socket) return;

    const ref = useRef<HTMLDivElement>(null);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    console.log(isScrollingUp);

    const [searchParams] = useSearchParams();
    const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
    const [outgoingMessage, setOutgoingMessage] = useState("");
    const username = searchParams.get("user");
    const room = searchParams.get("room");
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

        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

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
        <div className="flex h-[569px] w-full">
            <div className="flex flex-col w-3/4">
                <div className="flex-grow overflow-auto p-4">
                    {incomingMessages.map((message, index) => (
                        <div ref={ref} key={index}>
                            {message.username === username ? (
                                <div className="flex items-end gap-2 justify-end pt-4">
                                    <div className="rounded-lg bg-blue-500 text-white p-2">
                                        <div className="flex justify-between text-xs pb-1">
                                            <p className="mr-2">
                                                {message.username}
                                            </p>
                                            <p>{formatTime(message.time)}</p>
                                        </div>
                                        <p className="text-sm">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-end gap-2 pt-4">
                                    <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
                                        <div className="flex justify-between text-xs pb-1">
                                            <p className="mr-2">
                                                {message.username}
                                            </p>
                                            <p>{formatTime(message.time)}</p>
                                        </div>
                                        <p className="text-sm">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-28 left-1/3">
                    {isScrollingUp && (
                        <Button
                            isIconOnly
                            className="relative -left-1/3 rounded-full"
                            onClick={handleScrollDown}
                        >
                            <ArrowDown size={17} />
                        </Button>
                    )}
                </div>
                <div className="w-3/4 fixed bottom-0  border-t p-5">
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
            <div className="w-1/4 p-4 border-l overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Users</h2>
                <div className="">
                    <div className="space-y-2">
                        <Card>
                            <CardBody>
                                <div className="flex gap-2">
                                    <Avatar className="w-6 h-6" />
                                    <h3 className="font-bold">User 1</h3>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
