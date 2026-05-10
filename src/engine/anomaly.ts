
import {
  IntelligenceEvent
} from "../types/event";

const categoryStats:
Record<string, number[]> = {};

export function calculateAnomalyScore(
  event: IntelligenceEvent
): number {

  const category =
    event.category;

  if (!categoryStats[category]) {

    categoryStats[category] = [];
  }

  const history =
    categoryStats[category];

  const currentValue =
    event.importance;

  history.push(currentValue);

  if (history.length > 20) {

    history.shift();
  }

  const mean =
    average(history);

  const std =
    standardDeviation(history);

  let statisticalScore = 0;

  if (std !== 0) {

    statisticalScore =
      Math.abs(
        (currentValue - mean)
        / std
      );
  }

  // combine semantic weight
  const finalScore =
    statisticalScore
    + currentValue * 0.5;

  return Number(
    finalScore.toFixed(2)
  );
}

function average(
  arr: number[]
) {

  return (
    arr.reduce(
      (a, b) => a + b,
      0
    ) / arr.length
  );
}

function standardDeviation(
  arr: number[]
) {

  const avg =
    average(arr);

  const squareDiffs =
    arr.map(value => {

      const diff =
        value - avg;

      return diff * diff;
    });

  const avgSquareDiff =
    average(squareDiffs);

  return Math.sqrt(
    avgSquareDiff
  );
}

