import { LoginResponse, NewUser, VerifyUserArgs } from "./../types/index";
import { IUser, LoginUserArgs } from "../types";
import { User } from "../models/User";
import AppError from "../error/appError";
import { ApolloError } from "apollo-server-errors";

const dummyUsers: NewUser[] = [
  {
    firstName: "osarumense",
    lastName: "azamegbe",
    email: "osas@gmail.com",
    mobileNumber: "0802333333",
    country: "nga",
    password: "dummypassword",
  },
];

const resolvers = {
  Query: {
    getAllUsers() {
      return dummyUsers;
    },
  },

  Mutation: {
    async createUser(
      _: undefined,
      args: { user: NewUser }
    ): Promise<IUser | ApolloError> {
      const payload = args.user;

      let response: IUser | null = null;

      try {
        const userDoc = await User.findOne({ email: payload.email });

        if (userDoc) {
          return new AppError("user already exists", 400);
        }

        response = await User.create(payload);
      } catch (err) {
        console.log(err);
      }

      return response ? response : new AppError("error creating new user", 500);
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

        isValid = user.validatePassword(payload.password, user.password);

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
    verifyUser(_: undefined, args: VerifyUserArgs) {
      const payload = args;
      console.log(payload);
      // for (const item of dummyUsers) {
      //   if (
      //     item.email === payload.email &&
      //     item.verificationToken === payload.token
      //   ) {
      //     item.isVerified = true;
      //     return item;
      //   }
      // }

      return null;
    },
    resendToken() {
      return "Token has been resent";
    },
  },
};

export { resolvers };
