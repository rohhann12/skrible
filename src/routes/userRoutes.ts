import expres, { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const userRoutes=Router()


userRoutes.post('/joinRoom',authenticate,(req,res)=>{
//     // have the logic to find
//     // the find the userId from 
//     // db
//     // then relay the room
//     // join the 
//     const {token}=req.body
//     const user=
})

export default userRoutes