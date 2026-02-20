"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password);
      await update({ mustResetPassword: false });
      router.push("/");
      router.refresh();
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
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
          SET YOUR PASSWORD
        </h1>
        <p className="mb-8 font-mono text-xs tracking-wide text-jam-text-secondary">
          PLEASE SET A NEW PASSWORD BEFORE CONTINUING
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              New Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              className="h-10 border-jam-border-secondary bg-jam-bg font-mono text-sm text-jam-text-primary placeholder:text-jam-text-placeholder focus-visible:ring-jam-yellow"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
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
            {loading ? "SAVING..." : "SET PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
}
