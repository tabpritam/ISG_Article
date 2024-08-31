const mongoose = require("mongoose");
const validateMongodbId = (id) => {
  console.log("id", id);
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("This ID is not valid or not found");
  }
};

module.exports = validateMongodbId;
// module.exports = validateMongodbid;
