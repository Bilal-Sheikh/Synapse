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

export default function JoinRoom() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div>
            <Button
                onPress={onOpen}
                as={Link}
                color="primary"
                href="#"
                variant="bordered"
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
                                />
                                <Input
                                    label="RoomID"
                                    placeholder="Enter Room ID"
                                    variant="bordered"
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
                                <Button color="primary" onPress={onClose}>
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
