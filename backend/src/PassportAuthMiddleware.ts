import * as passportStrategy from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { Express, NextFunction, Request, Response } from "express";
import { AccountLogic } from "./account/AccountLogic";
import { DisplayableJsonError } from "./displayableErrors/DisplayableJsonError";

export function initPassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.authenticate("session"));

  passport.use(
    new passportStrategy.Strategy(
      { usernameField: "email", passwordField: "pwd" },
      async (email, password, done) => {
        if (!email) {
          done(null, false);
        }
        const account = AccountLogic.getAccount(email);
        if (
          account.email == email &&
          (await bcrypt.compare(password, (<string>account.pwd).toString()))
        ) {
          done(null, account);
        } else {
          throw new DisplayableJsonError(401, "unauthorized, bad email or pwd");
        }
      }
    )
  );

  passport.serializeUser((req: Request, user: any, done: any) => {
    done(null, { email: user.email });
  });

  passport.deserializeUser((user: AccountLogic, done) => {
    const account = AccountLogic.getAccount(user.email);
    done(null, account);
  });
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (req.user) return next();
  else throw new DisplayableJsonError(401, "unauthorized");
}
