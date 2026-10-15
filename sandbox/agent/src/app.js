import express from "express"
import morgan from "morgan"
import cors from "cors"
import fs from "fs"

const WORKING_DIR = "/workspace"
const app = express()

// middleware
app.use(morgan("dev"))
app.use(cors())

app.get("/", (req, res)=> {
    res.status(200).json({
        message: "Hello from sandbox agent",
        status : "success"
    })
})

app.get("/list-files",  async(req, res) => {
    const elements = await fs.promises.readdir(WORKING_DIR)

    res.status(200).json({
        message: "Files in working directory",
        elements
    })
})

export default app