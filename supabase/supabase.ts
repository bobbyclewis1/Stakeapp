import { createClient } from "@supabase/supabase-js";

// Debug environment variables
console.log("Environment variables check:", {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  allEnvKeys: Object.keys(import.meta.env),
  viteEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

// Function to initialize Supabase with retries
async function initializeSupabase(retries = 3, delay = 1000) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("Attempting to initialize Supabase with:", {
    url: supabaseUrl ? "[URL PROVIDED]" : "[MISSING URL]",
    key: supabaseAnonKey ? "[KEY PROVIDED]" : "[MISSING KEY]",
    retries,
    delay
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase configuration:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
    });
    throw new Error("Missing Supabase configuration");
  }

  for (let i = 0; i < retries; i++) {
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });

      // Test the connection
      const { data, error } = await client.auth.getSession();
      if (error) throw error;

      console.log("Supabase client initialized successfully on attempt", i + 1);
      return client;
    } catch (error) {
      console.error(`Supabase initialization attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to initialize Supabase client after all retries");
}

// Initialize Supabase
let supabase;
try {
  supabase = await initializeSupabase();
} catch (error) {
  console.error("Fatal error initializing Supabase:", error);
  throw error;
}

export { supabase };
