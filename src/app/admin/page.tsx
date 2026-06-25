"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";

export default function AdminPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoading) return;
    if (user) router.push("/admin/dashboard");
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <Loader2 className="h-8 w-8 animate-spin text-[#B0B4A8]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center  p-6">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="font-bagel text-4xl text-[#B0B4A8] tracking-wide">
            ADMIN ACCESS
          </h2>
          <p className="mt-2 text-sm text-black/50">Enter credentials to proceed</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-black/30" />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl bg-black/5 py-3 pl-10 pr-4 text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B0B4A8]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-black/30" />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl bg-black/5 py-3 pl-10 pr-4 text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#B0B4A8]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#B0B4A8] py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}