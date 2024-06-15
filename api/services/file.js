import firebase from "../firebase.js";
const uploadSingle = async (file, path) => {
  const blob = firebase.bucket.file(path + "/" + file.originalname);
  try {
    await blob.save(file.buffer, { contentType: file.mimetype });
    await blob.makePublic();
    return blob.publicUrl();
  } catch (e) {
    throw e;
  }
};
const uploadMultiple = async (files, path) => {
  return Promise.all(files.map((file) => uploadSingle(file, path)));
};
const deleteFile = (url) => {
  url = decodeURIComponent(url)
  const pos = url.lastIndexOf(process.env.APP_NAME) + process.env.APP_NAME.length +1
  const file = firebase.bucket.file(url.substring(pos));
  return file.delete();
};
export default { uploadSingle, uploadMultiple, deleteFile };
