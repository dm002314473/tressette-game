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
      socketId: { type: String, required: false },
      hand: [
        {
          suits: { type: String, required: false },
          values: { type: String, required: false },
          points: { type: String, required: false },
          trueValue: { type: String, required: false },
        },
      ],
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
  type: { type: String, enum: ["2", "4"], required: true },
  isPrivate: { type: Boolean, default: false },
  joinCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  boardState: { type: Object, default: null },
  turn: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Game", gameSchema);
