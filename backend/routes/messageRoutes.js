import express from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages, getUsersForSidbar, markMessageAsSeen } from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/user", protectRoute, getUsersForSidbar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;
