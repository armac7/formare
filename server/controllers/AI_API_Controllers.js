import OpenAI  from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* 
* buildPrompt(day, month, year, entry)
* 
* purpose: Constructs a prompt string for the OpenAI API based on the user's logged
* menstrual cycle data for a specific day. The prompt is designed to elicit a warm,
* supportive, and practical insight about the user's cycle for that day, while ensuring
* that the response aligns with Catholic values and teachings.
*
* @param {number} day - The day of the month (1-31) for which the insight is being generated.
* @param {number} month - The month for which the insight is being generated.
* @param {number} year - The year for which the insight is being generated.
* @param {Object} entry - The logged menstrual cycle data for the specified day.
*/ 
function buildPrompt(day, month, year, entry) {
  // Convert the date to a more human-friendly format for the prompt
  const date = new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // Start building the prompt with a clear instruction and the date
  const lines = [`You are a knowledgeable and supportive Catholic women's health assistant.`, 
    `Generate a daily cycle insight for ${date} based on this logged data:`];

  if (entry.bbt)                 lines.push(`- BBT: ${entry.bbt}°F`);
  if (entry.bleeding && entry.bleeding !== "None")            lines.push(`- Bleeding: ${entry.bleeding}`);
  if (entry.mucus)               lines.push(`- Cervical mucus: ${entry.mucus}`);
  if (entry.mucusCharacteristic) lines.push(`- Mucus characteristic: ${entry.mucusCharacteristic}`);
  if (entry.symptoms?.length)    lines.push(`- Symptoms: ${entry.symptoms.join(", ")}`);
  if (entry.notes)               lines.push(`- Notes: ${entry.notes}`);

  // Add instructions to keep the insight concise, warm, and aligned with Catholic values
  lines.push(`\nKeep the insight to 2-3 sentences. Be warm, supportive, and practical. Do not diagnose or make medical claims. All insights should align with Catholic values and teachings, especially Theology of the Body by Pope St. John Paul II.`);

  return lines.join("\n");
}

/* 
* getAIDaily(req, res)
* 
* purpose: Generates a daily menstrual cycle insight using the OpenAI API based on the user's logged data.
* 
* @param {Object} req - The request object containing the day, month, year, and entry data.
* @param {Object} res - The response object for sending the generated insight.
*/
export async function getAIDaily(req, res) {
  // Check if the user is authenticated by verifying the session. If not, return a 401 Unauthorized response.
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Destructure the request body
  const { day, month, year, entry } = req.body;

  // If we don't have the necessary data to generate an insight, return a 400 Bad Request response with an error message.
  if (!day || !entry) {
    return res.status(400).json({ error: "Missing day or entry data" });
  }

  // Build the prompt for the OpenAI API using the provided data
  const prompt = buildPrompt(day, month, year, entry);

  // Call the OpenAI API to generate a completion based on the prompt.
  try {
    // We use the gpt-4o-mini model, which is a cost-effective option for generating insights. We set a max token limit to ensure concise responses.
    const completion = await client.chat.completions.create({
      model:      "gpt-4o-mini", // cheap and fast, perfect for this
      max_tokens: 200,
      // We structure the messages to include a system message that sets the assistant's role and a user message that contains the prompt with the logged data.
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

    // Extract the generated insight from the API response.
    const insight = completion.choices[0]?.message?.content?.trim() ?? "";
    // Send the generated insight back to the client as a JSON response.
    res.json({ insight });

  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "Failed to generate insight" });
  }
};

/* 
* getAIMonthly(req, res)
*
* purpose: Generates a monthly menstrual cycle insight using the OpenAI API based on the user's logged data for the month.
* param {Object} req - The request object containing the year, month, and aggregated cycle data for the month.
* param {Object} res - The response object for sending the generated monthly insight.
*/
export async function getAIMonthly(req, res) {
    if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // gets sent from insightRoute.js 
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