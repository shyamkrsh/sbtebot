import express from 'express'
import { Server } from 'socket.io'
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors'
const app = express();
const port = 8080;
import http from 'http'
import dotenv from 'dotenv'
dotenv.config();

const server = http.createServer(app);

app.use(cors({
    cors: {
        origin: "https://sbtebot.vercel.app", // ✅ Allow frontend URL
        methods: ["GET", "POST"]
    }
}));

const io = new Server(server, {
    cors: {
        origin: "https://sbtebot.vercel.app", // ✅ Allow frontend URL
        methods: ["GET", "POST"]
    }
});

app.get("/demo", (req, res) => {
    res.send("Working ...");
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

io.on("connection", async (socket) => {
    socket.on("question", async (q) => {
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: q }]
                }
            ],
            systemInstruction: "You are an AI assistant for SBTE to help users to know about SBTE give answer as short as possible if users asks questions outside SBTE then please don't respond"
        });
        socket.emit("answers", result.response.text());
    })

})


server.listen(port, () => {
    console.log(`Application is listening to the port : ${port}`);
})