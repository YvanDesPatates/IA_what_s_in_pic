import {MongoDAO} from "../../DAOs/MongoDAO";
import {AccountDBModel} from "../AccountDBModel";
import {Collection} from "mongodb";
import {DisplayableJsonError} from "../../displayableErrors/DisplayableJsonError";

export class AccountMongoDAO extends MongoDAO<AccountDBModel> {
    private static readonly collection = 'accounts';

    protected async getCollection(): Promise<Collection> {
        await this.connect();
        if (!MongoDAO.db){
            throw new DisplayableJsonError(500, "MongoDAO error, db should be initialized");
        }
        return MongoDAO.db.collection(AccountMongoDAO.collection);
    }

    protected parseAnyFromDB(objectToParse: any): AccountDBModel {
        return new AccountDBModel(objectToParse.email, objectToParse.name, objectToParse.pwd);
    }

    /** overwritten to use email as id*/
    async create(newElement: AccountDBModel): Promise<AccountDBModel> {
        await this.connect();
        const collection = await this.getCollection();
        await collection.insertOne(newElement);
        if (!newElement.email){
            throw new DisplayableJsonError(500, "missing email attribute");
        }
        const result = this.getById(newElement.email);
        if (!result){
            throw new DisplayableJsonError(500, "error while creating element. Element may be not inserted");
        }
        return result;
    }

    /** overwritten to use email as id*/
    protected getIdFilter(id: string) {
        return {email: id};
    }

}