import User from "../models/user.model.js";
import Team from "../models/team.model.js";

export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const ownerId = req.user._id;

        if (!name)
            return res.status(400).json({ message: "Team name is required" });

        const team = await Team.findOne({ name });
        if (team) {
            const teamOwnerId = team.owner;
            if (ownerId.equals(teamOwnerId))
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
            name: populatedTeam.name,
            members: populatedTeam.members.map(member => ({
                _id: member.user._id,
                name: member.user.name,
                email: member.user.email
            }))
        });

    } catch (error) {
        console.log("Error in createTeam in team controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTeams = async (req, res) => {
    try {
        const user = req.user;

        const teamList = await Team.find({ "members.user": user._id }).select("name");

        res.status(200).json(teamList);
    } catch (error) {
        console.log("Error in getTeams in team controller : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};