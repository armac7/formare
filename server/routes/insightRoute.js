/**
 * insightRoute.js  — Backend route for AI insights using OpenAI
 *
 * Express route: POST /api/ai-insight
 * Add to .env:   OPENAI_API_KEY=sk-...
 */

import express from "express";
import OpenAI  from "openai";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/api/ai-insight", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { day, month, year, entry } = req.body;

  if (!day || !entry) {
    return res.status(400).json({ error: "Missing day or entry data" });
  }

  const prompt = buildPrompt(day, month, year, entry);

  try {
    const completion = await client.chat.completions.create({
      model:      "gpt-4o-mini", // cheap and fast, perfect for this
      max_tokens: 200,
      messages: [
        {
          role:    "system",
          content: "You are a knowledgeable and supportive women's health assistant. Provide short, warm, and actionable cycle insights based on logged data. Never diagnose or make medical claims. Keep responses to 2-3 sentences.",
        },
        {
          role:    "user",
          content: prompt,
        },
      ],
    });

    const insight = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ insight });

  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

function buildPrompt(day, month, year, entry) {
  const date = new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const lines = [`Generate a daily cycle insight for ${date} based on this logged data:`];

  if (entry.bbt)                 lines.push(`- BBT: ${entry.bbt}°F`);
  if (entry.bleeding)            lines.push(`- Bleeding: ${entry.bleeding}`);
  if (entry.mucus)               lines.push(`- Cervical mucus: ${entry.mucus}`);
  if (entry.mucusCharacteristic) lines.push(`- Mucus characteristic: ${entry.mucusCharacteristic}`);
  if (entry.symptoms?.length)    lines.push(`- Symptoms: ${entry.symptoms.join(", ")}`);
  if (entry.notes)               lines.push(`- Notes: ${entry.notes}`);

  return lines.join("\n");
}

export default router;

// ── Monthly insight route ──────────────────────────────────
router.post("/api/ai-monthly-insight", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { year, month, loggedDays, bleedingDays, avgBBT, topSymptoms, totalDays } = req.body;

  if (!year || month === undefined) {
    return res.status(400).json({ error: "Missing month data" });
  }

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prompt = [
    `Provide a warm, supportive monthly menstrual cycle summary for ${monthName} based on this data:`,
    `- Days logged: ${loggedDays} out of ${totalDays}`,
    `- Bleeding days: ${bleedingDays}`,
    avgBBT    ? `- Average BBT: ${avgBBT}°F`                      : null,
    topSymptoms?.length ? `- Most common symptoms: ${topSymptoms.join(", ")}` : null,
    `\nKeep the summary to 3-4 sentences. Be encouraging, highlight patterns, and give one practical tip for next month. Do not diagnose or make medical claims.`,
  ].filter(Boolean).join("\n");

  try {
    const completion = await client.chat.completions.create({
      model:      "gpt-4o-mini",
      max_tokens: 250,
      messages: [
        {
          role:    "system",
          content: "You are a knowledgeable and supportive women's health assistant specializing in menstrual cycle tracking. Be warm, encouraging, and concise.",
        },
        { role: "user", content: prompt },
      ],
    });

    const insight = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ insight });

  } catch (err) {
    console.error("OpenAI monthly insight error:", err);
    res.status(500).json({ error: "Failed to generate monthly insight" });
  }
});