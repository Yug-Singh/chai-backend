
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

//Setting middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Limiting how much json data can we take : Data by filling the form
app.use(express.json({ limit: "16kb" }))

// Encoding URL :  
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//Files as a public assets : store in our own server!
app.use(express.static("public"))

app.use(cookieParser());


export { app }