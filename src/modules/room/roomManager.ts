
interface User{
    userId:string
    roomId:string
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
    public createRoom(userId:string,socketId:string){
        if(this.reverserUserMap.get(socketId)!==undefined){
            console.log("user already had a room")
            return
        }
        const roomId=(Math.random()*10000).toString().substring(0,4)
        // roomId banegi woh return krenge
        console.log("before room init",this.userMap)
        // piche state maintain krenge sarein users ki uske 
        this.userMap.set(roomId,[userId])
        this.reverserUserMap.set(socketId,roomId)
        console.log("after room init",this.userMap)
    }

    public addUser(userId:string,roomId:string){
        if(!userId || !roomId){
           console.log("roomId or userId not defined")
           return;
        }
        console.log("old State",this.userMap)
        const roomState=this.getRoomState(roomId)
        const findUser=roomState?.find((u:any)=>u.userId===userId)
        if(findUser===undefined){
            this.addInRoom(roomId,userId)
            console.log("new State",this.userMap)
        }
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
        let updateRoomstate
        const getState=this.getRoomState(roomId) ?? []
        if(getState){
            const user:User={userId,roomId}
            updateRoomstate=this.userMap.set(roomId,[...getState,user])
        }
        return updateRoomstate
    }
    private removeFromRoom(userId:string,roomId:string,socketId:string){
        const roomState=this.getRoomState(roomId)
        roomState?.filter((u:any)=>u.userId!==userId)
        const reverseMaping=this.reverserUserMap(socketId)
        reverseMaping.set("")
        console.log("removed user",this.reverserUserMap)
    }

       
}