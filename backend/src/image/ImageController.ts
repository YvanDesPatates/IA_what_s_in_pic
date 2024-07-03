import {Request, Response} from "express";
import {exec} from "child_process";
import fs from "fs";
import path from "path";

export class ImageController {

    public async predictImage(req: Request, res: Response): Promise<void> {
        if (!req.body?.image){
            res.status(400).send("No image uploaded");
            return;
        }

        const base64Image = req.body.image;
        const binaryData = Buffer.from(base64Image.replace(/^data:[a-zA-Z]+\/[a-zA-Z0-9-.+]*;base64,/, ''), 'base64');

        // Write the buffer to a temporary file to be processed by the Python script
        const tempImagePath = path.join(__dirname, "../uploads", `${Date.now()}tmp.webp`);
        fs.writeFileSync(tempImagePath, binaryData);

        const outputName = 'results.txt';

        // Execute the Python compression script
        exec(`python3 Predict.py "${tempImagePath}" "${outputName}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                res.status(500).send(`Error during prediction: ${stderr}`);
                return;
            }

            // get text from results.txt file
            const result = fs.readFileSync(outputName, "utf-8");
            // Clean up the temporary image file
            fs.unlinkSync(tempImagePath);
            res.status(201).send({prediction: result});
        });

    }

}
