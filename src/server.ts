import express from 'express'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/userRoutes.js'
import http from "http";
import { initializeWebSocket } from './ws/index.js';
import { roomManager } from './modules/room/roomManager.js';
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 3001
const server=http.createServer(app)

initializeWebSocket(server)

export const room_Manager=roomManager.getInstance();
app.use(cors({
  origin: '*'
}));
app.use(express.json())
app.use('/auth', authRoutes)
app.use("/user",userRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
