import express from "express";
import OpenAI  from "openai";
import { getAIDaily, getAIMonthly } from "../controllers/AI_API_Controllers.js";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/api/ai-insight", getAIDaily);
router.post("/api/ai-monthly-insight", getAIMonthly);

export default router;
