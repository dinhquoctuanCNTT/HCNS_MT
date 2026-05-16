import { getDashboardStats, getPendingCounts, getLatestRequests } from "./dashboard.service.js";

export async function getStats(req, res) {
  try {
    const { date, from, branchId, status } = req.query;
    const stats = await getDashboardStats(date || from, branchId, status);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPendingCount(_req, res) {
  try {
    const counts = await getPendingCounts();
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function latestRequests(req, res) {
  try {
    const data = await getLatestRequests(parseInt(req.query.limit) || 5);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
