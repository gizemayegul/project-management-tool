import { Schema, model } from "mongoose";

const tasksSchema = new Schema(
  {
    taskName: {
      type: String,
      default: "Untitled",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Boards",
    },
    taskPriority: {
      type: String,
      default: "P3",
      enum: ["P1", "P2", "P3"],
    },
    taskStatus: {
      type: Schema.Types.ObjectId,
      status: "",
    },
  },
  {
    timestamps: true,
  }
);

const Tasks = model("Tasks", tasksSchema);

export default Tasks;
