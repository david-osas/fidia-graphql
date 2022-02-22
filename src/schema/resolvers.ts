import { NewUser, VerifyUserArgs } from "./../types/index";
import { User, LoginUserArgs } from "../types";

const dummyUsers: User[] = [
  {
    name: "osas",
    email: "osas@gmail.com",
    mobileNumber: "0802333333",
    country: "nga",
    password: "dummypassword",
    isVerified: true,
    verificationToken: "",
  },
];

const resolvers = {
  Query: {
    getAllUsers() {
      return dummyUsers;
    },
  },

  Mutation: {
    createUser(_: undefined, args: { user: NewUser }) {
      const newUser: User = {
        ...args.user,
        verificationToken: "verify",
        isVerified: false,
      };

      dummyUsers.push(newUser);

      return newUser;
    },

    loginUser(_: undefined, args: LoginUserArgs) {
      const payload = args;

      for (const item of dummyUsers) {
        if (
          item.email === payload.email &&
          item.password === payload.password
        ) {
          return {
            data: item,
            token: "loginToken",
          };
        }
      }
    },
    verifyUser(_: undefined, args: VerifyUserArgs) {
      const payload = args;

      for (const item of dummyUsers) {
        if (
          item.email === payload.email &&
          item.verificationToken === payload.token
        ) {
          item.isVerified = true;
          return item;
        }
      }

      return null;
    },
    resendToken() {
      return "Token has been resent";
    },
  },
};

export { resolvers };
