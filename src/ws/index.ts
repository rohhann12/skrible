import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./handler.js";
import { room_Manager } from "../server.js";
import { verifyToken } from "../services/authService.js";
export interface CustomWebSocket extends WebSocket {
  userId?: string;
}
export function initializeWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: CustomWebSocket,req:any) => {
    console.log("Client connected");
    // const url=new URL(req.url!,"http://localhost")
    // const token=url.searchParams.get("token")
    // if(!token){
    //   throw new Error("token not passed down through socket")
    // }
    // const user=verifyToken(token!)
    // if(!user){
    //   socket.close()
    //   return;
    // }
    // socket.userId=user.id
    socket.on("message", (message) => {
      handleMessage(wss, socket, message.toString());
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
}