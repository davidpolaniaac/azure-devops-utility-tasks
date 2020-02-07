import tl = require('azure-pipelines-task-lib/task');
import * as common from 'azure-devops-task-utils';
import * as nodeApi from 'azure-devops-node-api';
import * as ReleaseInterfaces from 'azure-devops-node-api/interfaces/ReleaseInterfaces';
import * as ReleaseApi from 'azure-devops-node-api/ReleaseApi';

async function run() {

    try {

        common.banner('Init Configuration');
        const webApi: nodeApi.WebApi = await common.getWebApi();
        const releaseApi: ReleaseApi.IReleaseApi = await webApi.getReleaseApi();
        const project: string = common.getProject();
        common.heading('Project');
        common.heading(project);
        common.banner("Set variables");

        const releaseId: string = tl.getVariable("RELEASE_RELEASEID") as string;
        const variableName: string = tl.getInput('variableName', true) as string;
        const variableValue: string = tl.getInput('variableValue', true) as string;
        common.heading(variableName);
        common.heading(variableValue);

        tl.setVariable(variableName,variableValue);

        const release: ReleaseInterfaces.Release = await releaseApi.getRelease(project, Number(releaseId));

        const variableConfiguration: ReleaseInterfaces.ConfigurationVariableValue = {
            allowOverride: true,
            isSecret: false,
            value: variableValue
        }

        if(release.variables){
            release.variables[variableName] = variableConfiguration ;
            await releaseApi.updateRelease(release,project,Number(releaseId));
        }else{
            tl.setResult(tl.TaskResult.Failed, "Variables is undefined");
        }
        
        common.heading(`the variable ${variableName} changed to ${variableValue}`);
    }
    catch (err) {

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();