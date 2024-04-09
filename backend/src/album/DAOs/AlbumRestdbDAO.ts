import {RestdbDAO} from "../../DAOs/RestdbDAO";
import {AlbumDBModel} from "../AlbumDBModel";

export class AlbumRestdbDAO extends RestdbDAO<AlbumDBModel>{
    protected get collectionUrl(): string {
        return "albums";
    }
    protected parseAnyFromDB(objectToParse: any): AlbumDBModel {
        return new AlbumDBModel(objectToParse.name, objectToParse.creatorAccountEmail, objectToParse.invitedAccountsEmail, objectToParse._id);
    }

}