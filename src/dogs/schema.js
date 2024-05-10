import z from 'zod'

export const addDogZodSchema = z.object({
    breed: z.string(),
    origin: z.string().optional(),
    description: z.string().optional()
}).strict()

export const updateDogZodSchema = z.object({
    breed: z.string().optional(),
    origin: z.string(),
    description: z.string()
}).strict()