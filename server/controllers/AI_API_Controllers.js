import OpenAI  from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


function buildPrompt(day, month, year, entry) {
  const date = new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const lines = [`You are a knowledgeable and supportive Catholic women's health assistant.`, 
    `Generate a daily cycle insight for ${date} based on this logged data:`];

  if (entry.bbt)                 lines.push(`- BBT: ${entry.bbt}°F`);
  if (entry.bleeding && entry.bleeding !== "None")            lines.push(`- Bleeding: ${entry.bleeding}`);
  if (entry.mucus)               lines.push(`- Cervical mucus: ${entry.mucus}`);
  if (entry.mucusCharacteristic) lines.push(`- Mucus characteristic: ${entry.mucusCharacteristic}`);
  if (entry.symptoms?.length)    lines.push(`- Symptoms: ${entry.symptoms.join(", ")}`);
  if (entry.notes)               lines.push(`- Notes: ${entry.notes}`);

  lines.push(`\nKeep the insight to 2-3 sentences. Be warm, supportive, and practical. Do not diagnose or make medical claims. All insights should align with Catholic values and teachings, especially Theology of the Body by Pope St. John Paul II.`);

  return lines.join("\n");
}

export async function getAIDaily(req, res) {
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
};

// ── Monthly insight controller ──────────────────────────────────
export async function getAIMonthly(req, res) {
    if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // gets sent from insightRoute.js when POST /api/ai-monthly-insight is called
  const { year, month, loggedDays, bleedingDays, avgBBT, topSymptoms, totalDays } = req.body;

  // if we don't have the year or month, we can't generate a meaningful insight, so we return an error
  if (!year || month === undefined) {
    return res.status(400).json({ error: "Missing month data" });
  }

  // Convert month number to month name for a nicer prompt
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Build a prompt that includes all the relevant data, but only if it's available. We also include instructions to keep it concise and supportive.
  const prompt = [
    `Provide a warm, supportive monthly menstrual cycle summary for ${monthName} based on this data:`,
    `- Days logged: ${loggedDays} out of ${totalDays}`,
    `- Bleeding days: ${bleedingDays}`,
    avgBBT    ? `- Average BBT: ${avgBBT}°F`                      : null,
    topSymptoms?.length ? `- Most common symptoms: ${topSymptoms.join(", ")}` : null,
    `\nKeep the summary to 6-7 sentences. Be encouraging, highlight patterns, and give one practical tip for next month. Do not diagnose or make medical claims.`,
    `\nYou are a knowledgeable and supportive women's health assistant for Catholics. All insight should be aligned with Catholic values and teachings, especially Theology of the Body by Pope St. John Paul II.`,
    `\nIf there is not enough data to provide a meaninful insight, say "Not enough data for insights yet. Keep logging daily!"`,
    `\nFor all insights, provide at the end a brief encouraging Bible verse related to health or self-care, without being preachy.`
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
};