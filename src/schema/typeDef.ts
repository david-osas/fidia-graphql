import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    name: String!
    email: String!
    mobileNumber: String!
    country: String!
    isVerified: Boolean!
  }

  input NewUser {
    name: String!
    email: String!
    password: String!
    mobileNumber: String!
    country: String!
  }

  type Query {
    getAllUsers: [User!]!
  }

  type LoginUser {
    data: User!
    token: String!
  }

  type Mutation {
    createUser(user: NewUser!): User!
    loginUser(email: String!, password: String!): LoginUser!
    verifyUser(token: String!, email: String!): User
    resendToken(token: String!): String!
  }
`;

export { typeDefs };
