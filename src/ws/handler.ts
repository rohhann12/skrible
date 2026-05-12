import { room_Manager } from "../server.js";
import { JOIN_ROOM } from "../types/types.js";

export function handleMessage(raw:any){
    const parse=JSON.parse(raw);
    if(parse.message.type===JOIN_ROOM){
        const userId=parse.message.userId
        const roomId=parse.message.roomId
        room_Manager.getInstace().addInRoom(userId,roomId)
    }
}