import { v4 as uuidv4 }
from "uuid";

import {
  IntelligenceEvent
} from "../types/event";

import {
  calculateAnomalyScore
} from "./anomaly";

import {
  analyzeSignals
} from "./signals";

export function normalizeEvent(
  url: string,
  rawContent: string
): IntelligenceEvent {

  // analyze semantic signals
  const signalAnalysis =
    analyzeSignals(
      rawContent
    );

  const baseEvent:
    IntelligenceEvent = {

    id: uuidv4(),

    source:
      extractDomain(url),

    url,

    title:
      rawContent
        .split(".")[0]
        .slice(0, 80),

    content:
      rawContent.slice(0, 500),

    timestamp:
      new Date()
        .toISOString(),

    category:
      signalAnalysis.category,

    tags:
      signalAnalysis.tags,

    sentiment: "neutral",

    importance:
      signalAnalysis.importance,

    anomalyScore: 0,

    latency_ms:
      Math.floor(
        Math.random() * 1000
      )
  };

  // calculate anomaly score
  const anomalyScore =
    calculateAnomalyScore(
      baseEvent
    );

  return {
    ...baseEvent,
    anomalyScore
  };
}

function extractDomain(
  url: string
) {

  try {

    return new URL(url)
      .hostname;

  } catch {

    return "unknown";
  }
}
