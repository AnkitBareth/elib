import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs";
import bookModel from "./bookModel";

const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Upload cover image
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      `../../public/data/uploads`,
      filename
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // Upload book file
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      `../../public/data/uploads`,
      bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf's",
        format: "pdf",
      }
    );
    // @ts-ignore
    console.log("userID", req.userId);
    // Create book with all required fields
    const newBook = await bookModel.create({
      title,
      genre,
      author: "67cfede59fda2e605be4427a",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Clean up temporary files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    next(error);
  }
};

export { createBook };
