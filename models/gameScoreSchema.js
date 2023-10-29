const mongoose = require("mongoose");

const gameTypes = ["WordHunt", "4Pics"];

const GameScoreSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
    enum: gameTypes, 
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  }, 
}, {timestamps: true});

module.exports = mongoose.model("GameScore", GameScoreSchema);
