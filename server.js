const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "leaderboard.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

app.get("/leaderboard", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));
  data.sort((a, b) => b.xp - a.xp);
  res.json(data.slice(0, 100));
});

app.post("/submit", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));

  const { name, avatar, xp } = req.body;

  let player = data.find(p => p.name === name);

  if (player) {
    if (xp > player.xp) {
      player.xp = xp;
      player.avatar = avatar;
    }
  } else {
    data.push({ name, avatar, xp });
  }

  data.sort((a, b) => b.xp - a.xp);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});