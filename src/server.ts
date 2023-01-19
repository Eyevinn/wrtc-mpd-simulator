import fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { addWHEPAdaptionSet } from './dash';

const tmpFolder = path.join(__dirname, '../tmp/');

fsSync.rmdirSync(tmpFolder, { recursive: true });
fsSync.mkdirSync(tmpFolder, { recursive: true });

const startScript = spawn(
  'bash',
  [path.join(__dirname, '../scripts/start.sh')],
  { cwd: path.join(__dirname, '../scripts') }
);
startScript.stderr.on('data', (msg) => {
  console.error(`${msg}`);
});
startScript.stdout.on('data', (msg) => {
  console.log(`${msg}`);
});

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
  const stream = fsSync.createReadStream(path.join(tmpFolder, request.url));
  return reply.header('content-type', 'application/octet-stream').send(stream);
});

server.listen(
  { port: process.env.PORT ? Number(process.env.PORT) : 3000 },
  (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`WebRTC/DASH Manifest available at ${address}/live.mpd`);
  }
);
