import fastify from "fastify";
import cors from "@fastify/cors";
import fs from "fs/promises";
import path from "path";

const tmpFolder = path.join(__dirname, "../tmp/");

await fs.mkdir(tmpFolder, { recursive: true });

const server = fastify();
server.register(cors);

server.get("/manifest.mpd", async (request, response) => {
  const manifest = await fs.open(path.join(tmpFolder, "manifest.mpd"), "r");
  response.send(manifest);
});

server.get("/*", async (request, response) => {
  response.send(await fs.open(path.join(tmpFolder, request.url)));
  response.code(404).send();
});

server.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3000 }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`WebRTC/DASH Manifest available at ${address}/manifest.mpd`);
})

process.on('exit', async (code) => {
  await fs.rmdir(tmpFolder, { recursive: true });
});