import Project from "../models/project.model.js";
import Team from "../models/team.model.js";

export const createProject = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { name, description, status } = req.body;
        const makerId = req.user._id;

        if (!name || !teamId)
            return res.status(400).json({ message: "project name is required" });

        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "no such team available" });

        const isMember = team.members.some(
            member => member.user.equals(makerId)
        );
        if (!isMember)
            return res.status(400).json({ message: "Unauthorized - only team members and owner can create project" });

        const project = await Project.findOne({
            name,
            team: teamId
        });
        if (project)
            return res.status(400).json({ message: "Project with this name already exists" });

        const newProject = new Project({
            name,
            description,
            team: teamId,
            createdBy: makerId,
            status
        });

        await newProject.save();

        res.status(200).json({
            _id: newProject._id,
            name: newProject.name,
            description: newProject.description,
            team: newProject.team,
            status: newProject.status
        });
    } catch (error) {
        console.log("Error in createProject project controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};