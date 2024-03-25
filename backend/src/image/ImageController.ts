import {Request, Response} from "express";
import {AccountLogic} from "../account/AccountLogic";
import {ImageLogic} from "./ImageLogic";

export class ImageController {

    public async uploadImage(req: Request, res: Response): Promise<void> {
        const account = req.user as AccountLogic;

        req.on("data", (data) => {
            const imageBytes = data;

            const imageToUpload = new ImageLogic(
                req.body.name,
                req.body.date,
                account.email,
                req.body.albums,
                req.body.tags,
                undefined,
                imageBytes
            );

            imageToUpload.create();

            res.status(201).send();

        });
    }
}