import { spawnSync } from 'node:child_process';
import process from 'node:process';

import { GODOT_DIRECTORY, requireGodotBinary } from './godot-cli';

const result = spawnSync(
    requireGodotBinary(),
    ['--headless', '--editor', '--path', GODOT_DIRECTORY, '--quit'],
    { encoding: 'utf8' }
);

if (result.error) {
    console.error(
        `[Error] Failed to import Godot project: ${result.error.message}`
    );
    process.exit(1);
}

const output = `${result.stdout}${result.stderr}`;
if (
    result.status !== 0 ||
    output.includes('SCRIPT ERROR') ||
    output.includes('Parse Error') ||
    output.includes('Failed to load script')
) {
    process.stderr.write(output);
    process.exit(1);
}

process.exit(0);
