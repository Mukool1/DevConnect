import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        messasge: "No file Uploaded",
      });
    }
    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "devconnect" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        stream.end(req.file.buffer);
      });

    const result = await uploadFromBuffer();

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
