import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import AuthLayout from "../auth/AuthLayout";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Sign in to your account</h2>
          <p className="text-gray-500">
            Enter your credentials to access your boards and tasks
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/login" className="block w-full">
            <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 text-sm font-medium">
              Sign in with email
            </Button>
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Link to="/signup" className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium"
            >
              Create an account
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-800">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-gray-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
