import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Email, IUser } from "../types";
import { sendEmail } from "../utils/email";

const saltRounds = 10;
const passwordLength = 6;
const jwtSecret: string = process.env.JWT_SECRET as string;
const jwtDuration = process.env.JWT_DURATION as string;
const tokenHours = 1;

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

userSchema.methods.sendVerificationEmail = async function () {
  const token = crypto.randomBytes(12).toString("hex");
  this.verifyToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + tokenHours);
  this.verifyTokenExpires = expiryDate;

  await this.save();

  const verifyUrl = `https://fidia.org/auth/verify/${token}`;

  const data: Email = {
    from: "fidia@example.com",
    to: [this.email],
    subject: "Account verification",
    html: `<p>This email was sent to verify your account. The verification token will expire in ${tokenHours} hour(s)</p>
     <a href='${verifyUrl}'>Click on this link to verify your account</a> 
      <p>or copy this url <em>${verifyUrl}</em> into a new tab</p>
      `,
  };

  return await sendEmail(data);
};

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
