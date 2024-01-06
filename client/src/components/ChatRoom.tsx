import {
    Avatar,
    Button,
    Card,
    CardBody,
    Input,
    Snippet,
} from "@nextui-org/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../providers/SocketContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowDown,
    LogOut,
    MoreHorizontal,
    SendHorizontal,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react";

interface Message {
    message: string;
    username: string;
    time: string;
}

interface Users {
    id: string;
    room: string;
    username: string;
    role: string;
}

interface UsersInRoom {
    roomId: string;
    users: Users[];
}

export default function ChatRoom() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    if (!socket) return;

    const data = localStorage.getItem("data");
    let role: string;
    if (data) {
        const parsedData = JSON.parse(data);
        role = parsedData.role;
    }

    const ref = useRef<HTMLDivElement>(null);
    const [isScrollingUp, setIsScrollingUp] = useState(false);

    const [searchParams] = useSearchParams();
    const username = searchParams.get("user");
    const room = searchParams.get("room");

    const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
    const [outgoingMessage, setOutgoingMessage] = useState("");
    const [usersInRoom, setUsersInRoom] = useState<UsersInRoom>();

    const [typingUser, setTypingUser] = useState("");
    setTimeout(() => {
        setTypingUser("");
    }, 5000);

    // console.log("USERS:::::::::::::::::::", usersInRoom);
    // console.log("MESSAGES::::::::::::::::", incomingMessages);

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
            if (data.username === "🤖 BOT") {
                return toast(data.message);
            } else {
                setIncomingMessages((prevMesaages) => [
                    ...prevMesaages,
                    {
                        message: data.message,
                        username: data.username,
                        time: data.time,
                    },
                ]);
            }
        });

        socket.on("users_in_Room", (data: UsersInRoom[]) => {
            const currentRoom = data.find(
                (currRoom) => currRoom.roomId === room
            );
            setUsersInRoom(currentRoom);
        });

        socket.on("user_typing", (data) => {
            setTypingUser(data.username);
        });

        socket.on("kicked", (data) => {
            const { userId, username } = data;
            if (userId === socket.id) {
                toast(`You have been kicked from the room by ${username}.`);
                navigate("/");
            }
        });

        return () => {
            socket.off("recieve_message");
            socket.off("users_in_Room");
            socket.off("user_typing");
            socket.off("kicked");
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
            setTypingUser("");
            setOutgoingMessage("");
        }
    }

    function handleLeaveRoom() {
        socket?.emit("leave_room", {
            userId: socket.id,
            username: username,
            room: room,
        });
        navigate("/");
    }

    function handleKick(userId: string) {
        socket?.emit("kick_user", {
            userId: userId,
            username: username,
            room: room,
        });
    }

    const isTyping = useCallback(() => {
        socket?.emit("is_typing", {
            username: username,
            room: room,
        });
    }, []);

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
            <div className="flex flex-col w-full md:w-3/4">
                <div className="fixed top-3 left-72 z-40 block md:hidden">
                    <Button variant="solid" isIconOnly onClick={onOpen}>
                        <Users size={17} />
                    </Button>

                    <Modal
                        backdrop="blur"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        placement="center"
                        className="h-[500px] overflow-auto"
                    >
                        <ModalContent>
                            <ModalHeader className="flex flex-wrap gap-1">
                                <div>Users {usersInRoom?.users.length}</div>
                                <div>
                                    <Snippet
                                        color="primary"
                                        symbol="Room ID:"
                                        size="sm"
                                    >
                                        {searchParams.get("room")}
                                    </Snippet>
                                </div>
                                <div>
                                    <Button
                                        onClick={handleLeaveRoom}
                                        variant="solid"
                                        color="danger"
                                        isIconOnly
                                    >
                                        <LogOut size={17} />
                                    </Button>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {usersInRoom?.users.map((user, index) => (
                                    <Card key={index}>
                                        <CardBody>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Avatar className="w-6 h-6" />
                                                    <h3 className="font-bold">
                                                        {user.role ===
                                                            "ADMIN" && (
                                                            <>
                                                                <span className="mr-1">
                                                                    👑
                                                                </span>
                                                            </>
                                                        )}
                                                        {user.username}
                                                    </h3>
                                                </div>
                                                <div>
                                                    {role === "ADMIN" &&
                                                        user.role !==
                                                            "ADMIN" && (
                                                            <Dropdown>
                                                                <DropdownTrigger>
                                                                    <Button
                                                                        variant="light"
                                                                        isIconOnly
                                                                    >
                                                                        <MoreHorizontal />
                                                                    </Button>
                                                                </DropdownTrigger>
                                                                <DropdownMenu aria-label="Static Actions">
                                                                    <DropdownItem
                                                                        key="delete"
                                                                        className="text-danger"
                                                                        color="danger"
                                                                        onClick={() => {
                                                                            handleKick(
                                                                                user.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        Kick
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        )}
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </div>

                <div className="flex-grow overflow-auto p-4 h-[500px] md:h-auto">
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

                <div className="w-full md:w-3/4 fixed bottom-0 bg-background p-5">
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
                                isTyping();
                            }}
                            value={outgoingMessage}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            onClick={sendMessage}
                            variant="light"
                            className="py-7"
                        >
                            <SendHorizontal size={25} />
                        </Button>
                    </div>
                    {typingUser && (
                        <p className="text-base mt-2 italic">
                            {typingUser} is typing...
                        </p>
                    )}
                </div>
            </div>

            <div className="hidden md:block w-1/4 p-4 border-l">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Users: {usersInRoom?.users.length}
                    </h2>
                    <div>
                        <Button
                            onClick={handleLeaveRoom}
                            variant="solid"
                            color="danger"
                        >
                            Leave
                        </Button>
                    </div>
                </div>
                <div className="border-t p-2 pt-3 xl:h-[500px] overflow-auto">
                    <div className="space-y-2">
                        {usersInRoom?.users.map((user, index) => (
                            <Card key={index}>
                                <CardBody>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Avatar className="w-6 h-6" />
                                            <h3 className="font-bold">
                                                {user.role === "ADMIN" && (
                                                    <>
                                                        <span className="mr-1">
                                                            👑
                                                        </span>
                                                    </>
                                                )}
                                                {user.username}
                                            </h3>
                                        </div>
                                        <div>
                                            {role === "ADMIN" &&
                                                user.role !== "ADMIN" && (
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button
                                                                variant="light"
                                                                isIconOnly
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Static Actions">
                                                            <DropdownItem
                                                                key="delete"
                                                                className="text-danger"
                                                                color="danger"
                                                                onClick={() => {
                                                                    handleKick(
                                                                        user.id
                                                                    );
                                                                }}
                                                            >
                                                                Kick
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                )}
                                        </div>
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
