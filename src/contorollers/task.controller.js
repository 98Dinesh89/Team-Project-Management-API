import redisClient from "../config/redis.js";
import Task from "../models/task.model.js";

export const createTask = async (req, res, next) => {
    try {
        const projectId = req.project._id;
        const creatorId = req.user._id;
        const team = req.team;
        const { title, description, assignedTo, status, priority, dueDate } = req.body;

        if (!title || !priority)
            return res.status(400).json({ message: "Some fields are required" });

        const newTask = new Task({
            title,
            project: projectId,
            createdBy: creatorId,
            priority,
            status
        });

        const list = {
            title: newTask.title,
            project: newTask.project,
            priority: newTask.priority,
            status: newTask.status
        }

        if (assignedTo) {
            const isAssignedUser = team.members.some(
                member => member.user.equals(assignedTo)
            );
            if (!isAssignedUser)
                return res.status(400).json({ message: "The user you are assigning to either does not exist or is not a part of this team" });
            else {
                newTask.assignedTo = assignedTo;
                list.assignedTo = assignedTo;
                newTask.status = "in_progress";
                list.status = "in_progress";
            }
        }
        if (description) {
            newTask.description = description;
            list.description = description
        }
        if (dueDate) {
            newTask.dueDate = dueDate;
            list.dueDate = dueDate;
        }

        await newTask.save();

        res.status(200).json({ list });

    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const { status, priority, assignedTo, sortBy, order, page, limit, search, fields } = req.query;
        const projectId = req.project._id;

        let versionKey = await redisClient.get(`tasks:project:version:${projectId}`);
        if (!versionKey) {
            versionKey = "1";
            await redisClient.set(
                `tasks:project:version:${projectId}`,
                versionKey,
                {
                    EX: 3600
                }
            );
        }

        const cacheKey = `tasks:project:${projectId}:${versionKey}` +
            JSON.stringify(req.query);

        const cachedTasks = await redisClient.get(cacheKey);

        if (cachedTasks) {
            return res.status(200).json({
                source: "redis",
                ...JSON.parse(cachedTasks)
            });
        }

        const filter = {
            project: projectId
        }

        if (status !== undefined) filter.status = status;
        if (priority !== undefined) filter.priority = priority;
        if (assignedTo !== undefined) filter.assignedTo = assignedTo;
        if (search !== undefined) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const allowedFields = [
            "project",
            "title",
            "description",
            "status",
            "priority",
            "assignedTo",
            "dueDate",
            "createdAt",
            "updatedAt"
        ];
        const requestedFields = fields
            ? fields.split(",")
            : allowedFields;

        const selectedFields = requestedFields
            .filter(field => allowedFields.includes(field))
            .join(" ");

        const sort = {};
        if (sortBy) {
            sort[sortBy] = order === "desc" ? -1 : 1;
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 5;
        const skip = (pageNumber - 1) * limitNumber;

        const tasks = await Task
            .find(filter)
            .select(selectedFields)
            .sort(sort).skip(skip)
            .limit(limitNumber)
            .populate("assignedTo", "name email")
            .populate({
                path: "project",
                select: "name status team",
                populate: {
                    path: "team",
                    select: "name"
                }
            });

        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limitNumber);

        const response = {
            tasks,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalTasks,
                totalPages
            }
        }

        await redisClient.set(
            cacheKey,
            JSON.stringify(response),
            {
                EX: 60
            }
        );

        res.status(200).json(
            {
                source: "mongodb",
                ...response
            }
        );

    } catch (error) {
        next(error);
    }
};

export const patchTasks = async (req, res, next) => {
    try {
        const team = req.team;
        const projectId = req.project._id;
        const task = req.task;
        const { title, description, status, priority, dueDate, assignedTo } = req.body;


        // Also checked in errorHandler controller
        if (title !== undefined) {
            const isSame = await Task.findOne({
                title,
                project: projectId,
                _id: { $ne: task._id }
            });
            if (isSame)
                return res.status(400).json({ message: "Task with this name already exists" });

            task.title = title;
        }

        if (description !== undefined)
            task.description = description;

        if (status !== undefined)
            task.status = status;

        if (priority !== undefined)
            task.priority = priority;

        if (dueDate !== undefined)
            task.dueDate = dueDate;

        if (assignedTo !== undefined) {
            const isMember = team.members.some(
                member => member.user.equals(assignedTo)
            );
            if (!isMember)
                return res.status(400).json({ message: "Unauthorized - the assigned to user does not belong to this team" });

            task.assignedTo = assignedTo;
        }
        await task.save();
        await redisClient.set(`tasks:project:version:${projectId}`, "1", {
            NX: true,
            EX: 3600
        });

        await redisClient.incr(`tasks:project:version:${projectId}`);

        const result = task.toObject();
        delete result.createdBy;

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteTasks = async (req, res, next) => {
    try {
        projectId = req.project._id;
        const task = req.task;

        await task.deleteOne();
        await redisClient.set(`tasks:project:version:${projectId}`, "1", {
            NX: true,
            EX: 3600
        });

        await redisClient.incr(`tasks:project:version:${projectId}`);

        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        next(error);
    }
};