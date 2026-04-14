import express from "express"
import runGraph from "../src/services/graph.ai.service.js"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", async (req, res) => {

    const result = await runGraph("Write an code for Factorial function in js")
    res.json(result)
})

app.post("/battle", async (req, res) => {
    const { input } = req.body
    const result = await runGraph(input)

    res.status(201).json({
        message: "Battle completed successfully",
        success: true,
        result
    })
})

export default app