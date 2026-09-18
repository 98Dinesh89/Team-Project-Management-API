import User from "../models/user.model.js";
import Team from "../models/team.model.js";

export const createTeam = async (req, res, next) => {
    try {
        const { name } = req.body;
        const ownerId = req.user._id;

        if (!name)
            return res.status(400).json({ message: "Team name is required" });

        // Also checked in error handler
        const team = await Team.findOne({
            name,
            owner: ownerId
        });
        if (team) {
            return res.status(400).json({ message: "Team already exists" });
        }

        const newTeam = new Team({
            name,
            owner: ownerId,
            members: [
                {
                    user: ownerId,
                    role: "owner"
                }
            ]
        });

        await newTeam.save();

        const populatedTeam = await Team
            .findById(newTeam._id)
            .populate("members.user", "name email");

        res.status(201).json({
            _id: populatedTeam._id,
            name: populatedTeam.name,
            members: populatedTeam.members.map(member => ({
                _id: member.user._id,
                name: member.user.name,
                email: member.user.email
            }))
        });

    } catch (error) {
        next(error);
    }
};

export const getTeams = async (req, res, next) => {
    try {
        const user = req.user;

        const teamList = await Team.find({ "members.user": user._id }).select("name");

        res.status(200).json(teamList);
    } catch (error) {
        next();
    }
};

export const addMember = async (req, res, next) => {
    try {
        const team = req.team;
        const { userId } = req.body;

        if (!userId)
            return res.status(400).json({ message: "User Id is required" });

        if (!(await User.findById(userId)))
            return res.status(400).json({ message: "Such user does not exist" });

        const checkuser = team.members.some(
            member => member.user.equals(userId)
        );

        if (checkuser)
            return res.status(400).json({ message: "Already a member" });

        team.members.push({
            user: userId,
        });

        await team.save();

        res.status(200).json(team);
    } catch (error) {
        next(error);
    }
};