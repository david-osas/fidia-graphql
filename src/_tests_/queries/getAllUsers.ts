process.env.NODE_ENV = "test";

import { ApolloServer } from "apollo-server-express";
import chai from "chai";
import sinon from "sinon";
import { User } from "../../models/User";
import { resolvers } from "../../schema/resolvers";
import { typeDefs } from "../../schema/typeDef";
import { testUsers, TestUser } from "../testData/users";

const should = chai.should();
const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

let stub: any;

describe("Get all users", () => {
  before(() => {
    stub = sinon.stub(User, "find").callsFake(function (): any {
      return testUsers as TestUser[];
    });
  });

  after(() => {
    stub.restore();
  });

  it("should return a list of all users", (done) => {
    testServer
      .executeOperation({
        query: `
        query{
          getAllUsers{
            firstName
            lastName
            email
            mobileNumber
            country
            }
          }
          `,
      })
      .then((res) => {
        const result = res.data as { getAllUsers: TestUser[] };

        should.exist(result.getAllUsers);
        const userList = result.getAllUsers;

        userList.length.should.equal(testUsers.length);

        for (let i = 0; i < userList.length; i++) {
          const first = userList[i];
          const second = testUsers[i];

          first.firstName.should.equal(second.firstName);
          first.lastName.should.equal(second.lastName);
          first.email.should.equal(second.email);
          first.mobileNumber.should.equal(second.mobileNumber);
          first.country.should.equal(second.country);
        }

        done();
      });
  });
});
