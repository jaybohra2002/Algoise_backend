const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser=require('body-parser');
const Redis=require('ioredis');

const app = express();
app.use(bodyParser.json());
const redisCache=new Redis();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin:"http://localhost:5500",
        methods:['GET','POST']
    }
 });

io.on("connection", (socket) => {
    console.log("A user connected ",socket.id);
    socket.on("setUserId",(userId)=>{
        redisCache.set(userId,socket.id);
        console.log("redis cache made");
    });
    socket.on("getUserId",async (userId)=>{
        const Id= await redisCache.get(userId);
        console.log(Id);
        socket.emit('connectionId',Id);
    })
});
app.post('/sendPayload',async (req,res)=>{
    console.log(req.body);
    const {userId,payload}=req.body;
    if(!userId || !payload){
        res.status(400).send("Invalid Request");
    }
    const socketId=await redisCache.get(userId);
    if(socketId){
        io.to(socketId).emit('submissionPayloadResponse',payload);
        res.send("Payload sent successfully");
    }
    else{
        res.status(404).send("User not connected");
    }
});

httpServer.listen(3000,()=>{
    console.log("Server is up on Port 3000");
});