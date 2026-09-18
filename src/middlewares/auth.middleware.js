import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../config/env.js";
import Team from "../models/team.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized - no token provided" });

        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user)
            return res.status(401).json({ message: "Unauthorized - user not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware : ", error);
        res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
}

export const teamMember = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const teamId = req.params.teamId;

        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "Such team does not exist" });

        const isMember = team.members.some(
            member => member.user.equals(userId)
        );
        if (!isMember)
            return res.status(400).json({ message: "Unauthorized - user is not a part of this team" });

        req.team = team;
        next();
    } catch (error) {
        console.log("Error in teamMember Middleware : ", error);
        res.status(401).json({ message: "Internal Server Error" });
    }
};

export const teamOwner = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const teamId = req.params.teamId;

        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "Such team does not exist" });

        if (!userId.equals(team.owner))
            return res.status(400).json({ message: "User is not the owner of team" });

        req.team = team;
        next();
    } catch (error) {
        console.log("Error in teamOwner Middleware : ", error);
        res.status(401).json({ message: "Internal Server Error" });
    }
};

export const projectMember = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);
        if (!project)
            return res.status(400).json({ message: "Such project does not exist" });

        const teamId = project.team;
        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "This project doesn not belong to any team" });

        const isMember = team.members.some(
            member => member.user.equals(userId)
        );
        if (!isMember)
            return res.status(400).json({ message: "Unauthorized - user is not a part of this team and cannot access this project" });

        req.project = project;
        req.team = team;
        next();
    } catch (error) {
        console.log("Error in ProjectMember Middleware : ", error);
        res.status(401).json({ message: "Internal Server Error" });
    }
};

export const taskMember = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task)
            return res.status(400).json({ message: "Such task does not exist" });

        const projectId = task.project;
        const project = await Project.findById(projectId);
        if (!project)
            return res.status(400).json({ message: "This task does not belong to any project" });

        const teamId = project.team;
        const team = await Team.findById(teamId);
        if (!team)
            return res.status(400).json({ message: "This task doesn not belong to any valid team" });

        const isMember = team.members.some(
            member => member.user.equals(userId)
        );
        if (!isMember)
            return res.status(400).json({ message: "Unauthorized - user is not a part of this team and cannot access this project" });

        req.team = team;
        req.project = project;
        req.task = task;
        next();
    } catch (error) {
        next(error);
    }
};

// task exists
//    ↓
// get task.project
//    ↓
// get project.team
//    ↓
// check req.user is team member