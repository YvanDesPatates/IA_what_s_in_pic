import {ImageDBModel} from "../../src/image/ImageDBModel";
import fs from "fs";
import {ImageRestdbDAO} from "../../src/image/ImageRestdbDAO";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.test" });


describe("AccountLogic.ts tests", () => {

    test("fake test to avoid errors", async () => {
        expect(true).toBe(true);
    });

    test("create image save it in /imgs", async () => {
        const imageBuffer = fs.readFileSync("/home/yvan/epitech/T-DEV-800-MPL_10/backend/__tests__/image/test_photo.png");
        const imageBytes = getImageBytesFromBuffer(imageBuffer);
        const imageDbModel = new ImageDBModel(imageBytes, "name", new Date().toDateString(), "Le y", [], []);
        const createdImage = await new ImageRestdbDAO().create(imageDbModel);
        if (!createdImage.id){
            throw new Error("created image should have an id");
        }
        const gettedImage = await new ImageRestdbDAO().getById(createdImage.id);
        if ( !gettedImage || !gettedImage.imageBytes){
            throw new Error("getted image should have a buffer");
        }
        const bufferToWrite = getBufferFromBytes(gettedImage.imageBytes);
        fs.writeFileSync("__tests__/image/saved_image_from_test.webp" ,bufferToWrite);
    });

});

function getImageBytesFromBuffer(buffer: Buffer): number[] {
    const imageBytes = [];
    for (let byte = 0; byte < buffer.length; byte++) {
        imageBytes[byte] = buffer[byte];
    }
    return imageBytes;
}

function getBufferFromBytes(imageBytes: number[]): Buffer {

    const imageBuffer = Buffer.from(imageBytes);
    for (let byte = 0; byte < imageBytes.length; byte++) {
        imageBuffer[byte] = imageBytes[byte];
    }
    return imageBuffer;
}
