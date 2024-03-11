import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { AccountRoute } from "./account/AccountRoute";
import { errorHandlerMiddleware } from "./displayableErrors/ErrorHandlerMiddleware";
import { ParsingResponseBodyMiddleware } from "./ParsingResponseBodyMiddleware";
import { initPassport } from "./PassportAuthMiddleware";
import passport from "passport";
import { AlbumRoute } from "./album/AlbumRoute";

dotenv.config({ path: "../.env" });
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
initPassport(app);

const accountRoute = new AccountRoute();
const albumRoute = new AlbumRoute();

app.use("/api/accounts", accountRoute.getRouter());
app.use("/api/albums", albumRoute.getRouter());

app.post(
  "/api/login",
  passport.authenticate("local"),
  async (req: Request, res: Response) => {
    res.status(200).json(req.user);
  }
);

app.post("/api/logout", (req: Request, res: Response) => {
  req.logout(function (err) {
    if (err) {
      res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out" });
  });
});

app.get("/", (req, res) => {
  res?.send({
    message: "Hello World",
  });
});

app.use(errorHandlerMiddleware);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
