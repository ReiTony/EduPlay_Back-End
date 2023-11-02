const Badge = require("../models/badgeSchema");

const saveBadges = async (studentId, badges) => {
  try {
    for (let i = 0; i < badges.length; i++) {
      let badge = await Badge.findOne({ studentId, category: badges[i].category });
      if (badge) {
        badge.score += badges[i].score;
        badge.total += badges[i].total;
      } else badge = new Badge({ studentId, score: badges[i].score, total: badges[i].total, category: badges[i].category });
      await badge.save();
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = { saveBadges };
