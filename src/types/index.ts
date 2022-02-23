export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  country: string;
  isVerified: boolean;
  password: string;
  verifyToken: string;
  verifyTokenExpires: Date | null;
  validatePassword: (password: string, userPassword: string) => boolean;
  generateToken: () => string;
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

export interface VerifyUserArgs {
  token: string;
  email: string;
}
