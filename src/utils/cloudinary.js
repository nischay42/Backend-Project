import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operatoin got failed
        return null
    }
}

const deleteFromCloudinary = async (url) => {

    // get file id
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0]

    try {
        if (!publicId) {
            console.error("Error: Could not extract public ID from URL.");
            return false; 
        }
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        })
        if (result.result === 'ok') {
            return true; 
        } else {
            console.error("Cloudinary deletion failed:", result);
            return false; 
        }
    } catch (error) {
        console.error("Error during Cloudinary deletion:", error);
        return false;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}