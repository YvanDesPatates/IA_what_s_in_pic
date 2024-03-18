import {DisplayableJsonError} from "./displayableErrors/DisplayableJsonError";
import {DBModelInterface} from "./DBModelInterface";
import axios, {AxiosRequestConfig} from "axios";
import {DAOInterface} from "./DAOInterface";

export abstract class RestdbDAO<T extends DBModelInterface> implements DAOInterface<T>{
    private readonly DBconfig: AxiosRequestConfig = {
        baseURL: process.env.DB_BASE_URL,
        headers: {'x-apikey': process.env.DB_API_KEY},
    };

    protected abstract get collectionUrl(): string;

    protected abstract parseAnyFromDB(objectToParse: any): T;

    //#region public methods
    public async getAll(): Promise<T[]> {
        const config = this.DBconfig;
        config.method = 'get';
        config.url = this.collectionUrl;
        try {
            const response = await axios(config);
            const result = response.data;
            return result.map((jsonObject: any) => this.parseAnyFromDB(jsonObject));
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status && e.response.statusText) {
                throw new DisplayableJsonError(e.response.status, e.response.statusText);
            } else throw e;
        }
    }

    public async getById(id: string): Promise<T | null> {
        const config = this.DBconfig;
        config.method = 'get';
        config.url = this.collectionUrl + '/' + id;
        try {
            const response = await axios(config);
            return this.parseAnyFromDB(response.data);
        } catch (e) {
            return null;
        }
    }

    public async create(newElement: T): Promise<T> {
        const config = this.DBconfig;
        config.method = 'post';
        config.url = this.collectionUrl;
        config.data = newElement;
        try {
            const response = await axios(config);
            return this.parseAnyFromDB(response.data);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status && e.response.statusText) {
                throw new DisplayableJsonError(e.response.status, e.response.statusText);
            } else throw e;
        }
    }

    public async delete(id: string): Promise<boolean> {
        const config = this.DBconfig;
        config.method = 'delete';
        config.url = this.collectionUrl + '/' + id;
        if (! await this.idExists(id)){
            return false;
        }
        try {
            const response = await axios(config);
            return response.status >= 200 && response.status <= 299;
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status && e.response.statusText) {
                throw new DisplayableJsonError(e.response.status, e.response.statusText);
            } else throw e;
        }
    }

    public async idExists(id: string): Promise<boolean> {
        return await (this.getById(id)) !== null;
    }

    protected async getByField(field: string, regex: string): Promise<T[]> {
        const config = this.DBconfig;
        config.method = 'get';
        config.url = this.collectionUrl+'?q={"'+field+'" : {"$regex" : "'+regex+'"}}';
        try {
            const response = await axios(config);
                return response.data;
        } catch (e) {
            return [];
        }
    }

    //#endregion


}