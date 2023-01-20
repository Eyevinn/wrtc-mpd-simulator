import fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { addWHEPAdaptionSet } from './dash';
import chalk from 'chalk';
import * as encoder from "./encoder";

function log(...args: any) {
  console.log(chalk.green(`[Server]`, ...args));
}

const tmpFolder = path.join(__dirname, '../tmp/');

fsSync.rmdirSync(tmpFolder, { recursive: true });
fsSync.mkdirSync(tmpFolder, { recursive: true });

const input = process.argv[2];
if (!input) {
  console.error(chalk.red("No input provided"));
  process.exit(1);
}
encoder.start(input[0] === "/" ? input : path.join(__dirname, input));

const server = fastify();
server.register(cors);

server.get('/live.mpd', async (request, reply) => {
  const manifest = await (
    await fs.open(path.join(tmpFolder, 'live.mpd'), 'r')
  ).readFile({ encoding: 'utf-8' });

  const updatedManifest = addWHEPAdaptionSet(manifest);
  return reply.send(updatedManifest);
});

server.get('/*', async (request, reply) => {
  if (request.url.includes("..")) {
    return reply.status(400).send();
  }
  if (request.url === "/") {
    return reply.send("OK");
  }
  const stream = fsSync.createReadStream(path.join(tmpFolder, request.url));
  return reply.header('content-type', 'application/octet-stream').send(stream);
});

server.listen(
  { port: process.env.PORT ? Number(process.env.PORT) : 5000 },
  (err, address) => {
    if (err) {
      throw err;
    }
    log(`WebRTC/DASH Manifest available at ${address}/live.mpd`);
  }
);
