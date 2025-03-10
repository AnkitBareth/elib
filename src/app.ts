import express from "express";

const app = express();

//routes

app.get("/", (req, res) => {
  res.json({ message: "hello from server" });
});

export default app;
