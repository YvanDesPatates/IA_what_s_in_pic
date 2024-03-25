import express, { Router } from "express";
import { ImageController } from "./ImageController";
import { asyncWrapper } from "../displayableErrors/asyncWrapperErrorCatchingMiddleware";
import { isAuthenticated } from "../PassportAuthMiddleware";

export class ImageRoute {

    private readonly router: Router = express.Router();
    private readonly imageController: ImageController;

    constructor() {
        this.imageController = new ImageController();
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes(): void {
        this.router.post(
            "/upload",
            asyncWrapper(this.imageController.uploadImage, this.imageController)
        );
    }

}