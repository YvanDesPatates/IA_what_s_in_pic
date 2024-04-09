import {assertAttributeExists} from "../util/attribute_assertions";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {LogicInterface} from "../LogicInterface";
import {AlbumDTO} from "./AlbumDTO";
import {AlbumDBModel} from "./AlbumDBModel";
import {AlbumRestdbDAO} from "./DAOs/AlbumRestdbDAO";

export class AlbumLogic implements LogicInterface {
  private _id?: string;
  private _name: string;
  private _creatorAccountEmail: string;
  private _invitedAccountsEmails: string[];

  private _albumDAO = new AlbumRestdbDAO();

  public constructor(
    name: string,
    creatorAccount: string,
    invitedAccounts: string[] = [],
    id?: string
  ) {
    assertAttributeExists(name, "name");
    assertAttributeExists(creatorAccount, "creatorAccount");

    this._name = name;
    this._creatorAccountEmail = creatorAccount;
    this._invitedAccountsEmails = invitedAccounts;
    this._id = id;
  }

  //#region public methods
  public getDisplayableCopy(): AlbumDTO {
    if (!this._id) {
      throw new Error("DTO need an ID to be constructed");
    }
    return {
      id: this._id,
      name: this._name,
      creatorAccountEmail: this._creatorAccountEmail,
      invitedAccountsEmails: this.invitedAccountsEmails
    };
  }

  public async create(): Promise<AlbumLogic> {
    const album = await this._albumDAO.create(this.toDBModel());
    return album.toLogic();
  }

  public static async delete(id: string): Promise<void> {
    const dao = new AlbumRestdbDAO();
    await AlbumLogic.assertIdExistsInDatabase(dao, id);
    if (! await dao.delete(id.toString())) {
      throw new DisplayableJsonError(500, "Error when deleting album");
    }
  }

  public async update(id: string): Promise<AlbumLogic> {
    await AlbumLogic.assertIdExistsInDatabase(this._albumDAO, id);
    await this._albumDAO.delete(id.toString());
    return await this.create();
  }
  //#endregion

    //#region static methods
    public static async getAlbum(id: string): Promise<AlbumLogic>{
        await AlbumLogic.assertIdExistsInDatabase(new AlbumRestdbDAO(), id);
        const album = await new AlbumRestdbDAO().getById(id.toString());
        if ( ! album){ throw new DisplayableJsonError(500, "Error when getting album"); }
        return album.toLogic();
    }

    static async getAll(): Promise<AlbumLogic[]> {
        const albums = await new AlbumRestdbDAO().getAll();
        return await Promise.all(albums.map(async album => await album.toLogic()));
    }
    //#endregion

  private static async assertIdExistsInDatabase(
    albumDAO: AlbumRestdbDAO,
    id: string
  ): Promise<void> {
    if (! await albumDAO.idExists(id)) {
      throw new DisplayableJsonError(
        404,
        "Album not found with the email " + id
      );
    }
  }

  private toDBModel(): AlbumDBModel {
    return new AlbumDBModel(
      this._name,
      this._creatorAccountEmail,
      this._invitedAccountsEmails.map((account) => account),
      this._id
    );
  }
  //#endregion

  //#region getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get creatorAccountEmail(): string {
    return this._creatorAccountEmail;
  }

  get invitedAccountsEmails(): string[] {
    return this._invitedAccountsEmails;
  }
  //#endregion
}
