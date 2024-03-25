import {DBModelInterface} from "../DBModelInterface";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {AccountLogic} from "../account/AccountLogic";
import {AlbumLogic} from "../album/AlbumLogic";
import {ImageLogic} from "./ImageLogic";

export class ImageDBModel implements DBModelInterface {
    public id?: string;
    public imageBytes?: number[];
    public name: string;
    public date: string;
    public creatorAccountEmail: string;
    public albumIds: string[];
    public tags: string[];


    constructor(imageBytes: number[] | undefined, name: string, date: string, creatorAccountEmail: string, albumIds: string[], tags: string[], id?: string | undefined) {
        this.id = id;
        this.imageBytes = imageBytes;
        this.name = name;
        this.date = date;
        this.creatorAccountEmail = creatorAccountEmail;
        this.albumIds = albumIds;
        this.tags = tags;
    }

    public async toLogic(): Promise<ImageLogic> {
        if (!this.id){
            throw new DisplayableJsonError(500, "impossible to parse data to ImageDBModel : missing required attributes. Check for data integrity");
        }

        return new ImageLogic(this.name, this.date, this.creatorAccountEmail, this.albumIds, this.tags, this.id);
    }

}