import { Request, Response } from "express";
import { supabase } from "../utils/supabase";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // simpan username di metadata Supabase
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    const user = data.user;

    // Upsert ke table profiles (optional, trigger sudah handle)
    if (user) {
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          username: username || user.email?.split("@")[0],
        })
        .eq("id", user.id);
    }

    res.status(200).json({
      message: "Register berhasil 🎉",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan di server" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({
      message: "Login berhasil ✅",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan di server" });
  }
};

// GET ME
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, email")
      .eq("id", user.id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Data user berhasil diambil ✅",
      user: profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan di server" });
  }
};
