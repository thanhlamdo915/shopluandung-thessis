import uploadService from "../services/file.js";
const uploadSingle = async (req, res) => {
  const path = req.body.path;
  const file = req.file;
  try {
    const url = await uploadService.uploadSingle(file, path);
    return res.status(200).json({ url });
  } catch (e) {
    console.log(e.errors)
    return res.status(400).json({message: "Bad Request"});
  }
};
const uploadMultiple = async (req, res) => {
  const path = req.body.path;
  const files = req.files;
  try {
    const urls = await uploadService.uploadMultiple(files, path);
    return res.status(200).json({ urls });
  } catch (e) {
    console.log(e.errors)
    return res.status(400).json({message: "Bad Request"});
  }
};
const deleteFile = async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({message: "Bad Request"});
  try {
    await uploadService.deleteFile(url);
    return res.status(200).json({message: "Success"});
  } catch (e) {
    console.log(e.errors)
    return res.status(400).json({message: "Bad Request"});
  }
};

export default { uploadSingle, uploadMultiple, deleteFile };
