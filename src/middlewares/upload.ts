import multer from "multer";
import path from "path";
import fs from "fs";

// Buat folder tmp untuk file sementara
const uploadDir = path.join(__dirname, "../../tmp");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({ storage });
