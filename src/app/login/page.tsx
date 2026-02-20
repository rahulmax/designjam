"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-jam-bg">
      <div className="w-full max-w-md p-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-jam-yellow">
            <span className="font-mono text-sm font-bold text-jam-text-on-accent">
              DJ
            </span>
          </div>
          <span className="font-sans text-base font-bold tracking-[2px] text-jam-yellow">
            DESIGN JAM
          </span>
        </div>

        <h1 className="mb-2 font-sans text-3xl font-bold tracking-wide text-jam-text-primary">
          SIGN IN
        </h1>
        <p className="mb-8 font-mono text-xs tracking-wide text-jam-text-secondary">
          ENTER YOUR CREDENTIALS TO ACCESS TOPIC VOTING
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@team.com"
              required
              className="h-10 border-jam-border-secondary bg-jam-bg font-mono text-sm text-jam-text-primary placeholder:text-jam-text-placeholder focus-visible:ring-jam-yellow"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-10 border-jam-border-secondary bg-jam-bg font-mono text-sm text-jam-text-primary placeholder:text-jam-text-placeholder focus-visible:ring-jam-yellow"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-jam-orange">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full bg-jam-yellow font-sans text-sm font-bold tracking-wide text-jam-text-on-accent hover:bg-jam-yellow/90 disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Button>
        </form>
      </div>
    </div>
  );
}
