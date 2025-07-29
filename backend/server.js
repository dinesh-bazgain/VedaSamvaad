import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import { connect } from "http2";

// create express application
const app = express();
const server = http.createServer(app);

// middleware setup
app.use(express.json({ limit: "5mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is running");
});

// connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
