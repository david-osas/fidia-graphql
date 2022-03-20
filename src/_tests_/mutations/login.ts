import dotenv from "dotenv";
dotenv.config();
process.env.NODE_ENV = "test";

import { ApolloServer } from "apollo-server-express";
import chai from "chai";
import sinon from "sinon";
import { resolvers } from "../../schema/resolvers";
import { typeDefs } from "../../schema/typeDef";
import { testUsers, TestUser, testPassword } from "../testData/users";
import { User } from "../../models/User";

const should = chai.should();
const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const db: TestUser[] = [];
const sandbox = sinon.createSandbox();

describe("Login mutuation test", () => {
  before(async () => {
    const user = testUsers[0];
    const newUser: TestUser = {
      _id: Math.ceil(Math.random() * 100).toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      mobileNumber: user.mobileNumber,
      password: testPassword,
      isVerified: false,
    };

    db.push(newUser);

    sandbox.stub(User, "findOne").callsFake(function (filter: any): any {
      let ans = null;
      for (const data of db) {
        if (data.email === filter.email) {
          ans = data;
          break;
        }
      }

      return ans;
    });
  });

  after(() => {
    sandbox.restore();
  });

  it("should return error for unverified user", (done) => {
    testServer
      .executeOperation({
        query: `
          mutation loginUser($email: String!, $password: String!){
              loginUser(email: $email, password: $password){
                  token,
                  data{
                      firstName,
                      lastName,
                      email
                  }
              }
          }
          `,
        variables: {
          email: testUsers[0].email,
          password: testPassword,
        },
      })
      .then((res) => {
        should.exist(res.errors![0]);
        const error = res.errors![0];
        const errorCode = parseInt(error?.extensions?.code as string);

        error.message.should.equal(
          "user is not verified, check your email for your verification url"
        );
        errorCode.should.equal(403);

        done();
      });
  });
});
