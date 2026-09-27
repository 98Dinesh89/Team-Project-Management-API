import { z } from "zod";

export const createTeamSchema = z.object({
    name: z
        .string()
        .min(1, "Team name is required")
        .max(100, "Team name is too long")
});

export const addMemberSchema = z.object({
    userId: z
        .string()
        .min(1, "User ID is required")
});