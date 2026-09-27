import { z } from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(1, "Project name is required")
        .max(100, "Project name is too long"),

    description: z
        .string()
        .max(1000, "Description is too long")
        .optional()
});