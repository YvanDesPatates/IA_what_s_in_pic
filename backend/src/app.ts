import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { errorHandlerMiddleware } from "./displayableErrors/ErrorHandlerMiddleware";
import { ParsingResponseBodyMiddleware } from "./ParsingResponseBodyMiddleware";
import {ImageRoute} from "./image/ImageRoute";

dotenv.config();
const port = process.env.PORT ?? 3000;
const app = express();

// adding body parsing middleware to extract the payload of the request
app.use(express.json());

// middleware to allow CORS
app.use(cors());

app.use(ParsingResponseBodyMiddleware);

app.use(
  session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
  })
);
const imageRoute = new ImageRoute();

app.use("/", imageRoute.getRouter());

app.get("/", (req, res) => {
  res?.send({
    message: "Hi, it's me. You're on an API that tell you an element there is in your picture if you send it, thanks to an IA model prediction",
  });
});

app.use(errorHandlerMiddleware);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
