import {DBModelInterface} from "../DBModelInterface";
import {AlbumLogic} from "./AlbumLogic";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export class AlbumDBModel implements DBModelInterface {
    id?: string;
    name?: string;
    creatorAccountEmail?: string;
    invitedAccountsEmail?: string[];

    constructor(name: string, creatorAccountId: string, invitedAccountsId: string[], id?: string) {
        this.id = id;
        this.name = name;
        this.creatorAccountEmail = creatorAccountId;
        this.invitedAccountsEmail = invitedAccountsId;
    }

    public async toLogic(): Promise<AlbumLogic> {
        if (!this.id || !this.name || !this.creatorAccountEmail || !this.invitedAccountsEmail) {
            throw new DisplayableJsonError(500, "impossible to parse data to AlbumDBModel : missing required attributes. Check for data integrity");
        }
        return new AlbumLogic(this.name, this.creatorAccountEmail, this.invitedAccountsEmail, this.id);
    }
}