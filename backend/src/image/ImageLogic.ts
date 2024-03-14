import {LogicInterface} from "../LogicInterface";
import {AccountLogic} from "../account/AccountLogic";
import {AlbumLogic} from "../album/AlbumLogic";

export class ImageLogic implements LogicInterface{
    private id?: string;
    private name: string;
    private date: string;
    private creatorAccount: AccountLogic;
    private albums: AlbumLogic[];
    private tags: string[];
    constructor(name: string, date: string, creatorAccount: AccountLogic, albums: AlbumLogic[], tags: string[], id?: string){
        this.id = id;
        this.name = name;
        this.date = date;
        this.creatorAccount = creatorAccount;
        this.albums = albums;
        this.tags = tags;
    }

    //#public methods
    getDisplayableCopy(): object {
        return {};
    }
    //#endregion

    //#region getters
    public getId(): string | undefined {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDate(): string {
        return this.date;
    }
    public getCreatorAccount(): AccountLogic {
        return this.creatorAccount;
    }
    public getAlbums(): AlbumLogic[] {
        return this.albums;
    }
    public getTags(): string[] {
        return this.tags;
    }
    //#endregion

}