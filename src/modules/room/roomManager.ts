
interface User{
    userId:string
    roomId:string
}

export class roomManager{
    private static instance:roomManager
    private userMap:any

    private constructor(){
        // this.instance=new roomManager()
        this.userMap=new Map<string,User[]>()
    }

    static getInstance() {
    if (!roomManager.instance) {
      roomManager.instance = new roomManager();
    }

    return roomManager.instance;
  }

    public addUser(userId:string,roomId:string){
        const roomState=this.getRoomState(roomId)
        const findUser=roomState?.find((u:any)=>u.userId===userId)
        if(findUser===undefined){
            this.addInRoom(roomId,userId)
        }
    }
    public removeUser(userId:string,roomId:string){
        this.removeFromRoom(userId,roomId)
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
    private removeFromRoom(userId:string,roomId:string){
        const roomState=this.getRoomState(roomId)
        roomState?.filter((u:any)=>u.userId!==userId)
        return roomState
    }

       
}