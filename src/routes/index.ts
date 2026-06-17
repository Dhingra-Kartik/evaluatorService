import express from "express";
import v1router from "./v1/index.js";

const APIRouter = express.Router();

APIRouter.use('/v1', v1router);

export default APIRouter;