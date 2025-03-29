const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phon_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, phon_number: this.phon_number },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Check password match
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add this to automatically remove password from JSON output
// UserSchema.methods.toJSON = function() {
//     const user = this.toObject();
//     delete user.password;
//     return user;
//   };

module.exports = mongoose.model("User", UserSchema);
