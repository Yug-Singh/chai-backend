// require('dotenv').config({ path: './env' })

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: '/.env'
})


connectDB()
    .then(() => {

        app.on("error", (error) => {
            console.log("Error : ", error);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.eventNames.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO DB CONNECTION FAILED !!!", err);
    })












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

