import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { IUser } from "../types";

const saltRounds = 10;
const passwordLength = 6;
const jwtSecret: string = process.env.JWT_SECRET as string;
const jwtDuration = "1h";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isEmail, "email is required"],
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "mobile number is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minlength: [
        passwordLength,
        `password must be a minimum of ${passwordLength} characters`,
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.validatePassword = async function (
  password: string,
  userPassword: string
) {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ email: this.email }, jwtSecret, { expiresIn: jwtDuration });
};

const User = model<IUser>("User", userSchema);

export { User };
