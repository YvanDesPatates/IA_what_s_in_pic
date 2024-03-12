import {assertAttributeExists, assertAttributeType_number} from "../util/attribute_assertions";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {LogicInterface} from "../LogicInterface";
import {AlbumJsonDAO} from "./albumJsonDAO";
import {AlbumDTO} from "./AlbumDTO";
import {AlbumDBModel} from "./AlbumDBModel";
import {AccountLogic} from "../account/AccountLogic";

export class AlbumLogic implements LogicInterface {
  private _id?: number;
  private _name: string;
  private _creatorAccount: AccountLogic;
  private _invitedAccounts: AccountLogic[];

  private _albumJsonDAO: AlbumJsonDAO = new AlbumJsonDAO();

  public constructor(
    name: string,
    creatorAccount: AccountLogic,
    invitedAccounts: AccountLogic[] = [],
    id?: number
  ) {
    assertAttributeExists(name, "name");
    assertAttributeExists(creatorAccount, "creatorAccount");

    if (id) {
      assertAttributeType_number(id, "id");
      this._id = id;
    }

    this._name = name;
    this._creatorAccount = creatorAccount;
    this._invitedAccounts = invitedAccounts;
  }

  //#region public methods
  public getDisplayableCopy(): AlbumDTO {
    if (!this._id) {
      throw new Error("DTO need an ID to be constructed");
    }
    return {
      id: this._id,
      name: this._name,
      creatorAccount: this._creatorAccount.getDisplayableCopy(),
      invitedAccounts: this._invitedAccounts.map((account) =>
        account.getDisplayableCopy()
      ),
    };
  }

  public async create(): Promise<AlbumLogic> {
    return this._albumJsonDAO.create(this.toDBModel()).toLogic();
  }

  public static delete(id: number): void {
    const dao = new AlbumJsonDAO();
    AlbumLogic.assertIdExistsInDatabase(dao, id);
    if (!dao.delete(id.toString())) {
      throw new DisplayableJsonError(500, "Error when deleting album");
    }
  }

  public async update(id: number): Promise<AlbumLogic> {
    AlbumLogic.assertIdExistsInDatabase(this._albumJsonDAO, id);
    this._albumJsonDAO.delete(id.toString());
    return this.create();
  }
  //#endregion

    //#region static methods
    public static async getAlbum(id: number): Promise<AlbumLogic>{
        AlbumLogic.assertIdExistsInDatabase(new AlbumJsonDAO(), id);
        const album = new AlbumJsonDAO().getById(id.toString());
        if ( ! album){ throw new DisplayableJsonError(500, "Error when getting album"); }
        return album.toLogic();
    }

    static async getAll(): Promise<AlbumLogic[]> {
        const albums = await new AlbumJsonDAO().getAll();
        return await Promise.all(albums.map(async album => album.toLogic()));
    }
    //#endregion

  private static assertIdExistsInDatabase(
    albumDAO: AlbumJsonDAO,
    id: number
  ): void {
    if (!albumDAO.idExists(id.toString())) {
      throw new DisplayableJsonError(
        404,
        "Album not found with the email " + id
      );
    }
  }

  private toDBModel(): AlbumDBModel {
    return new AlbumDBModel(
      this._name,
      this._creatorAccount.email,
      this._invitedAccounts.map((account) => account.email),
      this._id
    );
  }
  //#endregion

  //#region getters

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get creatorAccount(): AccountLogic {
    return this._creatorAccount;
  }

  get invitedAccounts(): AccountLogic[] {
    return this._invitedAccounts;
  }

  //#endregion
}
