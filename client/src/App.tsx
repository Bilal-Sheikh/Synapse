import { useState } from "react";
import Navbar from "./components/Navbar";

export default function App() {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    return (
        <main
            className={`${
                theme === "dark"
                    ? "dark text-foreground bg-background"
                    : "light text-foreground bg-background"
            }`}
        >
            <div className="min-h-screen">
                <Navbar setTheme={setTheme} />
            </div>
        </main>
    );
}
