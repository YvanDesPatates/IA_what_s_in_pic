import {RestdbDAO} from "../RestdbDAO";
import {AccountDBModel} from "./AccountDBModel";

export class ImageRestdbDAO extends RestdbDAO<AccountDBModel> {
    protected get collectionUrl(): string {
        return "images";
    }
    protected parseAnyFromDB(objectToParse: any): AccountDBModel {
        return new AccountDBModel(objectToParse.email, objectToParse.name, objectToParse.pwd);
    }

    async getById(id: string): Promise<AccountDBModel | null> {
        const regex = "^"+id+"$";
        const account = await this.getByField("email", regex);
        if ( !account[0]){
            return null;
        }
        return this.parseAnyFromDB(account[0]);
    }
}