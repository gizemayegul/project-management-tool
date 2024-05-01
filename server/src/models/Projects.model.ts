import { Schema, model } from "mongoose";

const projectsSchema = new Schema(
  {
    projectName: {
      type: String,
      default: "My new Project",
      required: [true, "Project name is required"],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    boardInitialColumns: ["Todo", "Inprogress", "Done"],
  },
  {
    timestamps: true,
  }
);

const Projects = model("Projects", projectsSchema);
export default Projects;
