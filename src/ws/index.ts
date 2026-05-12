import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./handler.js";

export function initializeWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    console.log("Client connected");

    socket.on("message", (message) => {
      handleMessage(wss, socket, message.toString());
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
}