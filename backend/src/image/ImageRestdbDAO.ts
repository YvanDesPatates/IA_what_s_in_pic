import {RestdbDAO} from "../RestdbDAO";
import {ImageDBModel} from "./ImageDBModel";
import * as fs from "fs";
import {MissingAttributeError} from "../displayableErrors/MissingAttributeError";
import {DisplayableJsonError} from "../displayableErrors/DisplayableJsonError";

export class ImageRestdbDAO extends RestdbDAO<ImageDBModel> {
    private commonPath: string = "imgs/";

    //create file and data repository if not exists
    public constructor() {
        super();
        if (!fs.existsSync(this.commonPath)){
            fs.mkdirSync(this.commonPath);
        }
    }

    //#region overrides methods
    protected get collectionUrl(): string {
        return "images";
    }

    /**
     * warning, it don't throws error if no image is found in fileSystem, it just put imageBytes to an empty array;
     */
    protected parseAnyFromDB(objectToParse: any): ImageDBModel {
        const id = objectToParse._id;
        let imageBytes: number[] = [];
        if ( ! id){
            throw new MissingAttributeError("_id");
        }
        if ( fs.existsSync(this.getImagePath(id))){
            const imageBuffer = fs.readFileSync(this.getImagePath(id));
            imageBytes = this.getImageBytesFromBuffer(imageBuffer);
        }
        return new ImageDBModel(imageBytes, objectToParse.name, objectToParse.date, objectToParse.creatorAccountEmail, objectToParse.albumIds, objectToParse.tags, objectToParse._id);
    }

    async getById(id: string): Promise<ImageDBModel | null> {
        const regex = "^"+id+"$";
        const image = await this.getByField("email", regex);
        if ( !image[0]){
            return null;
        }
        return this.parseAnyFromDB(image[0]);
    }

    /**
     * override create method to create image in filesystem before create metadata in restDB
     */
    async create(newElement: ImageDBModel): Promise<ImageDBModel> {
        if ( ! newElement.imageBytes){
            throw new MissingAttributeError("imageBytes");
        }
        const savedImageBytes = newElement.imageBytes;
        newElement.imageBytes = undefined;
        const createdElement = await super.create(newElement);

        if ( ! createdElement.id){
            throw new MissingAttributeError("_id");
        }
        if (fs.existsSync(this.getImagePath(createdElement.id))){
            throw new DisplayableJsonError(409, "an image with this id already exists");
        }
        const imageBuffer = this.getBufferFromBytes(savedImageBytes);
        fs.writeFileSync(this.getImagePath(createdElement.id), imageBuffer);

        createdElement.imageBytes = savedImageBytes;
        return createdElement;
    }
    /**
     * override delete method to delete image in filesystem before delete metadata in restDB
     */
    async delete(id: string): Promise<boolean> {
        if ( ! fs.existsSync(this.getImagePath(id))){
            throw new DisplayableJsonError(404, "image not found in file system with id : "+ id);
        }
        fs.rmSync(this.getImagePath(id));

        return super.delete(id);
    }

//#endregion

    //#region private methods
    private getImagePath(imageId:string): string{
        return this.commonPath+imageId+".webp";
    }

    private getBufferFromBytes(imageBytes: number[]): Buffer {

        const imageBuffer = Buffer.from(imageBytes);
        for(let byte=0; byte<imageBytes.length; byte++) {
            imageBuffer[byte] = imageBytes[byte];
        }
        return imageBuffer;
    }

    private getImageBytesFromBuffer(buffer: Buffer): number[] {
        const imageBytes = [];
        for(let byte=0; byte<buffer.length; byte++) {
            imageBytes[byte] = buffer[byte];
        }
        return imageBytes;
    }
    //#endRegion
}