// require('dotenv').config({ path: './env' })

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: '/.env'
})


connectDB()












//Approch 1:
/*

import express from 'express'

    ; (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("Error : ", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })
        } catch (err) {
            console.error("ERROR: ", err);
            throw err
        }
    })()

*/

