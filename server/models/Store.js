const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeUrl: {
      type: String,
      required: true,
    },
    themeId: {
      type: Number,
      required: true,
    },
    installed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
