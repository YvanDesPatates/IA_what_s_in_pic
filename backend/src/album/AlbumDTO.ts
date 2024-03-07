import {AccountDTO} from "../account/AccountDTO";

export interface AlbumDTO {
    id: number;
    name: string;
    creatorAccount: AccountDTO;
    invitedAccounts: AccountDTO[];
}
