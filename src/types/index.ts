export interface User {
  name: string;
  email: string;
  mobileNumber: string;
  country: string;
  isVerified: boolean;
  password: string;
  verificationToken: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  country: string;
}

export interface LoginUserArgs {
  email: string;
  password: string;
}

export interface VerifyUserArgs {
  token: string;
  email: string;
}
