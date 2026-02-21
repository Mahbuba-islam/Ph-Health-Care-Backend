import dotenv from "dotenv";
import AppError from "../App/errorHelpers/AppError";
import status from "http-status";
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  // BETTER_AUTH_SESSION_TOKEN_EXPIRY: string;
  // BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
    // "BETTER_AUTH_SESSION_TOKEN_EXPIRY",
    // "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE"
  ];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable "${variable}" is required but missing in the .env file.`)
      
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
    // BETTER_AUTH_SESSION_TOKEN_EXPIRY: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRY as string,
    // BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string

  };
};

export const envVars = loadEnvVariables();