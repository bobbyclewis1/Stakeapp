import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create or update the public.users record
async function syncUserProfile(user: User) {
  if (!user) return;

  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error("Error syncing user profile:", error);
  }

  return data;
}

// Hook to handle auth state
function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        console.log("Initial auth state:", { 
          hasSession: !!session,
          hasUser: !!currentUser,
          userId: currentUser?.id
        });
        
        setUser(currentUser);

        if (currentUser) {
          await syncUserProfile(currentUser);
        }

        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth state:", error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, hasSession: !!session });
      
      if (!mounted) return;
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === "SIGNED_IN" && currentUser) {
        await syncUserProfile(currentUser);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create the user record in the public.users table
    if (data.user) {
      await syncUserProfile(data.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Auth: signIn called with email:", email);
    try {
      if (!initialized) {
        console.log("Waiting for auth initialization...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log("Auth: Attempting Supabase signInWithPassword...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Auth: signIn response:", { 
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorStatus: error?.status
      });

      if (error) {
        console.error("Auth: signIn error:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }

      // Make sure we update the user state after successful login
      if (data && data.user) {
        console.log("Auth: User authenticated successfully:", {
          userId: data.user.id,
          email: data.user.email,
          hasSession: !!data.session
        });
        setUser(data.user);
        await syncUserProfile(data.user);
      } else {
        console.error(
          "Auth: Authentication succeeded but no user data returned",
          { data }
        );
      }
      return data;
    } catch (err) {
      console.error("Auth: Exception in signIn:", {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      throw err;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signIn, signUp, signOut };
}

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
