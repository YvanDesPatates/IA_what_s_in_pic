import {Request, Response} from "express";
import {AccountLogic} from "../account/AccountLogic";
import {ImageLogic} from "./ImageLogic";
import {AlbumLogic} from "../album/AlbumLogic";
import {ImageMongoDAO} from "./ImageMongoDAO";

export class ImageController {
    public async uploadImage(req: Request, res: Response): Promise<void> {
        const account = req.user as AccountLogic;
        if (!account) {
            res.status(401).send();
            return;
        }

        // Convert buffer to number[]
        const imageBytes = Array.from(req.file?.buffer ?? Buffer.alloc(0));
        const albums = JSON.parse(req.body.albums);
        const tags = JSON.parse(req.body.tags);

        const imageToUpload = new ImageLogic(
            req.body.name,
            req.body.date,
            account.email,
            albums,
            tags,
            undefined,
            imageBytes
        );

        imageToUpload.create();

        res.status(201).send();
    }

    public async getAllByAlbum(req: Request, res: Response) {
        const images = await ImageLogic.getAllByAlbum(req.params.albumId);
        res.status(200).json(images);
    }

    public async getAllSorted(req: Request, res: Response) {
        const currentUser = req.user as AccountLogic;
        const currentEmail = currentUser.email;
        const albums = await AlbumLogic.getAll();
        const authorizedAlbums = albums.filter(album =>
            album.creatorAccountEmail == currentEmail || album.invitedAccountsEmails.some(email => email == currentEmail)
        );

        const stringToFilter = req.params.tagOrName;
        const images = await ImageLogic.getAllSorted(stringToFilter);
        const authorizedImages = images.filter(image =>
            image.albumIds.some(id => {
                    return authorizedAlbums.some(album => album.id?.toString() === id);
                }
            )
        );
        console.log(authorizedImages.map(img => img.name));
        res.status(200).json(authorizedImages);
    }
}
