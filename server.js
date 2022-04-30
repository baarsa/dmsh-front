const express = require("express");
const path = require("path");
const app = express();
const port = 5001;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
