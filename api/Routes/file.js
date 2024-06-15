import express from "express";
import uploadController from "../controllers/file.js";
import multer from "multer";
const uploadRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
uploadRouter.post(
  "/single",
  upload.single("file"),
  uploadController.uploadSingle
);
uploadRouter.post(
  "/multiple",
  upload.any("file"),
  uploadController.uploadMultiple
);
uploadRouter.delete("/", uploadController.deleteFile)

export default uploadRouter;
