import {Request, Response} from "express";
import {AlbumLogic} from "./AlbumLogic";
import {assertAttributeExists} from "../util/attribute_assertions";
import {AccountLogic} from "../account/AccountLogic";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export class AlbumController {
    public async getAllAlbums(req: Request, res: Response): Promise<void> {
        const albums: AlbumLogic[] = await AlbumLogic.getAll();

        // Get the user account
        const userConnected = req.user as AccountLogic;

        // Filter the albums to only show the albums from the user
        const selectedAlbums = albums.filter(
            (album) =>
                album.creatorAccountEmail === userConnected.email ||
                album.invitedAccountsEmails.some(
                    (account) => account === userConnected.email
                )
        );

        res.status(200).json(selectedAlbums);
    }

    public async getAlbumById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        assertAttributeExists(id, "id");
        const album: AlbumLogic = await AlbumLogic.getAlbum(id);
        res.status(200).json(album);
    }

    public async createAlbum(req: Request, res: Response): Promise<void> {
        const creator = req.user as AccountLogic;
        const invitedAccountsEmail: string[] = req.body.invitedAccountsEmails;
        if (invitedAccountsEmail && invitedAccountsEmail instanceof Array) {
            for (const invitedAccount of invitedAccountsEmail) {
                await AccountLogic.assertAccountExists(invitedAccount);
            }
        }
        const albumToCreate: AlbumLogic = new AlbumLogic(
            req.body.name,
            creator.email,
            invitedAccountsEmail ?? []
        );
        res.status(201).json(await albumToCreate.create());
    }

    public async updateAlbum(req: Request, res: Response): Promise<void> {
        const idToUpdate = req.params.id;
        assertAttributeExists(idToUpdate, "id");
        const albumToUpdate: AlbumLogic = await AlbumLogic.getAlbum(idToUpdate);
        const creator = req.user as AccountLogic;

        // Check if the user is the creator of the album
        if (albumToUpdate.creatorAccountEmail !== creator.email) {
            throw new DisplayableJsonError(
                403,
                "You are not allowed to update this album"
            );
        }

        const invitedAccountsEmail = req.body.invitedAccountsEmails;
        if (invitedAccountsEmail && invitedAccountsEmail instanceof Array) {
            for (const invitedAccount of invitedAccountsEmail) {
                await AccountLogic.assertAccountExists(invitedAccount);
            }
        }

        const updatedAlbum: AlbumLogic = new AlbumLogic(
            req.body.name ?? albumToUpdate.name,
            albumToUpdate.creatorAccountEmail,
            invitedAccountsEmail ?? albumToUpdate.invitedAccountsEmails,
            albumToUpdate.id
        );
        await updatedAlbum.update(idToUpdate);

        res.status(200).json(updatedAlbum);
    }

    public async deleteAlbum(req: Request, res: Response): Promise<void> {
        const idToDelete = req.params.id;
        await AlbumLogic.delete(idToDelete);
        res.status(200).json(null);
    }
}
