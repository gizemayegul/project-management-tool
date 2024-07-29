import { Schema, model } from "mongoose";

const projectsSchema = new Schema(
  {
    projectName: {
      type: String,
      default: "My new Project",
      required: [true, "Project name is required"],
    },
    imageUrl: {
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-NSEUHWmQsGxt4SfVM3f8VMW7vN8JsHnL-CnVII5E4A&s",
      type: String,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Projects = model("Projects", projectsSchema);
export default Projects;
