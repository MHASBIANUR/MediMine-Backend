// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Token tidak valid" });
    }

    // simpan user ke request agar bisa diakses di controller
    (req as any).user = data.user;

    next();
  } catch (err) {
    return res.status(500).json({ error: "Autentikasi gagal" });
  }
};
