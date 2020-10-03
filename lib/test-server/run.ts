import express from "express";
import http from "http";
const app = express();

const httpServer = http.createServer(app);


app.get("/", function (req, res) {
  res.json({
    message: 'Hey we there'
  })
});

httpServer.listen(3000);
