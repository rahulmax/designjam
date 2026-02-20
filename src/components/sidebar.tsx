import { auth, signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";

export async function Sidebar() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col justify-between border-r border-jam-border bg-jam-bg">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-9 w-9 items-center justify-center bg-jam-yellow">
            <span className="font-mono text-sm font-bold text-jam-text-on-accent">
              DJ
            </span>
          </div>
          <span className="font-sans text-base font-bold tracking-[2px] text-jam-yellow">
            DESIGN JAM
          </span>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5 py-6">
          <div className="flex h-12 items-center gap-4 border-l-[3px] border-jam-yellow px-6">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFD600"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="font-mono text-xs font-bold tracking-wider text-jam-yellow">
              TOPICS
            </span>
          </div>
        </nav>
      </div>

      {/* Bottom - User */}
      <div className="border-t border-jam-border px-6 py-4">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 bg-jam-yellow" />
              <span className="font-mono text-xs font-bold tracking-wider text-jam-text-primary">
                {user.name?.toUpperCase() ?? "USER"}
              </span>
              {isAdmin && (
                <span className="bg-jam-orange px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-jam-text-on-accent">
                  ADMIN
                </span>
              )}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-jam-text-secondary transition-colors hover:text-jam-text-primary"
              >
                <LogOut size={14} />
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-3 transition-colors hover:opacity-80"
          >
            <div className="h-2.5 w-2.5 bg-jam-text-secondary" />
            <span className="font-mono text-xs font-bold tracking-wider text-jam-text-secondary">
              SIGN IN
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}
