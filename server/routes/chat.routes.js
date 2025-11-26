import { Router } from "express";
const router = Router();

import {protectedRoute} from "../middleware/authMiddleware.js"
import { getStreamToken } from "../controllers/chat-controller.js";

router.get('/token', protectedRoute ,getStreamToken)

export default router;