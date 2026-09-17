import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
    try {
        const teamId = req.team._id;
        const { name, description } = req.body;
        const makerId = req.user._id;

        if (!name)
            return res.status(400).json({ message: "project name is required" });

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
            createdBy: makerId
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

export const getProjects = async (req, res) => {
    try {
        const teamId = req.team._id;

        const projects = await Project.find({ team: teamId }).select("-createdBy");

        res.status(200).json(projects);
    } catch (error) {
        console.log("Error in getProjects in project controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};