import {Request, Response} from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export class ImageController {

    public async predictImage(req: Request, res: Response): Promise<void> {

        res.status(200).json("ahehehehe");

        // const account = req.user as AccountLogic;
        // if (!account) {
        //     res.status(401).send();
        //     return;
        // }
        //
        // // Convert buffer to number[]
        // const imageBytes = Array.from(req.file?.buffer ?? Buffer.alloc(0));
        // const albums = JSON.parse(req.body.albums);
        // const tags = JSON.parse(req.body.tags);
        //
        // const imageToUpload = new ImageLogic(
        //     req.body.name,
        //     req.body.date,
        //     account.email,
        //     albums,
        //     tags,
        //     undefined,
        //     imageBytes
        // );
        //
        // imageToUpload.create();
        //
        // if (!albums) {
        //     res.status(201).send();
        //     const account = req.user as AccountLogic;
        //     if (!account) {
        //         res.status(401).send("Unauthorized");
        //         return;
        //     }
        //
        //     if (!req.file) {
        //         res.status(400).send("No image uploaded");
        //         return;
        //     }
        //
        //     // Write the buffer to a temporary file to be processed by the Python script
        //     const tempImagePath = path.join(__dirname, "../uploads", `${Date.now()}_${req.file.originalname}`);
        //     fs.writeFileSync(tempImagePath, req.file.buffer);
        //
        //     const outputName = path.join(__dirname, "../compressed", `compressed_${Date.now()}`);
        //
        //     // Execute the Python compression script
        //     exec(`python3 Compression.py "${tempImagePath}" "${outputName}"`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.error(`exec error: ${error}`);
        //             res.status(500).send(`Error during compression: ${stderr}`);
        //             return;
        //         }
        //
        //         console.log(`stdout: ${stdout}`);
        //
        //         // Optionally, read the compressed file and send it back or just send a success message
        //         res.status(201).send({ message: 'Image compressed successfully', outputPath: `${outputName}.webp` });
        //
        //         // Clean up the temporary image file
        //         fs.unlinkSync(tempImagePath);
        //     });
        //
        // }

    }

}
