import { Schema, model } from "mongoose";

const projectsSchema = new Schema(
  {
    projectName: {
      type: String,
      default: "My new Project",
      required: [true, "Project name is required"],
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Projects = model("Projects", projectsSchema);
export default Projects;
