import express, { Application, Request, Response } from "express";
import { indexRoutes } from "./App/routes";
import { globalErrorHandler } from "./App/middleware/globalErrorHandler";
import { notFound } from "./App/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use("/api/auth", toNodeHandler(auth))


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use("/api/v1", indexRoutes)
app.use(globalErrorHandler)
app.use(notFound)
export default app;