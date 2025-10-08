import {v2 as cloudinary} from 'cloudinary'
import path from 'path'
import { fileURLToPath } from 'url';
import { config } from 'dotenv';


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
config({path:path.resolve(__dirname,'../../.env')});

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

export default cloudinary;
