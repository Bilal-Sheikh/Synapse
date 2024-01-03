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
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const socket = useContext(SocketContext);
    const [username, setUsername] = useState("");

    function generateRoomId(length: number) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    function createRoom() {
        if (username !== "") {
            const room = generateRoomId(15);
            socket?.emit("create_room", { username, room });
            localStorage.setItem(
                "data",
                JSON.stringify({
                    id: socket?.id,
                    role: "ADMIN",
                })
            );
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
                variant="flat"
            >
                Create Room
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
                                Create a Room
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
                                    onClick={createRoom}
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
