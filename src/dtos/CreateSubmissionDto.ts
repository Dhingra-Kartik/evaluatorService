import { z } from 'zod';
// export interface CreateSubmissionDto {
//     userId: string,
//     problemId: string,
//     code: string,
//     language: string
// }; you don't nee dthis interface anymore

//zod itself has infer method sthat creates that from zod schema

export type CreateSubmissionDto = z.infer<typeof createSubmissionZodSchema>

//zod schema, it is tightly coupled with dto
export const createSubmissionZodSchema =z.object({
    userId: z.string(),
    problemId: z.string(),
    code: z.string(),
    language: z.string()
}).strict();