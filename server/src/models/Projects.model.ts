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
        "https://images.unsplash.com/photo-1443397646383-16272048780e?ixlib=rb-4.0.3",
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
