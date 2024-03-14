import {DBModelInterface} from "../DBModelInterface";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {AccountLogic} from "../account/AccountLogic";
import {AlbumLogic} from "../album/AlbumLogic";
import {ImageLogic} from "./ImageLogic";

export class ImageDBModel implements DBModelInterface {
    public id?: string;
    public name: string;
    public date: string;
    public creatorAccountEmail: string;
    public albumIds: string[];
    public tags: string[];

    public async toLogic(): Promise<ImageLogic> {
        if (!this.id){
            throw new DisplayableJsonError(500, "impossible to parse data to ImageDBModel : missing required attributes. Check for data integrity");
        }
        const creatorAccount = await AccountLogic.getAccount(this.creatorAccountEmail);
        const albums = await Promise.all(this.albumIds.map(async albumId => await AlbumLogic.getAlbum(albumId)));
        return new ImageLogic(this.name, this.date, creatorAccount, albums, this.tags, this.id);
    }

}