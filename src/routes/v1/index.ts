import express from "express";
import { pingCheck } from "../../controllers/pingController.js";
import submissionRouter from "./submissionRoutes.js";

const v1router = express.Router();

v1router.get('/', pingCheck);
v1router.use('/submit', submissionRouter);


export default v1router;