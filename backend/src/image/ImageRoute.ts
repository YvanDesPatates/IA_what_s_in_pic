import express, { Router } from "express";
import { ImageController } from "./ImageController";
import { asyncWrapper } from "../displayableErrors/asyncWrapperErrorCatchingMiddleware";
import multer from "multer";
import {isAuthenticated} from "../PassportAuthMiddleware";

export class ImageRoute {
  private readonly router: Router = express.Router();
  private readonly imageController: ImageController;
  private readonly upload: multer.Multer;

  constructor() {
    this.imageController = new ImageController();
    const storage = multer.memoryStorage();
    this.upload = multer({ storage: storage });
    this.routes();
  }

  getRouter() {
    return this.router;
  }

  private routes(): void {
    this.router.post(
      "/upload",
      this.upload.single("image"),
      asyncWrapper(this.imageController.uploadImage, this.imageController)
    );

    this.router.get(
        "/album/:albumId",
        isAuthenticated,
        asyncWrapper(this.imageController.getAllByAlbum, this.imageController)
    );

    this.router.get(
        "/filter/:tagOrName",
        isAuthenticated,
        asyncWrapper(this.imageController.getAllSorted, this.imageController)
    );
  }
}
