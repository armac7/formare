import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMonthStatus } from "../scripts/api/getMonthStatus.js";
import { YEAR, MONTH } from "../constants.js";

const MonthStatusContext = createContext(null);

export function MonthStatusProvider({ children }) {
  const [monthData, setMonthData] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (year, month) => {
    setLoading(true);
    try {
      const data = await getMonthStatus(year, month + 1);

      if (data.empty) {
        // console.log("No data returned for month status:", data.message);
        setMonthData({});
        return;
      } else {
        // console.log("Processing month status data:", data);
        const map = {};
        data.forEach(entry => {
          const day = Number(entry.date.split("-")[2]);
          map[day] = {
            ...entry,
            symptoms: typeof entry.symptoms === "string" && entry.symptoms.trim()
              ? entry.symptoms.split(",").map(s => s.trim())
              : [],
          };
        });
        setMonthData(map);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(YEAR, MONTH);
  }, [load]);

  return (
    <MonthStatusContext.Provider value={{ monthData, loading, loadMonth: load }}>
      {children}
    </MonthStatusContext.Provider>
  );
}

export function useMonthStatus() {
  return useContext(MonthStatusContext);
}