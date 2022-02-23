interface TestUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  country: string;
  isVerified?: boolean;
  password?: string;
  sendVerificationEmail?: () => void;
}

const testPassword = "test_password";

const testUsers: TestUser[] = [
  {
    _id: "1",
    firstName: "david",
    lastName: "osas",
    email: "osas@gmail.com",
    mobileNumber: "0801111111",
    country: "nga",
  },
  {
    _id: "2",
    firstName: "osarumense",
    lastName: "azamegbe",
    email: "azamegbe@gmail.com",
    mobileNumber: "0801111111",
    country: "nga",
  },
  {
    _id: "3",
    firstName: "ehis",
    lastName: "samuel",
    email: "ehis@gmail.com",
    mobileNumber: "0801111111",
    country: "nga",
  },
  {
    _id: "4",
    firstName: "hakeem",
    lastName: "lawal",
    email: "lawal@gmail.com",
    mobileNumber: "0801111111",
    country: "nga",
  },
];

export { testUsers, TestUser, testPassword };
