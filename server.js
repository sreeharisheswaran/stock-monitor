const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "69e619a0efcf23.47266433";

app.get("/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const response = await fetch(                          // ← native fetch, no import needed
      `https://eodhd.com/api/real-time/${symbol}?api_token=${API_KEY}&fmt=json`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: `EODHD error: ${response.status}` });
    }

    const data = await response.json();
    console.log(`[${symbol}]`, data);                     // helpful debug log
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));