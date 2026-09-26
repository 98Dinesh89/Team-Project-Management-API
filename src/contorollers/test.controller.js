import Task from "../models/task.model.js";
import redisClient from "../config/redis.js";

export const atomicTaskUpdate = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;

        const result = await Task.updateOne(
            {
                _id: taskId,
                status: "todo"
            },
            {
                $set: {
                    status: "in_progress"
                }
            }
        );

        res.status(200).json({
            message: "Atomic update completed",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        next(error);
    }
};

export const nonAtomicTaskUpdate = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;

        // Step 1: Read
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Step 2: Check
        if (task.status !== "todo") {
            return res.status(400).json({
                message: "Task is no longer available"
            });
        }

        // Artificial delay to make the race condition easier to reproduce
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Step 3: Write
        task.status = "in_progress";
        await task.save();

        res.status(200).json({
            message: "Task updated",
            status: task.status
        });

    } catch (error) {
        next(error);
    }
};

export const rateLimitTest = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Request allowed",
            time: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};

export const redisTest = async (req, res, next) => {
    try {
        const count = await redisClient.incr("test:count");

        if (count === 1) {
            await redisClient.expire("test:count", 60);
        }

        const ttl = await redisClient.ttl("test:count");

        res.status(200).json({
            count,
            ttl
        });
    } catch (error) {
        next(error);
    }
};