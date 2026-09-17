import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createTask = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const creatorId = req.user._id;
        const { title, description, assignedTo, status, priority, dueDate } = req.body;

        if (!title || !priority)
            return res.status(400).json({ message: "Some fields are required" });

        const project = await Project.findById(projectId);
        if (!project)
            return res.status(400).json({ message: "Such Project does not exist" });


        const teamId = project.team;
        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "The project does not belong to any active team" });

        const checkuser = team.members.some(
            member => member.user.equals(creatorId)
        );
        if (!checkuser)
            return res.status(400).json({ message: "Unauthorized - This user cannot create task" });

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
                member => member.user.equals(assignedTo
                )
            );
            if (!isAssignedUser)
                return res.status(400).json({ message: "The user you are assigning to either does not exist or is not a part of this team" });
            else {
                newTask.assignedTo = assignedTo;
                list.assignedTo = assignedTo;
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

    }
};