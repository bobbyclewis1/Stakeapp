// Environment configuration
const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
};

// Validate environment variables
if (!env.supabase.url || !env.supabase.anonKey) {
  console.error("Missing required environment variables:", {
    hasSupabaseUrl: !!env.supabase.url,
    hasSupabaseAnonKey: !!env.supabase.anonKey,
    allEnvKeys: Object.keys(import.meta.env),
    viteEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  });
  throw new Error("Missing required environment variables");
}

console.log("Environment configuration loaded:", {
  mode: env.mode,
  hasSupabaseConfig: !!env.supabase.url && !!env.supabase.anonKey,
  envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

export default env; 