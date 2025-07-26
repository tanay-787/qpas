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

app.use(compression());

// // Configure CORS
// const allowedOrigins = [
//   'http://localhost:3000', // Your local frontend development server
//   'https://qpas.vercel.app', // Your Vercel production domain
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//API Routes
app.use("/api/institutions", institutionRoutes);
app.use("/api/waiting-lobby", waitingLobbyRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/members", memberRoutes)
app.use("/api/n8n", n8nRoutes)
app.use("/api/profile", profileRoutes);

//keep alive mechanism
app.get("/api/health", (req, res) => {
  try {
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Service Unavailable");
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

export default app;