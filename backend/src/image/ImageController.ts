import {Request, Response} from "express";
import {execFile} from "child_process";
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

        // Assume venv is at root/backend/venv and use its python executable; fallback to system python3
        const pythonExe = (() => {
            try {
                const repoRoot = process.cwd();
                const venvPython = path.join(repoRoot, 'venv', 'bin', 'python');
                                
                if (fs.existsSync(venvPython)) return venvPython;
            } catch (e) {
                // ignore and fallback
            }
            return 'python3';
        })();
        const predictScript = path.join(process.cwd(), 'Predict.py');

        // Execute the Python prediction script using execFile to avoid shell escaping issues
        execFile(pythonExe, [predictScript, tempImagePath, outputName], (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                res.status(500).send(`Error during prediction: ${stderr}`);
                try { fs.unlinkSync(tempImagePath); } catch {};
                return;
            }

            // get text from results.txt file
            let result = '';
            try {
                result = fs.readFileSync(outputName, "utf-8");
            } catch (readErr) {
                const readErrMsg = readErr instanceof Error ? readErr.message : String(readErr);
                console.error('Failed to read output file', readErr);
                res.status(500).send({error: 'Prediction finished but failed to read results file', details: readErrMsg});
                try { fs.unlinkSync(tempImagePath); } catch {};
                return;
            }

            // Clean up the temporary image file
            try { fs.unlinkSync(tempImagePath); } catch (e) { /* ignore */ }
            res.status(201).send({prediction: result});
        });

    }

}
