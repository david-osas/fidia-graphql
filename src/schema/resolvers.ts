import { LoginResponse, NewUser } from "./../types/index";
import { IUser, LoginUserArgs } from "../types";
import { User } from "../models/User";
import AppError from "../error/appError";
import { ApolloError } from "apollo-server-errors";
import crypto from "crypto";

// const dummyUsers: NewUser[] = [
//   {
//     firstName: "osarumense",
//     lastName: "azamegbe",
//     email: "osas@gmail.com",
//     mobileNumber: "0802333333",
//     country: "nga",
//     password: "dummypassword",
//   },
// ];

const resolvers = {
  Query: {
    async getAllUsers(): Promise<IUser[] | ApolloError> {
      let users: IUser[] | null = null;

      try {
        users = await User.find({});
      } catch (err) {
        console.log(err);
      }

      return users || new AppError("error getting all users", 500);
    },
  },

  Mutation: {
    async createUser(
      _: undefined,
      args: { user: NewUser }
    ): Promise<IUser | ApolloError> {
      const payload = args.user;

      let user: IUser | null = null;

      try {
        const userDoc = await User.findOne({ email: payload.email });

        if (userDoc) {
          return new AppError("user already exists", 400);
        }

        user = await User.create(payload);

        user.sendVerificationEmail();
      } catch (err) {
        console.log(err);
      }

      return user ? user : new AppError("error creating new user", 500);
    },

    async loginUser(
      _: undefined,
      args: LoginUserArgs
    ): Promise<LoginResponse | ApolloError> {
      const payload = args;
      let isValid = false;
      let token = "";
      let response: LoginResponse | null = null;

      try {
        const user = await User.findOne({ email: payload.email }, "+password");

        if (!user) {
          return new AppError("user does not exist", 404);
        }

        if (!user.isVerified) {
          return new AppError(
            "user is not verified, check your email for your verification url",
            403
          );
        }

        isValid = await user.validatePassword(payload.password, user.password);

        if (!isValid) {
          return new AppError("password is incorrect", 400);
        }

        token = user.generateToken();

        response = { data: user, token };
      } catch (err) {
        console.log(err);
      }

      return response
        ? response
        : new AppError("error authenticating user", 500);
    },
    async verifyUser(_: undefined, args: { token: string }) {
      const token = args.token;
      try {
        const hashToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const user = await User.findOne({ verifyToken: hashToken });
        if (!user) {
          return new AppError("user does not exist", 404);
        }

        const currentDate = new Date();

        if (!user.verifyTokenExpires || currentDate > user.verifyTokenExpires) {
          return new AppError("verification token has expired", 400);
        }

        user.isVerified = true;
        user.verifyTokenExpires = null;
        user.verifyToken = null;

        await user.save();

        return "successfully verified user";
      } catch (err) {
        console.log(err);
      }

      return new AppError("error verifying user", 500);
    },
    async resendToken(_: undefined, args: { token: string }) {
      const token = args.token;

      try {
        const hashToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const user = await User.findOne({ verifyToken: hashToken });
        if (!user) {
          return new AppError("user does not exist", 404);
        }
        const currentDate = new Date();

        if (user.verifyTokenExpires && currentDate < user.verifyTokenExpires) {
          return new AppError("verification token has not expired", 400);
        }

        if (user.isVerified) {
          return new AppError("user is already verified", 400);
        }

        const sentEmail = await user.sendVerificationEmail();
        if (!sentEmail) {
          return new AppError("error sending verification email", 500);
        }

        return "verification token has been resent";
      } catch (err) {
        console.log(err);
      }

      return new AppError("error resending token", 500);
    },
  },
};

export { resolvers };
