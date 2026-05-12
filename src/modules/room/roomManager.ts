
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

    public getRoomState(roomId:string){
        const getRoomState=this.userMap.get(roomId)
        return getRoomState
    }
    public addInRoom(roomId:string,userId:string){
        let updateRoomstate
        const getState=this.getRoomState(roomId) ?? []
        if(getState){
            const user:User={userId,roomId}
            updateRoomstate=this.userMap.set(roomId,[...getState,user])
        }
        return updateRoomstate
    }
       
}