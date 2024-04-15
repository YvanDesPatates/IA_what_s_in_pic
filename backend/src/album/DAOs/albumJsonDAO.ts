import {JsonDAO} from "../../DAOs/JsonDAO";
import {AlbumDBModel} from "../AlbumDBModel";

export class AlbumJsonDAO extends JsonDAO<AlbumDBModel> {
    getFileName(): string {
        return "album.json";
    }

    protected compareElementToId(element: AlbumDBModel, id: string): boolean {
        return element._id === id;
    }

    protected parseAnyFromDB(objectToParse: any): AlbumDBModel {
        return new AlbumDBModel(objectToParse.name, objectToParse.creatorAccountEmail, objectToParse.invitedAccountsEmail, objectToParse.id);
    }

    //ovveride to create autoId
    create(newElement: AlbumDBModel): AlbumDBModel {
        const albums = this.getAll();
        if (albums.length > 0) {
            const albumWithMaxId = albums.reduce((prev, current) => (prev && parseInt(<string>prev._id) > parseInt(<string>current._id)) ? prev : current);
            const newId = parseInt(<string>albumWithMaxId._id) + 1;
            newElement._id = newId.toString();
        } else {
            newElement._id = "1";
        }

        return super.create(newElement);
    }
}