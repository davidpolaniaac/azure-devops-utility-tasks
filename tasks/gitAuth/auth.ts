import * as tl from 'azure-pipelines-task-lib/task';
import { IExecSyncResult, ToolRunner , IExecOptions } from 'azure-pipelines-task-lib/toolrunner';

async function run() {

    try {
        console.log("Configuring...");
        const server : string = tl.getVariable('System.TeamFoundationCollectionUri') as string;
        const auth: string = tl.getVariable('SYSTEM_ACCESSTOKEN') as string;
        const toolPath = tl.which('git', true);
        const tool: ToolRunner = tl.tool(toolPath).arg(['config', '--global', `http.${server}.extraheader`, `AUTHORIZATION: bearer ${auth}`]);

        let options: IExecOptions = {
            failOnStdErr: false,
            errStream: process.stdout,
            outStream: process.stdout,
            ignoreReturnCode: true,
            silent: true,
            shell: true
        };

        const result: IExecSyncResult = tool.execSync(options);

        if (result.error) {
            console.log(result.error.name);
            throw new Error(result.error.message);
        } else {
            console.log("Authentication completed");
        }

    } catch (err) {
        console.log(err.message);
        tl.setResult(tl.TaskResult.Failed, "Authentication failed");
    }
}

run();