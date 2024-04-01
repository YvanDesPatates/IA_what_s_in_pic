import {DAOInterface} from "./DAOInterface";
import {DBModelInterface} from "./DBModelInterface";
import {Db, MongoClient} from "mongodb";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export abstract class MongoDAO<T extends DBModelInterface> implements DAOInterface<T> {
    private static client: MongoClient|null = null;
    private static db: Db|null = null;

    constructor() {
        if (!MongoDAO.client) {
            if (!process.env.MONGODB_URL) {
                throw new DisplayableJsonError(500, "configuration error, no entry for MONGODB_URL");
            }
            MongoDAO.client = new MongoClient(process.env.MONGODB_URL);
        }
    }

    async connect(): Promise<void> {
        if (!MongoDAO.client){
            throw new DisplayableJsonError(500, "mongo cliente should be instanciated to connect");
        }
        if (!MongoDAO.db) {
            await MongoDAO.client.connect();
            MongoDAO.db = MongoDAO.client.db(process.env.MONGODB_DB_NAME);
        }
    }

    create(newElement: T): Promise<T> {
        return Promise.resolve(undefined);
    }

    delete(id: string): Promise<boolean> {
        return Promise.resolve(id == id);
    }

    getAll(): Promise<T[]> {
        return Promise.resolve([]);
    }

    getById(id: string): Promise<T | null> {
        return Promise.resolve(id == id ? null : null);
    }

    idExists(id: string): Promise<boolean> {
        return Promise.resolve(id === id);
    }

}