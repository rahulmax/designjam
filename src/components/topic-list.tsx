"use client";

import { TopicCard } from "./topic-card";

interface Topic {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  presenter: { id: string; name: string };
  totalVotes: number;
  userVoteCount: number;
}

interface TopicListProps {
  topics: Topic[];
  isAdmin: boolean;
  currentUserId: string | null;
}

export function TopicList({ topics, isAdmin, currentUserId }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-mono text-sm tracking-wider text-jam-text-secondary">
          NO TOPICS YET
        </p>
        <p className="mt-2 font-mono text-xs text-jam-text-placeholder">
          Be the first to submit a topic for discussion
        </p>
      </div>
    );
  }

  return (
    <div className="border border-jam-border">
      {topics.map((topic, index) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          rank={index + 1}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
