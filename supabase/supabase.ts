import { createClient } from "@supabase/supabase-js";
import env from "../src/config/env";

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
  console.log("Attempting to initialize Supabase with configuration:", {
    hasUrl: !!env.supabase.url,
    hasKey: !!env.supabase.anonKey,
    mode: env.mode,
    retries,
    delay
  });

  for (let i = 0; i < retries; i++) {
    try {
      const client = createClient(env.supabase.url, env.supabase.anonKey, {
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
