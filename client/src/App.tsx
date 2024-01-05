import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketContext } from "./providers/SocketContext";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatRoom from "./components/ChatRoom";
import io from "socket.io-client";
import { Toaster } from "sonner";
import Landing from "./components/Landing";

export default function App() {
    const BE_URL = import.meta.env.VITE_BE_URL;
    const [theme, setTheme] = useState(localStorage.getItem("theme"));
    const socket = io(BE_URL);

    return (
        <SocketContext.Provider value={socket}>
            <main
                className={`${
                    theme === "dark"
                        ? "dark text-foreground bg-background"
                        : "light text-foreground bg-background"
                }`}
            >
                <div className="min-h-screen">
                    <Router>
                        <Toaster position="top-center" />
                        <Navbar setTheme={setTheme} />
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route
                                path="/chat-room/:chat"
                                element={<ChatRoom />}
                            />
                        </Routes>
                    </Router>
                </div>
            </main>
        </SocketContext.Provider>
    );
}
