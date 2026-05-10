
import Fastify from "fastify";

import { ingestRoutes }
from "./routes/ingest";

const server = Fastify({
  logger: true
});

server.get("/health", async () => {
  return {
    status: "ok",
    service: "SentinelFlow"
  };
});

server.register(ingestRoutes);

export default server;

