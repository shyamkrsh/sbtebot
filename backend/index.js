import express from 'express';
import { Server } from 'socket.io';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8080;
const server = http.createServer(app);

app.use(cors({
    origin: "https://sbtebot.vercel.app",
    methods: ["GET", "POST"]
}));

const io = new Server(server, {
    cors: {
        origin: "https://sbtebot.vercel.app",
        methods: ["GET", "POST"]
    }
});

app.get("/demo", (req, res) => {
    res.send("Working ...");
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are an AI assistant for SBTE. Keep answers short and specific to SBTE."
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("question", async (q) => {
        try {
            const result = await model.generateContent(q);
            const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
            socket.emit("answers", responseText);
        } catch (error) {
            console.error("Error generating response:", error);
            socket.emit("answers", "An error occurred while processing your question.");
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Application is listening on port: ${port}`);
});
