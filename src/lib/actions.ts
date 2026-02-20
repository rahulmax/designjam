"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

// ---- Auth Actions ----

export async function resetPassword(newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashed = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed, mustResetPassword: false },
  });

  return { success: true };
}

// ---- Topic Actions ----

export async function createTopic(title: string, description: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (!title.trim() || !description.trim()) {
    throw new Error("Title and description are required");
  }

  await prisma.topic.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      presenterId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function updateTopic(
  topicId: string,
  title: string,
  description: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) throw new Error("Topic not found");
  if (topic.presenterId !== session.user.id)
    throw new Error("Not authorized");
  if (topic.status === "done") throw new Error("Cannot edit completed topic");

  await prisma.topic.update({
    where: { id: topicId },
    data: { title: title.trim(), description: description.trim() },
  });

  revalidatePath("/");
}

export async function markTopicDone(topicId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.role !== "admin") throw new Error("Admin only");

  await prisma.topic.update({
    where: { id: topicId },
    data: { status: "done", completedAt: new Date() },
  });

  revalidatePath("/");
}

// ---- Vote Actions ----

export async function vote(topicId: string, action: "up" | "down") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic || topic.status === "done")
    throw new Error("Cannot vote on this topic");

  const existingVote = await prisma.vote.findUnique({
    where: { userId_topicId: { userId: session.user.id, topicId } },
  });

  if (action === "up") {
    if (existingVote) {
      if (existingVote.count >= 5)
        throw new Error("Maximum 5 votes per topic");
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { count: existingVote.count + 1 },
      });
    } else {
      await prisma.vote.create({
        data: { userId: session.user.id, topicId, count: 1 },
      });
    }
  } else {
    if (!existingVote || existingVote.count <= 0)
      throw new Error("No votes to remove");
    if (existingVote.count === 1) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
    } else {
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { count: existingVote.count - 1 },
      });
    }
  }

  revalidatePath("/");
}

// ---- Data Fetching ----

export async function getTopics(status: "open" | "done") {
  const session = await auth();
  const userId = session?.user?.id;

  const topics = await prisma.topic.findMany({
    where: { status },
    include: {
      presenter: { select: { id: true, name: true } },
      votes: true,
    },
    orderBy:
      status === "open"
        ? [{ createdAt: "asc" }]
        : [{ completedAt: "desc" }],
  });

  // Calculate totals and sort open topics by total votes desc, then createdAt asc
  const enriched = topics.map((topic) => {
    const totalVotes = topic.votes.reduce((sum, v) => sum + v.count, 0);
    const userVote = userId
      ? topic.votes.find((v) => v.userId === userId)
      : undefined;
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      status: topic.status,
      createdAt: topic.createdAt.toISOString(),
      completedAt: topic.completedAt?.toISOString() ?? null,
      presenter: topic.presenter,
      totalVotes,
      userVoteCount: userVote?.count ?? 0,
    };
  });

  if (status === "open") {
    enriched.sort((a, b) => {
      if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }

  return enriched;
}

export async function getStats() {
  const [topicCount, voteAgg, doneCount] = await Promise.all([
    prisma.topic.count({ where: { status: "open" } }),
    prisma.vote.aggregate({
      _sum: { count: true },
      where: { topic: { status: "open" } },
    }),
    prisma.topic.count({ where: { status: "done" } }),
  ]);

  return {
    topics: topicCount,
    votes: voteAgg._sum.count ?? 0,
    discussions: doneCount,
  };
}
