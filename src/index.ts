import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import ingestRoutes from "./routes/ingest";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

async function start() {

  await fastify.register(cors, {
    origin: "*",
  });

  // SOCKET.IO
  const { Server } = await import("socket.io");

  const io = new Server(fastify.server, {
    cors: {
      origin: "*",
    },
  });

  // DECORATE BEFORE START
  fastify.decorate("io", io);

  io.on("connection", () => {
    console.log("Client connected");
  });

  // ROUTES
  await fastify.register(ingestRoutes);

  // START SERVER
  await fastify.listen({
    port: 3000,
    host: "0.0.0.0",
  });

  console.log("SentinelFlow running on 3000");
}

start();