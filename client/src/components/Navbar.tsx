import { Moon, SunMedium } from "lucide-react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";

interface NavbarProps {
    setTheme: (theme: string) => void;
}

export default function App({ setTheme }: NavbarProps) {
    return (
        <Navbar>
            <NavbarBrand className="-ml-36">
                <p className="text-2xl font-bold">Synapse</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end" className="flex -mr-40 gap-7">
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
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
