import {assertAttributeExists} from "../util/attribute_assertions";
import bcrypt from 'bcrypt';
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import {LogicInterface} from "../LogicInterface";
import {AccountDTO} from "./AccountDTO";
import {AccountDBModel} from "./AccountDBModel";
import {AccountRestdbDAO} from "./DAOs/AccountRestdbDAO";
import {DAOInterface} from "../DAOs/DAOInterface";
import {AccountMongoDAO} from "./DAOs/AccountMongoDAO";

export class AccountLogic implements LogicInterface {
    private _email: string;
    private _name: string;
    private _pwd?: string;

    private accountDAO: DAOInterface<AccountDBModel> = new AccountMongoDAO();
    private readonly _saltRounds: number = 10;


    public constructor(uniqueEmail: string, name: string, pwd?: string) {
        assertAttributeExists(uniqueEmail, "email");
        assertAttributeExists(name, "name");
        if (pwd && pwd.trim().length === 0) {
            throw new DisplayableJsonError(400, "pwd cannot be blank");
        }

        this._email = uniqueEmail;
        this._name = name;
        this._pwd = pwd;
    }


    //#region public methods
    public getDisplayableCopy(): AccountDTO {
        return {
            email: this.email,
            name: this.name,
        };
    }

    /**
     * Even if it's not required to construct an account object, pwd is required to save it in database
     */
    public async create(): Promise<AccountLogic> {
        assertAttributeExists(this._pwd, "pwd");
        this._pwd = await bcrypt.hash(<string>this.pwd, this._saltRounds);
            await this.assertEmailDoesNotExistsInDatabase(this._email);
        const createdAccount = await this.accountDAO.create(this.toDBModel());
        return createdAccount.toLogic();
    }

    /**
     * Update the account by deleting the old one and creating a new one, pwd field is required.
     * @param actualEmail is the email of the account to update, after the update the email could be different
     */
    public async update(actualEmail: string): Promise<AccountLogic> {
        await AccountLogic.assertEmailExistsInDatabase(this.accountDAO, actualEmail);
        this.accountDAO.delete(actualEmail);
        return this.create();
    }

    public async delete(): Promise<void> {
        await AccountLogic.assertEmailExistsInDatabase(this.accountDAO, this._email);
        if (!this.accountDAO.delete(this._email)) {
            throw new DisplayableJsonError(500, "Error when deleting account");
        }
    }

    //#endregion

    //#region static methods
    public static async getAccount(email: string): Promise<AccountLogic> {
        await AccountLogic.assertEmailExistsInDatabase(new AccountMongoDAO(), email);
        const account = await new AccountMongoDAO().getById(email);
        if (!account) {
            throw new DisplayableJsonError(500, "Error when getting account");
        }
        return account.toLogic();
    }

    static async getAll(): Promise<AccountLogic[]> {
        const accounts = await new AccountMongoDAO().getAll();
        return await Promise.all(accounts.map(async account => account.toLogic()));
    }

    static async assertAccountExists(email: string): Promise<void>{
        await this.assertEmailExistsInDatabase(new AccountMongoDAO(), email);
    }

    //#endregion

    //#region private methods
    private async assertEmailDoesNotExistsInDatabase(email: string): Promise<void> {
        if (await this.accountDAO.idExists(email)) {
            throw new DisplayableJsonError(409, "Account already exists with email " + email);
        }
    }

    private static async assertEmailExistsInDatabase(accountDAO: DAOInterface<AccountDBModel>, email: string): Promise<void> {
        if (! await accountDAO.idExists(email)) {
            throw new DisplayableJsonError(404, "Account not found with the email " + email);
        }
    }

    private toDBModel(): AccountDBModel {
        if (!this.pwd) {
            throw new Error("can't create an AccountDBModel without pwd field");
        }
        return new AccountDBModel(this.email, this.name, this.pwd);
    }

    //#endregion

    //#region getters
    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get pwd(): string | undefined {
        return this._pwd;
    }

    //#endregion
}