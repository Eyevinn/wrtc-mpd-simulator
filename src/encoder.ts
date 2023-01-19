import chalk from 'chalk';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from "path";

function logScript(tag: string, script: ChildProcessWithoutNullStreams, color: chalk.Chalk) {
  script.stderr.on('data', (msg) => {
    console.error(color(`[${tag}] ${msg}`));
  });
  script.stdout.on('data', (msg) => {
    console.log(color(`[${tag}] ${msg}`));
  });
}

export function start(input: string) {
  const ffmpeg = spawn('bash', [path.join(__dirname, '../scripts/ffmpeg.sh'), input], {
    cwd: path.join(__dirname, '../scripts')
  });
  logScript("ffmpeg", ffmpeg, chalk.blue);

  const whipMpegts = spawn(
    'bash',
    [path.join(__dirname, '../scripts/whip-mpegts.sh')],
    { cwd: path.join(__dirname, '../scripts') }
  );

  logScript("whip-mpegts", whipMpegts, chalk.yellow);
}
