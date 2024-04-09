
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

//Files as a public assets : temporary store in our own server!
app.use(express.static("public"))

app.use(cookieParser());



//--------Write your middleware above this---------------------

//routes import
import userRouter from "./routes/user.routes.js"




//routes declaration
app.use('/api/v1/users', userRouter)


// Testing
// app.get('/', (req, res) => {
//     console.log("I'm Here!!")
// })




// http://localhost:8000/api/v1/users/register : Here's the link for example

export { app }