import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

console.log("Initializing Supabase client with:", {
  url: supabaseUrl ? "[URL PROVIDED]" : "[MISSING URL]",
  key: supabaseAnonKey ? "[KEY PROVIDED]" : "[MISSING KEY]",
  envType: import.meta.env.MODE,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration error:", {
    missingUrl: !supabaseUrl,
    missingKey: !supabaseAnonKey,
    envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  });
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  throw error;
}

export { supabase };
