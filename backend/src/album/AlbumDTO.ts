import {AccountDTO} from "../account/AccountDTO";

export interface AlbumDTO {
    id: string;
    name: string;
    creatorAccountEmail: string;
    invitedAccountsEmails: string[];
}
