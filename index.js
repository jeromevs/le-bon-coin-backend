const express = require("express");
const mongoose = require("mongoose");

// creer le server
const app = express();

// creer des routes
app.get("/", (req, res) => {
  res.json({ message: "hello World" });
});

app.listen(4000, () => {
  console.log("server started");
});
