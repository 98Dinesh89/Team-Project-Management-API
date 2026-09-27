import { z } from "zod";

const email = z.email("Invalid email format: zod");

const password = z
    .string()
    .min(6, "Password must be at least 6 characters : zod");

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters : zod")
        .max(50, "Name must be at most 50 characters : zod"),

    email,
    password
});

export const loginSchema = z.object({
    email,
    password
});