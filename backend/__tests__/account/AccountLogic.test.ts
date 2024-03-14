import {AccountLogic} from "../../src/account/AccountLogic";
import {DisplayableJsonError} from "../../src/displayableErrors/DisplayableJsonError";
import {MissingAttributeError} from "../../src/displayableErrors/MissingAttributeError";
import {AccountRestdbDAO} from "../../src/account/AccountRestdbDAO";

const mockFunctions: Array<jest.SpyInstance> = [];

describe("AccountLogic.ts tests", () => {
    beforeAll(() => {
        //avoid saving test data in the database
        mockFunctions.push(mockDaocreate());
        mockFunctions.push(mockDaoDelete());
    });

    afterAll(() => {
       mockFunctions.forEach(mockFunction => mockFunction.mockReset());
    });

    test("create account with unused email", async () => {
        const idExistsMock = mockDaoIdExists(async () => false);
        const accountToCreate = await new AccountLogic("emaileeeee", "name", "pwd");
        const createdAccount = accountToCreate.create();
        expect(createdAccount).toBeInstanceOf(AccountLogic);

        idExistsMock.mockReset();
    });

    test("create account without pwd is impossible", async () => {
        expect(async () => await new AccountLogic("email", "name").create())
            .toThrow(MissingAttributeError);
    });

    test("create account with blank pwd is impossible", async () => {
        expect(async () => await new AccountLogic("email", "name", "").create())
            .toThrow(DisplayableJsonError);
    });

    test("create account with existing email is impossible", async () => {
        const idExistsMock = mockDaoIdExists();
        expect(async () => await new AccountLogic("email", "name", "pwd").create())
            .toThrow(DisplayableJsonError);

        idExistsMock.mockReset();
    });

    test("update account", async () => {
        const idExistsMock = mockDaoIdExists(async id => id === "email");
        const updatedAccount = await new AccountLogic("newEmail", "name", "pwd").update("email");
        expect(updatedAccount).toBeInstanceOf(AccountLogic);
        expect(updatedAccount).toHaveProperty("email", "newEmail");

        idExistsMock.mockReset();
    });

    test("update account with existing email is impossible", async () => {
        const idExistsMock = mockDaoIdExists();
        expect(async () => await new AccountLogic("newEmail", "name", "pwd").update("email"))
            .toThrow(DisplayableJsonError);

        idExistsMock.mockReset();
    });

    test("update account without pwd is impossible", async () => {
        const idExistsMock = mockDaoIdExists(async id => id === "email");
        expect(async () => await new AccountLogic("newEmail", "name").update("email"))
            .toThrow(MissingAttributeError);

        idExistsMock.mockReset();
    });

    test("delete account", async () => {
        const idExistsMock = mockDaoIdExists();
        await new AccountLogic("newEmail", "name", "pwd").delete();

        idExistsMock.mockReset();
    });

    test("delete account with non existing email throw 404 error", async () => {
        const idExistsMock = mockDaoIdExists(async () => false);
        expect(async () => await new AccountLogic("newEmail", "name", "pwd").delete())
            .toThrow(DisplayableJsonError);

        idExistsMock.mockReset();
    });

});

//#region mocks methods
/**
 * Mock the idExists method of AccountJsonDAO
 * @param mockFunction is the return value the mocked function will return, by default it returns true
 */
function mockDaoIdExists(mockFunction: (id: string) => Promise<boolean> = async () => true) {
    return jest
        .spyOn(AccountRestdbDAO.prototype, 'idExists')
        .mockImplementation(mockFunction);
}

function mockDaocreate() {
    return jest
        .spyOn(AccountRestdbDAO.prototype, 'create')
        .mockImplementation(async (account) => account);
}

function mockDaoDelete(returnValue: boolean = true) {
    return jest
        .spyOn(AccountRestdbDAO.prototype, 'delete')
        .mockImplementation(async () => returnValue);
}
//#endregion
