import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

projectSchema.index(
    { name: 1, team: 1 },
    { unique: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;