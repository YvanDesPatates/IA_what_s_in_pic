import {LogicInterface} from "../LogicInterface";
import {ImageRestdbDAO} from "./ImageRestdbDAO";
import {ImageDBModel} from "./ImageDBModel";

export class ImageLogic implements LogicInterface{
    private id?: string;
    private name: string;
    private date: string;
    private creatorAccount: string;
    private albums: string[];
    private tags: string[];
    private imageBytes: number[] | undefined;

    constructor(name: string, date: string, creatorAccount: string, albums: string[], tags: string[], id?: string, imageBytes?: number[]){
        this.id = id;
        this.name = name;
        this.date = date;
        this.creatorAccount = creatorAccount;
        this.albums = albums;
        this.tags = tags;
        this.imageBytes = imageBytes;
    }

    //#public methods
    getDisplayableCopy(): object {
        return {};
    }

    create(): void {

        const imageToCreate = new ImageDBModel(this.imageBytes, this.name, this.date, this.creatorAccount, this.albums, this.tags, this.id);

        new ImageRestdbDAO().create(imageToCreate).then();
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
    public getCreatorAccount(): string {
        return this.creatorAccount;
    }
    public getAlbums(): string[] {
        return this.albums;
    }
    public getTags(): string[] {
        return this.tags;
    }
    //#endregion
}