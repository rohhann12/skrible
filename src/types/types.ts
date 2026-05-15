export const WAITING="WAITING"
export const STARTING="STARTING"
export const CHOOSING_WORD="CHOOSING_WORD"
export const DRAWING="DRAWING"
export const ROUND_END="ROUND_END"
export const GAME_END="GAME_END"
export const JOIN_ROOM="JOIN_ROOM"
export const CREATE_ROOM="CREATE_ROOM"
export const REJOIN_ROOM="REJOIN_ROOM"
export const STROKE="STROKE"


export interface userRoom{
    id:string
    players:string[]
    currentRound:string
    currentDrawer:string,
    currentWord:string,
    state:any,
    maxPlayers:number,
    timer:string,
    settings:string[]
}