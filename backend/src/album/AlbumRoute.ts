import express, {Router} from "express";
import {AlbumController} from "./AlbumController";
import {asyncWrapper} from "../displayableErrors/asyncWrapperErrorCatchingMiddleware";
import {isAuthenticated} from "../PassportAuthMiddleware";

export class AlbumRoute {
    private readonly router: Router = express.Router();
    private readonly albumController: AlbumController;


    constructor() {
        this.albumController = new AlbumController();
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes(): void {

        this.router.get(
            "/",
            isAuthenticated,
            asyncWrapper(this.albumController.getAllAlbums, this.albumController));

        this.router.get(
            '/:id',
            asyncWrapper(this.albumController.getAlbumById, this.albumController));

        this.router.post(
            '/',
            asyncWrapper(this.albumController.createAlbum, this.albumController));

        this.router.delete(
            '/:id',
            asyncWrapper(this.albumController.deleteAlbum, this.albumController));
    }
}