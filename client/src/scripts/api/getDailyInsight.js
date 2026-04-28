/**
 * getDailyInsight.js
 * Fetches an AI-generated daily insight from the backend.
 * The backend proxies to Claude — user data never goes directly to the API from the browser.
 */
export async function getDailyInsight(day, month, year, entryData) {
  try {
    const res = await fetch('/api/insights/daily', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month, year, entry: entryData }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to fetch insight');

    return data.insight; // string
  } catch (err) {
    console.error('Error fetching AI insight:', err);
    throw err;
  }
}