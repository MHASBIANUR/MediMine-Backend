// src/controllers/aiController.ts
import { Request, Response } from "express";
import { openai } from "../lib/openai";
import { supabase } from "../utils/supabase";
import path from "path";
import fs from "fs";

// === ANALISIS AI & SIMPAN UPLOAD ===
export const analyzeSymptom = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const user = (req as any).user;
    const file = req.file;

    if (!prompt && !file) {
      return res.status(400).json({ error: "Tolong kirimkan prompt atau gambar." });
    }

    let publicUrl: string | null = null;

    // === Upload ke Supabase Storage (jika ada file) ===
    if (file) {
      try {
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const fileBuffer = fs.readFileSync(file.path);

        const { data, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.mimetype,
          });

        fs.unlinkSync(file.path);

        if (uploadError) {
          console.error("❌ Supabase Upload Error:", uploadError.message);
          return res.status(500).json({
            error: "Gagal upload gambar ke Supabase",
            detail: uploadError.message,
          });
        }

        const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(filePath);
        publicUrl = publicData.publicUrl;
        console.log("✅ Gambar diupload:", publicUrl);
      } catch (err: any) {
        console.error("❌ Supabase Exception:", err.message);
        return res.status(500).json({
          error: "Terjadi error saat upload ke Supabase",
          detail: err.message,
        });
      }
    }

    // === Analisis AI ===
    let aiResult = "AI gagal memproses.";
    try {
      const messages: any[] = [
        {
          role: "system",
          content:
            "Kamu adalah asisten medis AI yang menjelaskan hasil analisis dalam bahasa Indonesia yang sopan, ringkas, dan mudah dipahami.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Analisis keluhan pasien: ${prompt || "-"}` },
            ...(publicUrl ? [{ type: "image_url", image_url: { url: publicUrl } }] : []),
          ],
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      aiResult = completion.choices[0].message.content || aiResult;
    } catch (err: any) {
      console.error("❌ OpenAI Error:", err.message);
    }

    // === Simpan ke Supabase Database ===
    console.log("🧩 Akan menyimpan hasil ke uploads:", {
      user_id: user?.id || null,
      image_url: publicUrl ?? "",
      prompt,
      ai_result: aiResult?.slice(0, 60) + "...",
    });

    const { data, error: insertError } = await supabase.from("uploads").insert({
      user_id: user?.id || null,
      image_url: publicUrl ?? "",
      prompt: prompt || "",
      ai_result: aiResult,
    });

    if (insertError) {
      console.error("❌ Supabase Insert Error:", insertError.message);
    } else {
      console.log("✅ Upload berhasil disimpan ke database:", data);
    }

    // === Response ke client ===
    res.status(200).json({
      success: true,
      message: aiResult,
      image_url: publicUrl,
    });
  } catch (error: any) {
    console.error("🔥 Fatal Error:", error.message);
    res.status(500).json({
      error: "Terjadi error tak terduga saat memproses AI.",
      detail: error.message,
    });
  }
};

// === DELETE USER UPLOAD ===
export const deleteUserUpload = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user?.id) {
      return res.status(401).json({ error: "User belum terautentikasi" });
    }

    // cek dulu apakah data milik user
    const { data: existing, error: findError } = await supabase
      .from("uploads")
      .select("image_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ error: "Data tidak ditemukan atau bukan milik user ini" });
    }

    // hapus dari storage (kalau ada gambar)
    if (existing.image_url) {
      try {
        const path = existing.image_url.split("/storage/v1/object/public/uploads/")[1];
        if (path) {
          await supabase.storage.from("uploads").remove([path]);
          console.log("🗑️ File dihapus dari storage:", path);
        }
      } catch (err) {
        const error = err as Error;
        console.warn("⚠️ Gagal hapus file storage:", error.message);
      }
    }

    // hapus dari database
    const { error: deleteError } = await supabase
      .from("uploads")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Upload berhasil dihapus" });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Gagal menghapus upload:", error.message);
    res.status(500).json({ error: "Gagal menghapus data" });
  }
};


// === GET USER UPLOADS (untuk Medical History) ===
export const getUserUploads = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "User belum terautentikasi" });
    }

    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    console.error("❌ Gagal mengambil uploads:", err.message);
    res.status(500).json({ error: "Gagal mengambil uploads" });
  }
};

