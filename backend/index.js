import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
const app = express();
const port = 8080;
import http from 'http'
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: ['http://localhost:8080'],
        methods: ['GET', 'POST'],
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("User - ", socket.id);
})




server.listen(port, () => {
    console.log(`Application is listening to the port : ${port}`);
})