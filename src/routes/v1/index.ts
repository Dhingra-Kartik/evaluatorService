import express from "express";
import { pingCheck } from "../../controllers/pingController.js";

const v1router = express.Router();

v1router.get('/', pingCheck);

export default v1router;