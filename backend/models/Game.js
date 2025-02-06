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
          suit: { type: String, required: false },
          value: { type: String, required: false },
          points: { type: String, required: false },
          trueValue: { type: String, required: false },
          playerId: { type: String, required: false },
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
  boardState: [
    {
      suit: { type: String, required: true },
      value: { type: String, required: true },
      points: { type: String, required: true },
      trueValue: { type: String, required: true },
      playerId: { type: String, required: false },
    },
  ],
  turn: { type: String, required: false },
  remainingDeck: [
    {
      suit: { type: String, required: true },
      value: { type: String, required: true },
      points: { type: String, required: true },
      trueValue: { type: String, required: true },
      playerId: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Game", gameSchema);
