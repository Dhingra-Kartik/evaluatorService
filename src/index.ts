import express from "express";
import serverConfig from "./config/serverConfig.js";
import APIRouter from "./routes/index.js";

const app = express();

app.use('/api', APIRouter);

app.listen(serverConfig.PORT, () => {
  console.log("WOW, Server started at port 4000");
});
