import {Request, Response} from "express";
import {exec} from "child_process";
import fs from "fs";
import path from "path";

export class ImageController {

    public async predictImage(req: Request, res: Response): Promise<void> {

        if (!req.file) {
            res.status(400).send("No image uploaded");
            return;
        }

        // Write the buffer to a temporary file to be processed by the Python script
        const tempImagePath = path.join(__dirname, "../uploads", `${Date.now()}_${req.file.originalname}`);
        fs.writeFileSync(tempImagePath, req.file.buffer);

        const outputName = path.join(__dirname, "../compressed", `compressed_${Date.now()}`);

        // Execute the Python compression script
        exec(`python3 Compression.py "${tempImagePath}" "${outputName}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                res.status(500).send(`Error during compression: ${stderr}`);
                return;
            }

            res.status(201).send({message: 'Image compressed successfully', outputPath: `${outputName}.webp`});

            // Clean up the temporary image file
            fs.unlinkSync(tempImagePath);
        });

    }

}
