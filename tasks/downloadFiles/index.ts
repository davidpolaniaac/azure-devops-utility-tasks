import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import * as common from './common';
import * as nodeApi from 'azure-devops-node-api';
import * as GitApi from 'azure-devops-node-api/GitApi';
import * as GitInterfaces from 'azure-devops-node-api/interfaces/GitInterfaces';

const WorkingDirectory: string = tl.getVariable("System.DefaultWorkingDirectory") as string;


async function downloadFile(nameRepository : string, path: string) {

    common.banner('Git Configuration');

    const webApi: nodeApi.WebApi = await common.getWebApi();
    const gitApiObject: GitApi.IGitApi = await webApi.getGitApi();
    const project: string = common.getProject();
    common.heading('Project');
    common.heading(project);

    try{

        common.banner("Download file");
        const file: NodeJS.ReadableStream = await gitApiObject.getItemContent(nameRepository,path,project,undefined,undefined,true,true,true,undefined,true,false);
        const arrayNames: string[] = path.split("/");
        const nameFile: string = arrayNames[arrayNames.length - 1]; 
        let wstream = fs.createWriteStream(WorkingDirectory+"/"+nameFile);
        file.pipe(wstream);
    }
    catch (err) {
        console.log(err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }

}

async function run() {

    try {

        const inputPathfile: string = tl.getInput('pathFile', true) as string;
        const inputReportName: string = tl.getInput('nameRepository', true) as string;
        await downloadFile(inputReportName,inputPathfile);

    }
    catch (err) {

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();