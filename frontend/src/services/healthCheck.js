// src/services/healthCheck.js
// Pings backend — if it fails, frontend switches to offline mode.
// No MongoDB, no auth — just a simple HTTP ping.

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const TIMEOUT_MS = 4000;
const RETRY_INTERVAL_MS = 30000; // recheck every 30s

/**
 * Returns true if backend is reachable, false otherwise.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Starts a background interval that calls onStatusChange(isOnline: boolean)
 * whenever the backend status changes.
 * Returns a cleanup function — call it on component unmount.
 */
export function startHealthMonitor(onStatusChange) {
  let lastStatus = null;

  const check = async () => {
    const isOnline = await checkBackendHealth();
    if (isOnline !== lastStatus) {
      lastStatus = isOnline;
      onStatusChange(isOnline);
    }
  };

  check(); // immediate first check
  const interval = setInterval(check, RETRY_INTERVAL_MS);
  return () => clearInterval(interval);
}