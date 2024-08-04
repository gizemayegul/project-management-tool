import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/ddd5uljyc/image/upload/v1722262613/movie-project/diplyz2gxv7ffidoj6we.jpg",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
