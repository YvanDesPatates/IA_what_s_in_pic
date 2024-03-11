import { Request, Response } from "express";
import { AlbumLogic } from "./AlbumLogic";
import { assertAttributeExists } from "../util/attribute_assertions";
import { UnexpectedAttributeTypeError } from "../displayableErrors/UnexpectedAttributeTypeError";
import { AccountLogic } from "../account/AccountLogic";
import { DisplayableJsonError } from "../displayableErrors/DisplayableJsonError";

export class AlbumController {
  public async getAllAlbums(req: Request, res: Response): Promise<void> {
    const albums: AlbumLogic[] = AlbumLogic.getAll();

    // Get the user account
    const userConnected = req.user as AccountLogic;

    // Filter the albums to only show the albums from the user
    const selectedAlbums = albums.filter(
      (album) =>
        album.creatorAccount.email === userConnected.email ||
        album.invitedAccounts.some(
          (account) => account.email === userConnected.email
        )
    );

    res.status(200).json(selectedAlbums);
  }

  public async getAlbumById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    assertAttributeExists(id, "id");
    try {
      const album: AlbumLogic = AlbumLogic.getAlbum(parseInt(id));
      res.status(200).json(album);
    } catch (error) {
      throw new UnexpectedAttributeTypeError("id", "integer");
    }
  }

  public async createAlbum(req: Request, res: Response): Promise<void> {
    const creator = req.user as AccountLogic;
    const accountCreator = AccountLogic.getAccount(creator.email);
    let invitedAccounts = [];
    if (req.body.invitedAccountsEmail) {
      invitedAccounts = req.body.invitedAccountsEmail.map((email: string) =>
        AccountLogic.getAccount(email)
      );
    }
    const albumToCreate: AlbumLogic = new AlbumLogic(
      req.body.name,
      accountCreator,
      invitedAccounts
    );
    res.status(201).json(await albumToCreate.create());
  }

  public async updateAlbum(req: Request, res: Response): Promise<void> {
    const idToUpdate = req.params.id;
    assertAttributeExists(idToUpdate, "id");
    try {
      const id = parseInt(idToUpdate);
      const albumToUpdate: AlbumLogic = AlbumLogic.getAlbum(id);
      const creator = req.user as AccountLogic;

      // Check if the user is the creator of the album
      if (albumToUpdate.creatorAccount.email !== creator.email) {
        throw new DisplayableJsonError(
          403,
          "You are not allowed to update this album"
        );
      }

      if (req.body.invitedAccountsEmail) {
        req.body.invitedAccountsEmail = req.body.invitedAccountsEmail
          .map((email: string) => AccountLogic.getAccount(email))
          .filter((account: AccountLogic) => account.email !== creator.email);
      }

      const updatedAlbum: AlbumLogic = new AlbumLogic(
        req.body.name ?? albumToUpdate.name,
        albumToUpdate.creatorAccount,
        req.body.invitedAccountsEmail ?? albumToUpdate.invitedAccounts,
        albumToUpdate.id
      );
      await updatedAlbum.update(id);

      res.status(200).json(updatedAlbum);
    } catch (error) {
      if (error instanceof DisplayableJsonError) {
        throw error;
      }

      throw new UnexpectedAttributeTypeError("id", "integer");
    }
  }

  public async deleteAlbum(req: Request, res: Response): Promise<void> {
    const idToDelete = req.params.id;
    try {
      const id = parseInt(idToDelete);
      AlbumLogic.delete(id);
      res.status(200).json(null);
    } catch (error) {
      if (error instanceof DisplayableJsonError) {
        throw error;
      }

      throw new UnexpectedAttributeTypeError("id", "integer");
    }
  }
}
