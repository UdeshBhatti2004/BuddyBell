import {Router} from "express";
import axios from "axios";

const router = Router();

router.get("/themes", async (req, res) => {
  try {
    const response = await axios.post(
      "http://colormind.io/api/",
      { model: "ui" },   // use correct payload
      { headers: { "Content-Type": "application/json" } } // ensure JSON
    );

    if (response.data && response.data.result) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: "Colormind returned invalid data" });
    }
  } catch (err) {
    console.error("Colormind error:", err.message);
    res.status(500).json({ error: "Failed to fetch themes" });
  }
});

export default router;
