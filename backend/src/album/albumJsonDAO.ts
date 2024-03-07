import {JsonDAO} from "../JsonDAO";
import {AlbumDBModel} from "./AlbumDBModel";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export class AlbumJsonDAO extends JsonDAO<AlbumDBModel> {
    getFileName(): string {
        return "album.json";
    }

    protected compareElementToId(element: AlbumDBModel, id: string): boolean {
        const intId = parseInt(id);
        if (isNaN(intId)){
            throw new DisplayableJsonError(500, "error while parsing from database, Id was supposed to be an interger. Check for data integrity");
        }
        return element.id === parseInt(id);
    }

    protected parseAnyFromDB(objectToParse: any): AlbumDBModel {
        return new AlbumDBModel(objectToParse.name, objectToParse.creatorAccountEmail, objectToParse.invitedAccountsEmail, objectToParse.id);
    }

    //ovveride to create autoId
    create(newElement: AlbumDBModel): AlbumDBModel {
        const albums = this.getAll();
        if (albums.length > 0) {
            const albumWithMaxId = albums.reduce((prev, current) => (prev && <number>prev.id > <number>current.id) ? prev : current);
            newElement.id = <number>albumWithMaxId.id + 1;
        } else {
            newElement.id = 1;
        }

        return super.create(newElement);
    }
}