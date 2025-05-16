import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted", { email, password: "[REDACTED]" });

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      console.log("Attempting to sign in...");
      console.log("Current auth state before sign in:", { user: null, loading: false });
      
      const result = await signIn(email, password);
      console.log("Sign in result:", result);

      if (result && result.user) {
        console.log("Login successful, navigating to dashboard");
        console.log("User data:", {
          id: result.user.id,
          email: result.user.email,
          metadata: result.user.user_metadata
        });
        navigate("/dashboard");
      } else {
        console.error("Login failed: No user returned");
        setError("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      });
      setError(error.message || "Invalid email or password");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
          >
            Sign in
          </Button>

          <div className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
