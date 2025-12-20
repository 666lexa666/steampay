import { supabase } from "../lib/supabase";

export async function getTechStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("tech")
      .select("tech")
      .eq("id", 2)
      .maybeSingle();

    if (error) {
      console.error("Supabase tech-status error:", error);
      return false;
    }

    return data?.tech ?? false;
  } catch (err) {
    console.error("Supabase fetch exception:", err);
    return false;
  }
}
