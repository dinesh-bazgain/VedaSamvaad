import express from "express";
import { use } from "react";
import { checkAuth, login, signUp, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/update-profile", protectRoute, updateProfile);
userRouter.post("/check", protectRoute, checkAuth);

export default userRouter;
