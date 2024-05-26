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
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
    },
    index: {
      type: Number,
      default: 0,
    },
    columnName: { type: String },
  },
  {
    timestamps: true,
  }
);

const Tasks = model("Tasks", tasksSchema);

export default Tasks;
