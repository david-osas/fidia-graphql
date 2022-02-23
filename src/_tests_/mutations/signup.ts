/* eslint-disable @typescript-eslint/no-empty-function */
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
const newUser = {
  firstName: testUsers[0].firstName,
  lastName: testUsers[0].lastName,
  email: testUsers[0].email,
  country: testUsers[0].country,
  mobileNumber: testUsers[0].mobileNumber,
  password: testPassword,
};

describe("Signup mutuation test", () => {
  before(() => {
    sandbox.stub(User, "create").callsFake(function (doc: any): any {
      doc._id = Math.ceil(Math.random() * 100).toString();

      const user: TestUser = {
        _id: doc._id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        password: doc.password,
        email: doc.email,
        country: doc.country,
        mobileNumber: doc.mobileNumber,
        sendVerificationEmail: () => {},
      };

      db.push(user);
      return user;
    });

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

  it("should signup a new user successfully", (done) => {
    testServer
      .executeOperation({
        query: `
        
        mutation createUser($user: NewUser!)
        {
          createUser(user: $user)
          {
            _id
            firstName,
            lastName,
            email,
            country,
            mobileNumber
          }
        }
        `,
        variables: {
          user: newUser,
        },
      })
      .then((res) => {
        should.exist(res.data?.createUser);
        const data = res.data?.createUser as TestUser;

        data._id.should.equal(db[0]._id);

        data.firstName.should.equal(testUsers[0].firstName);
        data.lastName.should.equal(testUsers[0].lastName);
        data.email.should.equal(testUsers[0].email);
        data.country.should.equal(testUsers[0].country);
        data.mobileNumber.should.equal(testUsers[0].mobileNumber);

        done();
      });
  });

  it("should return error when the email has been used before", (done) => {
    testServer
      .executeOperation({
        query: `
        mutation createUser($user: NewUser!)
        {
          createUser(user: $user)
          {
            _id
            firstName,
            lastName,
            email,
            country,
            mobileNumber
          }
        }
      `,
        variables: {
          user: newUser,
        },
      })
      .then((res) => {
        should.exist(res.errors![0]);
        const error = res.errors![0];
        const errorCode = parseInt(error?.extensions?.code as string);

        error.message.should.equal("user already exists");
        errorCode.should.equal(400);

        done();
      });
  });
});
