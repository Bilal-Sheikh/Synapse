import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../providers/SocketContext";

export default function JoinRoom({
    buttonSize,
}: {
    buttonSize?: "sm" | "md" | "lg";
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const socket = useContext(SocketContext);

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    function joinRoom() {
        if (username !== "" && room !== "") {
            socket?.emit("join_room", { username, room });
            // const expirationTime = Date.now() + 10 * 60 * 1000;
            localStorage.setItem(
                "data",
                JSON.stringify({ id: socket?.id, ban: false, role: "USER" })
            );
            navigate(`/chat-room/chat?user=${username}&room=${room}`);
        }
    }

    return (
        <div>
            <Button
                onPress={onOpen}
                color="primary"
                variant="bordered"
                className="rounded-full"
                size={buttonSize}
            >
                Join Room
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Join a Room
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Username"
                                    placeholder="Enter your username"
                                    variant="bordered"
                                    minLength={5}
                                    maxLength={15}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <Input
                                    label="Room"
                                    placeholder="Enter Room ID"
                                    variant="bordered"
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={onClose}
                                    onClick={joinRoom}
                                >
                                    Join
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
