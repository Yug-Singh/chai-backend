import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//Uploading the file

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        console.log(response);
        console.log("File is uploaded on clodinary : ", response.url);
        // console.log(localFilePath)

        //Unlinking the file from our local server
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        //remove the locally saved temporary file as upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary }