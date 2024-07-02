import express, { Router } from "express";
import { ImageController } from "./ImageController";
import { asyncWrapper } from "../displayableErrors/asyncWrapperErrorCatchingMiddleware";
import multer from "multer";

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
      "/predict",
      this.upload.single("image"),
      asyncWrapper(this.imageController.predictImage, this.imageController)
    );

  }
}
