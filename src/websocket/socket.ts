import { WebSocketServer }
from "ws";

let wss: WebSocketServer;

export function initWebSocket(
  server: any
) {

  wss = new WebSocketServer({
    server
  });

  wss.on("connection", (ws) => {

    console.log(
      "Client connected"
    );

    ws.send(
      JSON.stringify({
        type: "connected",
        message:
          "SentinelFlow realtime stream active"
      })
    );
  });
}

export function broadcastEvent(
  data: any
) {

  if (!wss) return;

  wss.clients.forEach((client) => {

    if (client.readyState === 1) {

      client.send(
        JSON.stringify(data)
      );
    }
  });
}

