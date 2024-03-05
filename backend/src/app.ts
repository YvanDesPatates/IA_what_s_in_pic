import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import {AccountRoute} from "./account/AccountRoute";
import {errorHandlerMiddleware} from "./displayableErrors/ErrorHandlerMiddleware";
import {ParsingResponseBodyMiddleware} from "./ParsingResponseBodyMiddleware";
import {initPassport} from "./PassportAuthMiddleware";
import passport from "passport";

dotenv.config({path: '../.env'});
const port = process.env.PORT;
const app = express();

// adding body parsing middleware to extract the payload of the request
app.use(express.json());
// middleware to allow CORS
app.use(cors());
app.use(ParsingResponseBodyMiddleware);
app.use(session({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false
}));
initPassport(app);

const accountRoute = new AccountRoute();

app.use('/api/accounts', accountRoute.getRouter());

app.post('/api/login', passport.authenticate('local'), async (req: Request, res: Response) => {
  res.json("You loggedin!!!");
});

app.get('/', (req, res) => {
  res?.send('Hello World!');
});

app.use(errorHandlerMiddleware);
app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});