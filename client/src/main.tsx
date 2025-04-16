import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "ProcrastiTimer - Balance Work & Play";

createRoot(document.getElementById("root")!).render(<App />);
