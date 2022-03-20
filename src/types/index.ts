export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  country: string;
  isVerified: boolean;
  password: string;
  verifyToken: string | null;
  verifyTokenExpires: Date | null;
  validatePassword: (
    password: string,
    userPassword: string
  ) => Promise<boolean>;
  generateToken: () => string;
  sendVerificationEmail: () => Promise<boolean>;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  country: string;
}

export interface LoginUserArgs {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: IUser;
  token: string;
}

export interface Email {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
}
