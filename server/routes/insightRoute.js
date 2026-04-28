import express from "express";
import OpenAI  from "openai";
import { getAIDaily, getAIMonthly } from "../controllers/AI_API_Controllers.js";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/api/insights/daily", getAIDaily);
router.post("/api/insights/monthly", getAIMonthly);

export default router;
