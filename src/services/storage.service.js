const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file){
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "image_"+Date.now(),
        folder: "student-council-backend/images"
    })
    return result;
}

module.exports = {
    uploadFile
}