import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Jam — Topic Voting",
  description: "Vote on what we discuss next at Friday Design Jam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#232323",
              border: "1px solid #2d2d2d",
              color: "#F5F5F0",
            },
          }}
        />
      </body>
    </html>
  );
}
