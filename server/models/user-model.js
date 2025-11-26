import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  bio: String,
  profilePicture: String,
  nativeLanguage: String,
  learningLanguage: String,
  location: String,
  isOnBoard: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function () {
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(
    { id: this._id },
    secret,
    { expiresIn: "60m" }
  );

  return token;
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
