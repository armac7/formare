/**
 * useAIInsight.js
 *
 * Hook that fetches and caches AI insights per day.
 * Caches in sessionStorage so we don't re-fetch on every render.
 *
 * Returns:
 *   insight   — string | null
 *   loading   — boolean
 *   error     — string | null
 *   refetch   — function to manually re-request
 */

import { useState, useEffect, useCallback } from "react";
import { getDailyInsight } from "../scripts/api/getDailyInsight.js";

function cacheKey(day, month, year) {
  return `formare_insight_${year}_${month}_${day}`;
}

export function useAIInsight(day, month, year, entry) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch_ = useCallback(async (force = false) => {
    // Need a day and some data to generate insight
    if (!day || !entry) return;

    const key    = cacheKey(day, month, year);
    const cached = sessionStorage.getItem(key);

    if (cached && !force) {
      setInsight(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getDailyInsight(day, month, year, entry);
      setInsight(result);
      sessionStorage.setItem(key, result);
    } catch (err) {
      setError("Could not load insight. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [day, month, year, entry]);

  // Auto-fetch when day changes
  useEffect(() => {
    setInsight(null);
    setError(null);
    fetch_();
  }, [day, month, year]);

  return { insight, loading, error, refetch: () => fetch_(true) };
}