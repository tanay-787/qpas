import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes
import institutionRoutes from "./routes/institutionRoutes.js";
import waitingLobbyRoutes from "./routes/waitingLobbyRoutes.js";
import questionPaperRoutes from "./routes/questionPaperRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import n8nRoutes from "./routes/n8nRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(compression());

app.use(cors());

app.use(express.static(join(__dirname, "../frontend/dist"))); // Serve the built static files of the React app
app.use("/assets", express.static(join(__dirname, "../frontend/assets")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//API Routes
app.use("/api/institutions", institutionRoutes);
app.use("/api/waiting-lobby", waitingLobbyRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/members", memberRoutes)
app.use("/api/n8n", n8nRoutes)
app.use("api/profile", profileRoutes);

//keep alive mechanism
app.get("/health", (req, res) => {
  try {
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Service Unavailable");
  }
});

// Handle all other routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../frontend/dist", "index.html"));
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
