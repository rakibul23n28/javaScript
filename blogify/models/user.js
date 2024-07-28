
const mongoose= require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImageUrl:{
      type:String,
      default: '/images/default.png',
    }
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, this.salt);
  }
  next();
});
userSchema.methods.isValidPassword = function (password) {
  
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model("user",userSchema)
