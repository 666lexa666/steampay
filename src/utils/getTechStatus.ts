import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTechStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("tech")
      .select("tech")
      .eq("id", 2)
      .single();

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
