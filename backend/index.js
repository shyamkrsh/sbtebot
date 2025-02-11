import express from 'express'
import { Server } from 'socket.io'
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 8080;
import http from 'http'
import dotenv from 'dotenv'
dotenv.config();

const server = http.createServer(app);

app.use(cors({
    origin: ["http://localhost:5173", "https://sbtebot.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://sbtebot.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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
            systemInstruction: "You are an AI assistant for SBTE to help users to know about SBTE give answer as short as possible if users asks questions outside SBTE then please don't respond, And if asks about the problems which is user facing like 'why my result is showing pending? or I am unable to download my result ?' Then please say Thanks for notify us we are working on it to resolve you Issue.  if users asks questions about semester exams process fee then please fetch data and help users and if you don't know then please refer to the SBTE website.If user aks exam fee then say for girls ₹ 1000/- and for boys ₹ 1500/- if users asks outside this topic then please say I can't help with this, please ask questions related to sbte"
        });
        socket.emit("answers", result.response.text());
    })

})


server.listen(PORT, () => {
    console.log(`Server is listening to the port : ${PORT}`);
})