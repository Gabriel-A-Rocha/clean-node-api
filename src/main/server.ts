import express from "express";

const app = express();

app.listen(5050, () => {
  console.log("Server running at http://localhost:5050");
});

app.get("/", (req, res) => {
  res.send("<p>Server running at http://localhost:5050</p>");
});
