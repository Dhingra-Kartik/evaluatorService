import express from "express";
import serverConfig from "./config/serverConfig.js";

const app = express();

app.listen(serverConfig.PORT, ()=>{
    console.log("WOW, Server started at port 3000");
});