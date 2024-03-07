import {Request, Response} from "express";
import {AlbumLogic} from "./AlbumLogic";
import {assertAttributeExists} from "../util/attribute_assertions";
import {UnexpectedAttributeTypeError} from "../displayableErrors/UnexpectedAttributeTypeError";
import {AccountLogic} from "../account/AccountLogic";

export class AlbumController {

    public async getAllAlbums(req: Request, res: Response): Promise<void> {
        const albums: AlbumLogic[] = AlbumLogic.getAll();
        res.status(200).json(albums);
    }

    public async getAlbumById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        assertAttributeExists(id, "id");
        try {
            const album: AlbumLogic = AlbumLogic.getAlbum(parseInt(id));
            res.status(200).json(album);
        } catch (error){
            throw new UnexpectedAttributeTypeError("id", "integer");
        }
    }

    public async createAlbum(req: Request, res: Response): Promise<void> {
        assertAttributeExists(req.body.creatorEmail, "creatorEmail");
        const accountCreator = AccountLogic.getAccount(req.body.creatorEmail);
        let invitedAccounts = [];
        if ( req.body.invitedAccountsEmail){
            invitedAccounts = req.body.invitedAccountsEmail.map( (email: string) => AccountLogic.getAccount(email) );
        }
        const albumToCreate: AlbumLogic = new AlbumLogic(req.body.name, accountCreator, invitedAccounts);
        res.status(201).json( await albumToCreate.create());
    }


    public async deleteAlbum(req: Request, res: Response): Promise<void> {
        const idToDelete = req.params.id;
        try {
            const id = parseInt(idToDelete);
            AlbumLogic.delete(id);
            res.status(200).json(null);
        } catch (error){
            throw new UnexpectedAttributeTypeError("id", "integer");
        }
    }

}