import * as tl from 'azure-pipelines-task-lib/task';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExistence(filePath: string) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}


async function run() {

    try {

        const filepath: string = tl.getInput('filePath', true) as string;
        let filecontent = tl.getInput('filecontent', true);
        const fileoverwrite = tl.getInput('fileoverwrite', true);
        const skipempty = tl.getInput('skipempty', true);
        const endWithNewLine = tl.getInput('endWithNewLine', false);

        console.log(`File path: ${filepath}`);

        if (filecontent || (!filecontent && !skipempty)) {
            filecontent = filecontent || "";

            if (filepath) {
                if (!tl.exist(filepath) || fileoverwrite) {
                    ensureDirectoryExistence(filepath);
                    if (endWithNewLine) {
                        filecontent = filecontent + "\n";
                    }
                    tl.writeFile(filepath, filecontent, 'utf8');
                    if (tl.exist(filepath)) {
                        console.log('File created');
                    } else {
                        tl.error('File not created / overwritten');
                    }
                } else {
                    tl.error('File already exists');
                }
            }
        }
    }
    catch (err) {

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();