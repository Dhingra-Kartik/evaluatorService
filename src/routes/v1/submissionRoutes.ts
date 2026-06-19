import express from "express";
import { addSubmission } from "../../controllers/submissionController.js";
import { validateDto } from "../../validators/zodValidator.js";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto.js";

const submissionRouter = express.Router();

submissionRouter.post('/', 
    validateDto(createSubmissionZodSchema),
    addSubmission);

export default submissionRouter;