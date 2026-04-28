export async function getMonthlyInsight(
    month,
    year,
    loggedDays,
    bleedingDays,
    avgBBT,
    topSymptoms,) {
    try {
        const res = await fetch("/api/insights/monthly", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                year: year,
                month: month,
                loggedDays,
                bleedingDays,
                avgBBT,
                topSymptoms,
                totalDays: new Date(year, month + 1, 0).getDate(),
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch insight");

        return data.insight; // string
    } catch (err) {
        console.error("Error fetching monthly insight:", err);
        throw err;
    }
}