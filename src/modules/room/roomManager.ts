
interface User{
    userId:string
    roomId:string
}

export class roomManager{
    private instance:roomManager
    private userMap=new Map<string,User[]>()

    constructor(){
        this.instance=new roomManager()
    }

    public getInstace(){
        if(!this.instance){
            return new roomManager()
        }
        return this.instance
    }

    public addUser(userId:string,roomId:string){
        const roomState=this.getRoomState(roomId)
        const findUser=roomState?.find(u=>u.userId===userId)
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
        roomState?.filter(u=>u.userId!==userId)
        return roomState
    }

       
}