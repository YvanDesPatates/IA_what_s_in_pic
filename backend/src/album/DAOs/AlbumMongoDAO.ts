import {MongoDAO} from "../../DAOs/MongoDAO";
import {AlbumDBModel} from "../AlbumDBModel";
import {Collection} from "mongodb";
import {DisplayableJsonError} from "../../displayableErrors/DisplayableJsonError";

export class AlbumMongoDAO extends MongoDAO<AlbumDBModel>{
    private static readonly collection = 'albums';

    protected async getCollection(): Promise<Collection> {
        await this.connect();
        if (!MongoDAO.db){
            throw new DisplayableJsonError(500, "MongoDAO error, db should be initialized");
        }
        return MongoDAO.db.collection(AlbumMongoDAO.collection);
    }

    protected parseAnyFromDB(objectToParse: any): AlbumDBModel {
        return new AlbumDBModel(objectToParse.name, objectToParse.creatorAccountEmail, objectToParse.invitedAccountsEmail, objectToParse._id);
    }

}