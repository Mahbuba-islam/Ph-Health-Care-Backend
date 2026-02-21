import express, { Application, Request, Response } from "express";
import { indexRoutes } from "./App/routes";
import { globalErrorHandler } from "./App/middleware/globalErrorHandler";
import { notFound } from "./App/middleware/notFound";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

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