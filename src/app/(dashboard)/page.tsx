import { auth } from "@/lib/auth";
import { getTopics, getStats } from "@/lib/actions";
import { DashboardContent } from "@/components/dashboard-content";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [openTopics, doneTopics, stats] = await Promise.all([
    getTopics("open"),
    getTopics("done"),
    getStats(),
  ]);

  return (
    <DashboardContent
      openTopics={openTopics}
      doneTopics={doneTopics}
      stats={stats}
      isAdmin={session.user.role === "admin"}
      currentUserId={session.user.id}
    />
  );
}
