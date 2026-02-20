import { SessionProvider } from "@/components/session-provider";

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
