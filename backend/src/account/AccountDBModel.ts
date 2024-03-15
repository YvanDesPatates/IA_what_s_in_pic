import {DBModelInterface} from "../DBModelInterface";
import {AccountLogic} from "./AccountLogic";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export class AccountDBModel implements DBModelInterface{
    public email?: string;
    public name?: string;
    public pwd?: string;

    constructor(email: string, name: string, pwd: string) {
        this.email = email;
        this.name = name;
        this.pwd = pwd;
    }

    public async toLogic(): Promise<AccountLogic> {
        if (!this.email || !this.name){
            throw new DisplayableJsonError(500, "impossible to parse data to AccountDBModel : missing required attributes.");
        }
        return new AccountLogic(this.email, this.name, this.pwd);
    }
}