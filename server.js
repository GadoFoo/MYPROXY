import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow all origins (you can restrict to your Netlify domain later)
app.use(cors({ origin: "*" }));

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing query parameter" });

    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&no_html=1`;
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
