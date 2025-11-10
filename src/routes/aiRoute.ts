import { Router } from "express";
import {analyzeSymptom, getUserUploads, deleteUserUpload} from "../controllers/aiController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = Router();

// === Analisis AI & simpan hasil ===
router.post("/analyze", authMiddleware, upload.single("image"), analyzeSymptom);

// === Ambil semua uploads milik user (untuk Medical History) ===
router.get("/", authMiddleware, getUserUploads);

// === Hapus salah satu upload milik user ===
router.delete("/:id", authMiddleware, deleteUserUpload);

export default router;
