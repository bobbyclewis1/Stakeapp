import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Welcome Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl text-gray-300">
            Sign in to access your account and continue your journey with us.
          </p>
        </div>
      </div>

      {/* Right Column - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button 
              type="submit" 
              className="w-full h-12 bg-black text-white hover:bg-gray-800"
            >
              Sign In
            </Button>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-black hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 