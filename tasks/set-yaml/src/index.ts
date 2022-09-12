import * as tl from 'azure-pipelines-task-lib/task';
import * as yaml from 'js-yaml'

import { readFileSync, writeFileSync } from 'fs'

export async function run(): Promise<void> {
  try {
    const path: string = tl.getPathInputRequired('path', true);
    const inputKey: string = tl.getInputRequired('key').trim();
    const inputValue: string = tl.getInputRequired('value').trim();

    console.log(`Path ${path}`);
    console.log(`Key ${inputKey}`);
    console.log(`New Value ${inputValue}`);

    let doc: any = yaml.loadAll(readFileSync(path, 'utf8'));
    doc[inputKey] = inputValue;
    writeFileSync(path, yaml.dump(doc, {skipInvalid: true}));
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, error.message);
  }
}

run();
