import {JsonDAO} from "../DAOs/JsonDAO";
import {AlbumDBModel} from "./AlbumDBModel";

export class AlbumJsonDAO extends JsonDAO<AlbumDBModel> {
    getFileName(): string {
        return "album.json";
    }

    protected compareElementToId(element: AlbumDBModel, id: string): boolean {
        return element.id === id;
    }

    protected parseAnyFromDB(objectToParse: any): AlbumDBModel {
        return new AlbumDBModel(objectToParse.name, objectToParse.creatorAccountEmail, objectToParse.invitedAccountsEmail, objectToParse.id);
    }

    //ovveride to create autoId
    create(newElement: AlbumDBModel): AlbumDBModel {
        const albums = this.getAll();
        if (albums.length > 0) {
            const albumWithMaxId = albums.reduce((prev, current) => (prev && parseInt(<string>prev.id) > parseInt(<string>current.id)) ? prev : current);
            const newId = parseInt(<string>albumWithMaxId.id) + 1;
            newElement.id = newId.toString();
        } else {
            newElement.id = "1";
        }

        return super.create(newElement);
    }
}