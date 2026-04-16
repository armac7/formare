import { createContext, useContext, useState, useEffect } from "react";
import { getMonthStatus } from "../scripts/api/getMonthStatus.js";
import { YEAR, MONTH } from "../constants.js";

const MonthStatusContext = createContext(null);

export function MonthStatusProvider({ children }) {
  const [monthData, setMonthData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMonthStatus(YEAR, MONTH + 1);
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
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MonthStatusContext.Provider value={{ monthData, loading }}>
      {children}
    </MonthStatusContext.Provider>
  );
}

export function useMonthStatus() {
  return useContext(MonthStatusContext);
}