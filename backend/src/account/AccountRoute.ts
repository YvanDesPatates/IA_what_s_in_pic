import express, {Router} from "express";
import {AccountController} from "./AccountController";
import {asyncWrapper} from "../displayableErrors/asyncWrapperErrorCatchingMiddleware";
import {isAuthenticated} from "../PassportAuthMiddleware";

export class AccountRoute {
    private readonly router: Router = express.Router();
    private readonly accountController: AccountController;


    constructor() {
        this.accountController = new AccountController();
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes(): void {

        this.router.get(
            "/",
            isAuthenticated,
            asyncWrapper(this.accountController.getAllAccounts, this.accountController));

        this.router.get(
            '/:email',
            asyncWrapper(this.accountController.getAccountById, this.accountController));

        this.router.post(
            '/',
            asyncWrapper(this.accountController.createAccount, this.accountController));

        this.router.put(
            '/:email',
            asyncWrapper(this.accountController.updateAccount, this.accountController));

        this.router.delete(
            '/:email',
            asyncWrapper(this.accountController.deleteAccount, this.accountController));
    }
}