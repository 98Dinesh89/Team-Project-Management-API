import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, "Task title is required")
        .max(100, "Task title is too long"),

    description: z
        .string()
        .max(1000, "Description is too long")
        .optional(),

    assignedTo: z
        .string()
        .optional(),

    status: z
        .enum(["todo", "in_progress", "in_review", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"]),

    dueDate: z
        .coerce.date()
        .optional()
});

export const patchTaskSchema = z.object({
    title: z
        .string()
        .min(1, "Task title cannot be empty")
        .max(100, "Task title is too long")
        .optional(),

    description: z
        .string()
        .max(1000, "Description is too long")
        .optional(),

    status: z
        .enum(["todo", "in_progress", "in_review", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    dueDate: z
        .coerce.date()
        .optional(),

    assignedTo: z
        .string()
        .optional()
});

export const getTasksSchema = z.object({
    status: z
        .enum(["todo", "in_progress", "in_review", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    assignedTo: z
        .string()
        .optional(),

    sortBy: z
        .enum([
            "title",
            "status",
            "priority",
            "dueDate",
            "createdAt",
            "updatedAt"
        ])
        .optional(),

    order: z
        .enum(["asc", "desc"])
        .optional(),

    page: z
        .coerce.number()
        .int()
        .positive()
        .optional(),

    limit: z
        .coerce.number()
        .int()
        .positive()
        .max(100)
        .optional(),

    search: z
        .string()
        .optional(),

    fields: z
        .string()
        .optional()
});