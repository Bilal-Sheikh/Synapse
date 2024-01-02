import { Moon, SunMedium } from "lucide-react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
import JoinRoom from "./JoinRoom";
import { useLocation, useSearchParams } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import { Snippet } from "@nextui-org/react";

interface NavbarProps {
    setTheme: (theme: string) => void;
}

export default function App({ setTheme }: NavbarProps) {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { pathname } = location;

    return (
        <Navbar className="sticky border-b">
            <NavbarBrand className="absolute -left-28">
                <Link
                    className="text-2xl font-bold"
                    color="foreground"
                    href="/"
                >
                    Synapse
                </Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <div className="flex items-center gap-2">
                        <Button
                            isIconOnly
                            variant={
                                localStorage.getItem("theme") === "dark"
                                    ? "bordered"
                                    : "solid"
                            }
                            onClick={() => {
                                setTheme("light");
                                localStorage.setItem("theme", "light");
                            }}
                        >
                            <SunMedium size={17} />
                        </Button>

                        <Button
                            isIconOnly
                            variant={
                                localStorage.getItem("theme") === "dark"
                                    ? "solid"
                                    : "bordered"
                            }
                            onClick={() => {
                                setTheme("dark");
                                localStorage.setItem("theme", "dark");
                            }}
                        >
                            <Moon size={17} />
                        </Button>
                    </div>
                </NavbarItem>

                {pathname !== "/chat-room/chat" ? (
                    <>
                        <NavbarItem>
                            <JoinRoom />
                        </NavbarItem>
                        <NavbarItem>
                            <CreateRoom />
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        <NavbarItem className="p-10">
                            <Snippet color="primary" symbol="Room ID:">
                                {searchParams.get("room")}
                            </Snippet>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
}
