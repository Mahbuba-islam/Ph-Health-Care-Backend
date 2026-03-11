import express, { Application, Request, Response } from "express";
import { indexRoutes } from "./App/routes";
import { globalErrorHandler } from "./App/middleware/globalErrorHandler";
import { notFound } from "./App/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import path from "node:path";
import cors from "cors";
import { envVars } from "./config/env";

const app: Application = express();

app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))


app.post("/webhook", express.raw({type:"application/json"}), async(req:Request, res:Response)=> {
  console.log("webhook received:", req.body);
  res.status(200).json({received:true})
})



app.use(cors({
  origin:[envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
  credentials:true,
  methods:["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders:["Content-Type", "Authorization"]
}))
app.use("/api/auth", toNodeHandler(auth))


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}))
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use("/api/v1", indexRoutes)
app.use(globalErrorHandler)
app.use(notFound)
export default app;