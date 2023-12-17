import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Link,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../providers/SocketContext";

export default function JoinRoom() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const socket = useContext(SocketContext);

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    function joinRoom() {
        if (username !== "" && room !== "") {
            socket?.emit("join_room", { username, room });
            navigate(`/chat-room/chat?user=${username}&room=${room}`);
        }
    }

    return (
        <div>
            <Button
                onPress={onOpen}
                as={Link}
                color="primary"
                href="#"
                variant="bordered"
            >
                Join Room
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
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
