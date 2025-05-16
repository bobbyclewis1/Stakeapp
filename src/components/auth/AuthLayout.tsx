import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Solid Color with Title */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center">
        <div className="text-center text-white px-12">
          <h1 className="text-5xl font-bold mb-4">Tremonton Stake</h1>
          <p className="text-xl text-blue-100">
            Your all-in-one project management solution
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
