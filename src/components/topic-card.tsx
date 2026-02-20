"use client";

import { vote, markTopicDone } from "@/lib/actions";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EditTopicDialog } from "./edit-topic-dialog";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
    presenter: { id: string; name: string };
    totalVotes: number;
    userVoteCount: number;
  };
  rank: number;
  isAdmin: boolean;
  currentUserId: string;
}

export function TopicCard({
  topic,
  rank,
  isAdmin,
  currentUserId,
}: TopicCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTotal, setOptimisticTotal] = useState(topic.totalVotes);
  const [optimisticUserVotes, setOptimisticUserVotes] = useState(
    topic.userVoteCount
  );
  const isDone = topic.status === "done";
  const isOwner = topic.presenter.id === currentUserId;

  function handleVote(action: "up" | "down") {
    if (isDone) return;
    if (action === "up" && optimisticUserVotes >= 5) {
      toast.error("Maximum 5 votes per topic");
      return;
    }
    if (action === "down" && optimisticUserVotes <= 0) return;

    const delta = action === "up" ? 1 : -1;
    setOptimisticTotal((prev) => prev + delta);
    setOptimisticUserVotes((prev) => prev + delta);

    startTransition(async () => {
      try {
        await vote(topic.id, action);
      } catch (err) {
        setOptimisticTotal((prev) => prev - delta);
        setOptimisticUserVotes((prev) => prev - delta);
        toast.error(err instanceof Error ? err.message : "Vote failed");
      }
    });
  }

  function handleMarkDone() {
    startTransition(async () => {
      try {
        await markTopicDone(topic.id);
        toast.success("Topic marked as done");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to mark as done"
        );
      }
    });
  }

  const voteColor =
    optimisticUserVotes >= 5
      ? "text-jam-orange"
      : optimisticUserVotes > 0
        ? "text-jam-yellow"
        : "text-jam-text-secondary";

  return (
    <div className="flex items-center gap-6 border-b border-jam-border px-6 py-5">
      {/* Vote Section */}
      <div className="flex w-16 shrink-0 flex-col items-center gap-1">
        <span className="font-sans text-[28px] font-bold leading-none text-jam-yellow">
          {optimisticTotal}
        </span>
        <span className="font-mono text-[9px] font-bold tracking-wider text-jam-text-secondary">
          VOTES
        </span>
        {!isDone && (
          <div className="mt-1 flex gap-1">
            <button
              onClick={() => handleVote("up")}
              disabled={isPending || optimisticUserVotes >= 5}
              className="flex h-6 w-7 items-center justify-center bg-jam-yellow font-sans text-sm font-bold text-jam-text-on-accent transition-opacity disabled:opacity-40"
            >
              +
            </button>
            <button
              onClick={() => handleVote("down")}
              disabled={isPending || optimisticUserVotes <= 0}
              className="flex h-6 w-7 items-center justify-center border border-jam-border-secondary font-sans text-sm font-bold text-jam-text-secondary transition-opacity disabled:opacity-40"
            >
              -
            </button>
          </div>
        )}
      </div>

      {/* Topic Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-jam-text-primary">
          {topic.title}
        </h3>
        <p className="font-mono text-[11px] leading-relaxed tracking-wide text-jam-text-secondary">
          {topic.description}
        </p>
        <div className="mt-1 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-jam-orange" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-jam-orange">
              {topic.presenter.name.toUpperCase()}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider text-jam-text-secondary">
            {format(new Date(topic.createdAt), "MMM dd, yyyy").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {!isDone && (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] font-bold tracking-wider text-jam-text-secondary">
              YOUR VOTES:
            </span>
            <span className={`font-sans text-xs font-bold tracking-wider ${voteColor}`}>
              {optimisticUserVotes}/5
            </span>
          </div>
        )}

        {isDone ? (
          <span className="border border-jam-text-secondary px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider text-jam-text-secondary">
            COMPLETED
          </span>
        ) : isAdmin ? (
          <button
            onClick={handleMarkDone}
            disabled={isPending}
            className="bg-jam-orange px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider text-jam-text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            MARK AS DONE
          </button>
        ) : rank <= 3 ? (
          <span
            className={`border px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider ${
              rank === 1
                ? "border-jam-yellow text-jam-yellow"
                : "border-jam-border-secondary text-jam-text-primary"
            }`}
          >
            {rank === 1 ? `[0${rank}] TOP` : `[0${rank}]`}
          </span>
        ) : null}

        {!isDone && isOwner && (
          <EditTopicDialog topic={topic} />
        )}
      </div>
    </div>
  );
}
