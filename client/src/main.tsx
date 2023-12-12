import "./index.css";
import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<NextUIProvider>
			<App />
		</NextUIProvider>
	</React.StrictMode>
);
