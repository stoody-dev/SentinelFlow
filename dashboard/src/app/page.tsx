"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const socket = io("http://localhost:3000");

type EventType = {
  id: string;
  source: string;
  url: string;
  title?: string;
  content?: string;
  timestamp: string;
  category: string;
  tags: string[];
  sentiment: string;
  importance: number;
  anomalyScore: number;
  latency_ms: number;
};

export default function Home() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("CONNECTED TO BACKEND");
    });

    socket.on("new_event", (event: EventType) => {
      console.log("NEW EVENT:", event);

      setEvents((prev) => [event, ...prev]);
    });

    return () => {
      socket.off("new_event");
    };
  }, []);

  const stats = useMemo(() => {
    const critical = events.filter((e) => e.anomalyScore >= 10).length;

    const avg =
      events.length > 0
        ? (
            events.reduce((acc, e) => acc + e.anomalyScore, 0) /
            events.length
          ).toFixed(2)
        : "0";

    const categories = new Set(events.map((e) => e.category)).size;

    return {
      total: events.length,
      critical,
      avg,
      categories,
    };
  }, [events]);

  const chartData = events
    .slice()
    .reverse()
    .map((e, i) => ({
      index: i,
      anomaly: e.anomalyScore,
    }));

  return (
    <main className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}

      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-7xl font-bold tracking-tight">
            SentinelFlow
          </h1>

          <p className="text-zinc-400 mt-2 text-xl">
            Realtime anomaly intelligence feed
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        <StatCard
          title="Events"
          value={stats.total}
        />

        <StatCard
          title="Critical"
          value={stats.critical}
        />

        <StatCard
          title="Avg Anomaly"
          value={stats.avg}
        />

        <StatCard
          title="Categories"
          value={stats.categories}
        />
      </div>

      {/* LIVE ALERT BAR */}

      <div className="mb-6 border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden">

        <div className="whitespace-nowrap animate-marquee py-3">

          {events.slice(0, 5).map((event) => (
            <span
              key={event.id}
              className="mx-12 text-zinc-300"
            >
              ⚠ {event.category} anomaly detected on{" "}
              {event.source} — score: {event.anomalyScore}
            </span>
          ))}
        </div>
      </div>

      {/* CRITICAL */}

      {stats.critical > 0 && (
        <div className="mb-6 bg-red-950 border border-red-700 text-red-300 rounded-2xl p-4 text-xl">
          ⚠ CRITICAL ANOMALY DETECTED
        </div>
      )}

      {/* CHART */}

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Live Anomaly Trend
        </h2>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={chartData}>

              <XAxis dataKey="index" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="anomaly"
                stroke="#ff4d4f"
                strokeWidth={3}
                dot
              />

            </LineChart>

          </ResponsiveContainer>
        </div>
      </div>

      {/* EVENTS */}

      <div className="space-y-6">

        {events.map((event) => {

          const critical = event.anomalyScore >= 10;

          return (
            <div
              key={event.id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-4xl font-bold mb-3">
                    {event.source}
                  </h2>

                  <div className="flex gap-2 flex-wrap mb-5">

                    {event.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-950 text-blue-300 text-sm px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`text-3xl font-bold ${
                    critical
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  anomaly: {event.anomalyScore}
                </div>
              </div>

              <p className="text-zinc-200 text-2xl leading-relaxed mb-6">
                {event.content || "No content"}
              </p>

              <div className="flex items-center justify-between text-zinc-500 text-sm">

                <div>
                  latency: {event.latency_ms}ms
                </div>

                <div>
                  live now
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <div className="text-zinc-400 text-lg mb-3">
        {title}
      </div>

      <div className="text-5xl font-bold">
        {value}
      </div>
    </div>
  );
}