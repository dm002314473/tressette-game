const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameId: { type: String, unique: true, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  players: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: { type: String, required: true },
      isReady: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "ongoing", "finished"],
    default: "waiting",
  },
  type: { type: String, enum: ["2-players", "4-players"], required: true },
  isPrivate: { type: Boolean, default: false },
  joinCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  boardState: { type: Object, default: null },
  turn: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Game", gameSchema);
