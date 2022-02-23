import { ApolloError } from "apollo-server-errors";

class AppError extends ApolloError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode.toString());

    Object.defineProperty(this, "name", { value: "AppError" });
  }
}

export default AppError;
