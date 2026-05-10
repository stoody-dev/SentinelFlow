import { FastifyInstance } from "fastify";

export default async function ingestRoutes(fastify: FastifyInstance) {

  fastify.post("/ingest", async (request: any, reply) => {

    try {

      const body = request.body as {
        url: string;
      };

      const url = body.url;

      console.log("Using API KEY:", process.env.ANAKIN_API_KEY ? "FOUND" : "MISSING");

      // SUBMIT SCRAPE JOB
      const submitResponse = await fetch(
        "https://api.anakin.io/v1/url-scraper",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.ANAKIN_API_KEY || "",
          },
          body: JSON.stringify({
            url,
          }),
        }
      );

      const submitData: any = await submitResponse.json();

      console.log("ANAKIN SUBMIT:", submitData);

      const jobId = submitData.jobId;

      if (!jobId) {
        throw new Error("No jobId returned");
      }

      // POLLING
      let completedJob: any = null;

      for (let i = 0; i < 20; i++) {

        console.log(`Polling attempt ${i + 1}`);

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );

        const pollResponse = await fetch(
          `https://api.anakin.io/v1/url-scraper/${jobId}`,
          {
            method: "GET",
            headers: {
              "X-API-Key": process.env.ANAKIN_API_KEY || "",
            },
          }
        );

        const pollData: any = await pollResponse.json();

        console.log("JOB STATUS:", pollData.status);

        if (pollData.status === "completed") {
          completedJob = pollData;
          break;
        }

        if (pollData.status === "failed") {
          throw new Error("Scrape failed");
        }
      }

      if (!completedJob) {
        throw new Error("Timed out waiting for scrape");
      }

      console.log("SCRAPE COMPLETED");

      // NORMALIZE EVENT
      const event = {
        id: crypto.randomUUID(),

        source: new URL(url).hostname,

        url,

        title: completedJob.title || "No title",

        content:
          completedJob.markdown?.slice(0, 500) ||
          "No content",

        timestamp: new Date().toISOString(),

        category: "cybersecurity",

        tags: ["ransomware"],

        sentiment: "neutral",

        importance: 11,

        anomalyScore: 5.5,

        latency_ms:
          completedJob.duration || 200,
      };

      // SOCKET EMIT
      const io = request.server.io;

      io.emit("new_event", event);

      // RESPONSE
      return reply.send({
        success: true,
        event,
      });

    } catch (err) {

      console.error("ANAKIN ERROR:");

      console.error(err);

      return reply.status(500).send({
        success: false,
        error: "Failed to ingest URL",
      });
    }
  });
}