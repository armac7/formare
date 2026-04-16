export async function getMonthStatus(year, month) {
  try {
    const res = await fetch(
      `/api/month-info?year=${year}&month=${month}`,
      {
          method: 'GET',
          credentials: "include"
      }
    );

    const data = await res.json();
      
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch month status');
    }
    
    return data;
      
  } catch (err) {
    console.error('Error fetching month status:', err);
    throw err;
  }
}