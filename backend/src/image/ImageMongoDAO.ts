import {MongoDAO} from "../DAOs/MongoDAO";
import {ImageDBModel} from "./ImageDBModel";
import {Collection} from "mongodb";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";
import fs from "fs";
import {MissingAttributeError} from "../displayableErrors/MissingAttributeError";

export class ImageMongoDAO extends MongoDAO<ImageDBModel> {
    private static readonly collection = 'images';
    private commonPath: string = "imgs/";

    //create file and data repository if not exists
    public constructor() {
        super();
        if (!fs.existsSync(this.commonPath)) {
            fs.mkdirSync(this.commonPath);
        }
    }

    //#region overrides methods
    protected async getCollection(): Promise<Collection> {
        await this.connect();
        if (!MongoDAO.db) {
            throw new DisplayableJsonError(500, "MongoDAO error, db should be initialized");
        }
        return MongoDAO.db.collection(ImageMongoDAO.collection);
    }

    /**
     * warning, it don't throws error if no image is found in fileSystem, it just put imageBytes to an empty array;
     */
    protected parseAnyFromDB(objectToParse: any): ImageDBModel {
        const id = objectToParse._id;
        let imageBytes: number[] = [];
        if (!id) {
            throw new MissingAttributeError("_id");
        }
        if (fs.existsSync(this.getImagePath(id))) {
            const imageBuffer = fs.readFileSync(this.getImagePath(id));
            imageBytes = this.getImageBytesFromBuffer(imageBuffer);
        }
        return new ImageDBModel(imageBytes, objectToParse.name, objectToParse.date, objectToParse.creatorAccountEmail, objectToParse.albumIds, objectToParse.tags, objectToParse._id);
    }

    /**
     * override create method to create image in filesystem and create metadata in restDB
     */
    async create(newElement: ImageDBModel): Promise<ImageDBModel> {
        if (!newElement.imageBytes) {
            throw new MissingAttributeError("imageBytes");
        }
        const savedImageBytes = newElement.imageBytes;
        newElement.imageBytes = undefined;
        const createdElement = await super.create(newElement);

        if (!createdElement.id) {
            throw new MissingAttributeError("_id");
        }
        if (fs.existsSync(this.getImagePath(createdElement.id))) {
            throw new DisplayableJsonError(409, "an image with this id already exists");
        }
        const imageBuffer = this.getBufferFromBytes(savedImageBytes);
        fs.writeFileSync(this.getImagePath(createdElement.id), imageBuffer);

        createdElement.imageBytes = savedImageBytes;
        return createdElement;
    }

    /**
     * override delete method to delete image in filesystem and delete metadata in restDB
     */
    async delete(id: string): Promise<boolean> {
        if (!fs.existsSync(this.getImagePath(id))) {
            throw new DisplayableJsonError(404, "image not found in file system with id : " + id);
        }
        fs.rmSync(this.getImagePath(id));

        return super.delete(id);
    }

    public async getAllByAlbum(albumId: string){
        return await this.getMany({ "albumIds": { $in: [albumId] } });
    }

//#endregion

    //#region private methods
    private getImagePath(imageId: string): string {
        return this.commonPath + imageId + ".webp";
    }

    private getBufferFromBytes(imageBytes: number[]): Buffer {

        const imageBuffer = Buffer.from(imageBytes);
        for (let byte = 0; byte < imageBytes.length; byte++) {
            imageBuffer[byte] = imageBytes[byte];
        }
        return imageBuffer;
    }

    private getImageBytesFromBuffer(buffer: Buffer): number[] {
        const imageBytes = [];
        for (let byte = 0; byte < buffer.length; byte++) {
            imageBytes[byte] = buffer[byte];
        }
        return imageBytes;
    }

    //#endRegion
}