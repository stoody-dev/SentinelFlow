
import { z } from "zod";

export const IntelligenceEventSchema = z.object({
  id: z.string(),

  source: z.string(),

  url: z.string(),

  title: z.string(),

  content: z.string(),

  timestamp: z.string(),

  category: z.string(),

  tags: z.array(z.string()),

  sentiment: z.enum([
    "bullish",
    "bearish",
    "neutral"
  ]),

  importance: z.number(),

  anomalyScore: z.number(),

  latency_ms: z.number()
});

export type IntelligenceEvent =
  z.infer<typeof IntelligenceEventSchema>;

