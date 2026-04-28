export async function getMonthStatus(year, month) {
  try {
    const res = await fetch(
      `/api/body-status/${year}/${month}`,
      {
          method: 'GET',
          credentials: "include"
      }
    );

    const data = await res.json();
      
    return data;
      
  } catch (err) {
    console.error('Error fetching month status:', err);
    throw err;
  }
}