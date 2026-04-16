export async function saveMonthStatus(monthData) {
    try {
        // console.log("Saving month status: ", monthData);
        const res = await fetch('/api/bodystatus', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ monthData })
        });

        if (!res.ok) throw new Error("Failed to save month status");
    } catch (err) {
        console.error("(saveMonthStatus backend function) Error saving month status: ", err);
    }
};