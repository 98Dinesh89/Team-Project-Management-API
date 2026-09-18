import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                role: {
                    type: String,
                    enum: ["member", "owner"],
                    default: "member"
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

teamSchema.index(
    { name: 1, owner: 1 },
    { unique: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;