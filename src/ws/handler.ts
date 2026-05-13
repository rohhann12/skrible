import type WebSocket from "ws";
import { room_Manager } from "../server.js";
import { CREATE_ROOM, JOIN_ROOM } from "../types/types.js";
import { verifyToken } from "../services/authService.js";
export interface CustomWebSocket extends WebSocket {
  userId?: string;
}
export function handleMessage(userSocket:CustomWebSocket,raw:any,req:any){
     const url=new URL(req.url!,"http://localhost")
    const token=url.searchParams.get("token")
    if(!token){
      throw new Error("token not passed down through socket")
    }
    const user=verifyToken(token!)
    if(!user){
      userSocket.close()
      return;
    }
    userSocket.userId=user.id
    // console.log("userSocket",userSocket)
    const parse=JSON.parse(raw);
    if(parse.type===CREATE_ROOM){
        const userId=userSocket.userId!
        console.log("userId",userId)
        room_Manager.createRoom(userId,userId,userSocket)
    }else if(parse.type===JOIN_ROOM){
       const userId=userSocket.userId!
       const roomId=parse.roomId
       const joined=room_Manager.addUser(userSocket,userId,roomId)
       if(joined){
         userSocket.send(JSON.stringify({ type:"JOIN_SUCCESS", roomId }))
       }else{
         userSocket.send(JSON.stringify({ type:"ROOM_NOT_FOUND", roomId }))
       }
    }
}