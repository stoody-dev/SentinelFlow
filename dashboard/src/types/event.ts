export interface IntelligenceEvent {

  id: string;

  source: string;

  url: string;

  title: string;

  content: string;

  timestamp: string;

  category: string;

  tags: string[];

  sentiment:
    | "bullish"
    | "bearish"
    | "neutral";

  importance: number;

  anomalyScore: number;

  latency_ms: number;
}
