const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name: "dwjlelerj",
   api_key: "457444265166298",
   api_secret: "vxeykCOhjqKvDoPCoDOc_NDOqjo",
   secure: true,
   cdn_subdomain: true,
});
const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};


module.exports = {
    uploadImg
};
