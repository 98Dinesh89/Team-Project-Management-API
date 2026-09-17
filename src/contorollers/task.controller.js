import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
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
        console.log("Error in createTask task controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const projectId = req.project._id;

        const tasks = await Task.find({ project: projectId });

        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error in getTasks task controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};