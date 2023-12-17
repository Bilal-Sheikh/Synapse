import {
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
} from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../providers/SocketContext";
import { useSearchParams } from "react-router-dom";

interface Message {
    message: string;
    username: string;
    time: string;
}

export default function ChatRoom() {
    const socket = useContext(SocketContext);

    if (!socket) return;
    const [searchParams] = useSearchParams();

    const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
    const [outgoingMessage, setOutgoingMessage] = useState("");
    const username = searchParams.get("user");
    const room = searchParams.get("room");
    console.log("MESSAGES::::::::::::::::::::::::::::", incomingMessages);

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
        <div className="flex h-unit-9xl w-full">
            <div className="flex flex-col w-3/4">
                <div className="flex-grow overflow-auto p-4">
                    {incomingMessages.map((message, index) => (
                        <div key={index}>
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

                <div className="w-3/4 fixed bottom-0 bg-background border-t p-5">
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
