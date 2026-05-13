import { prisma } from "../../config/prisma.js"
import type WebSocket from "ws"

interface User{
    userId:string
    // roomId:string
}

export class roomManager{
    private static instance:roomManager
    private  userMap:any
    private  reverserUserMap:any
    private room:any
    private constructor(){
        // this.instance=new roomManager()
    this.userMap=new Map<string,User[]>()
    this.reverserUserMap=new Map<string,string>()
}

    static getInstance() {
    if (!roomManager.instance) {
      roomManager.instance = new roomManager();
    }

    return roomManager.instance;
  }
    public async createRoom(userId:string,socketId:string,ws:WebSocket){
        if(this.reverserUserMap.get(socketId)!==undefined){
            console.log("user already had a room")
            return
        }
        const roomId=(Math.random()*10000).toString().substring(0,4)
        // roomId banegi woh return krenge\
        const addInDb=await prisma.room.create({
            data: {
                roomId,
                userConnected: [userId],
            },
        })
        if(!addInDb){
            console.log("db write faield")

        }
        console.log("before room init",this.userMap)
        this.userMap.set(roomId,[{userId:userId}])
        this.reverserUserMap.set(socketId,roomId)
        console.log("after room init",this.userMap)
        console.log("sending ROOM_CREATED",roomId)
        ws.send(JSON.stringify({ type: "ROOM_CREATED", roomId }))
    }

    public addUser(ws:WebSocket,userId:string,roomId:string):boolean{
        if(!userId || !roomId){
           console.log("roomId or userId not defined")
           return false;
        }
        const roomState=this.getRoomState(roomId)
        if(roomState===undefined){
            console.log("room doesnt exists")
            // ws.send(JSON.stringify({type:"ROOM_NOT_FOUND"}))
            return false;
        }
        const findUser=roomState?.find((u:string)=>u===userId)
        if(findUser===undefined){
            this.addInRoom(roomId,userId)
        }
        console.log("adding users",this.userMap)
        return true;
    }
    public removeUser(userId:string,roomId:string,socketId:string){
        this.removeFromRoom(userId,roomId,socketId)
        return this.userMap
    }
    private getRoomState(roomId:string){
        const getRoomState=this.userMap.get(roomId)
        return getRoomState
    }
    private addInRoom(roomId:string,userId:string){
        const getState=this.getRoomState(roomId) ?? []
        this.userMap.set(roomId,[...getState,{userId:userId}])
    }
    private removeFromRoom(userId:string,roomId:string,socketId:string){
        const roomState=this.getRoomState(roomId)
        roomState?.filter((u:any)=>u.userId!==userId)
        const reverseMaping=this.reverserUserMap(socketId)
        reverseMaping.set("")
        console.log("removed user",this.reverserUserMap)
    }

       
}