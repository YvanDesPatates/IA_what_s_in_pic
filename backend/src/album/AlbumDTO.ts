import {AccountDTO} from "../account/AccountDTO";

export interface AlbumDTO {
    id: string;
    name: string;
    creatorAccount: AccountDTO;
    invitedAccounts: AccountDTO[];
}
