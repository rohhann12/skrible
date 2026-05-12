import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./handler.js";

export function initializeWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: any,req:any) => {
    console.log("Client connected")
    socket.on("message", (message:any) => {
      handleMessage(wss, socket, message.toString(),req);
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
}