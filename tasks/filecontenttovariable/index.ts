import * as tl from 'azure-pipelines-task-lib/task';
import * as common from 'azure-devops-task-utils';
import * as fs from 'fs';

async function run() {

    try {

        common.banner('Init Configuration');
        const releaseId: string = tl.getVariable("RELEASE_RELEASEID") as string;
        const variableName: string = tl.getInput('variableName', true) as string;
        const filePath: string = tl.getInput('filePath', true) as string;
        common.heading(variableName);
        common.heading(filePath);
        common.banner("Set variables");
        const data = fs.readFileSync(filePath);
        console.log("Synchronous read: " + data.toString());
        const value = data.toString();
        await common.setReleaseVariable(Number(releaseId), variableName, value);
        common.heading(`the variable ${variableName} changed to ${value}`);
    }
    catch (err) {

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();