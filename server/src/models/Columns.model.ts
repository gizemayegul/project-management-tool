import { Schema, model } from "mongoose";
const ColumnsSchema = new Schema(
  {
    columnName: {
      type: String,
      default: "Untitled",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Boards",
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Tasks" }],
    index: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Columns = model("Columns", ColumnsSchema);
export default Columns;
