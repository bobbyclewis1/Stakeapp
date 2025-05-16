import { createClient } from "@supabase/supabase-js";

// Debug environment variables
console.log("Environment variables check:", {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  allEnvKeys: Object.keys(import.meta.env),
  viteEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}
if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

console.log("Initializing Supabase client with:", {
  url: supabaseUrl ? "[URL PROVIDED]" : "[MISSING URL]",
  key: supabaseAnonKey ? "[KEY PROVIDED]" : "[MISSING KEY]",
  envType: import.meta.env.MODE,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

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
