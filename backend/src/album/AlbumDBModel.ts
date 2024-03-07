import {DBModelInterface} from "../DBModelInterface";
import {AlbumLogic} from "./AlbumLogic";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {AccountLogic} from "../account/AccountLogic";

export class AlbumDBModel implements DBModelInterface{
    id?: number;
    name?: string;
    creatorAccountEmail?: string;
    invitedAccountsEmail?: string[];

    constructor(name: string, creatorAccountId: string, invitedAccountsId: string[], id?: number) {
        this.id = id;
        this.name = name;
        this.creatorAccountEmail = creatorAccountId;
        this.invitedAccountsEmail = invitedAccountsId;
    }

    toLogic(): AlbumLogic {
        if (!this.id || !this.name || !this.creatorAccountEmail || !this.invitedAccountsEmail){
            throw new DisplayableJsonError(500, "impossible to parse data to AlbumDBModel : missing required attributes. Check for data integrity");
        }
        const creatorAccount = AccountLogic.getAccount(this.creatorAccountEmail);
        const invitedAccounts = this.invitedAccountsEmail.map( emailAccount => AccountLogic.getAccount(emailAccount) );
        return new AlbumLogic(this.name, creatorAccount, invitedAccounts, this.id);
    }
}