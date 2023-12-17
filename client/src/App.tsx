import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketContext } from "./providers/SocketContext";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatRoom from "./components/ChatRoom";
import io from "socket.io-client";

export default function App() {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));
    const socket = io("http://localhost:3000");

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
                        <Navbar setTheme={setTheme} />
                        <Routes>
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
