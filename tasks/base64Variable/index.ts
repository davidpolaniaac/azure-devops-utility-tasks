import tl = require('azure-pipelines-task-lib/task');

async function run() {

    try {

        const variableName: string = tl.getInput("variableName", true) as string;
        const data: string = tl.getVariable(variableName) as string;
        const buff = new Buffer(data);
        const base64data = buff.toString('base64');

        console.log('"' + data + '" converted to Base64 is "' + base64data + '"');

    }
    catch (err) {

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();