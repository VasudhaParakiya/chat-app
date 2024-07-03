import mongoose from "mongoose";

let ObjectId = mongoose.Schema.Types.ObjectId;

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

TokenSchema.index({ createdAt: 1 }, { expires: "8h" });
const Token = new mongoose.model("Token", TokenSchema);
export default Token;
