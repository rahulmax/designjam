"use client";

import { useState } from "react";
import { TopicList } from "./topic-list";
import { SubmitTopicDialog } from "./submit-topic-dialog";

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

interface DashboardContentProps {
  openTopics: Topic[];
  doneTopics: Topic[];
  stats: { topics: number; votes: number; discussions: number };
  isAdmin: boolean;
  currentUserId: string;
}

export function DashboardContent({
  openTopics,
  doneTopics,
  stats,
  isAdmin,
  currentUserId,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="flex h-full flex-col gap-8 p-10">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="font-sans text-4xl font-bold tracking-wide text-jam-text-primary">
            TOPIC VOTING
          </h1>
          <p className="font-mono text-[13px] tracking-wider text-jam-text-secondary">
            FRIDAY DESIGN JAM — VOTE ON WHAT WE DISCUSS NEXT
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SubmitTopicDialog />
        </div>
      </div>

      {/* Tabs and Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex h-10 items-center justify-center px-5 font-mono text-xs font-bold tracking-wider transition-colors ${
              activeTab === "upcoming"
                ? "bg-jam-yellow text-jam-text-on-accent"
                : "border border-jam-border text-jam-text-secondary hover:text-jam-text-primary"
            }`}
          >
            UPCOMING WEEK
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex h-10 items-center justify-center px-5 font-mono text-xs font-bold tracking-wider transition-colors ${
              activeTab === "past"
                ? "bg-jam-yellow text-jam-text-on-accent"
                : "border border-jam-border text-jam-text-secondary hover:text-jam-text-primary"
            }`}
          >
            PAST SESSIONS
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-jam-yellow" />
            <span className="font-mono text-xs tracking-wider text-jam-text-secondary">
              <span className="font-bold text-jam-text-primary">
                {stats.topics}
              </span>{" "}
              TOPICS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-jam-orange" />
            <span className="font-mono text-xs tracking-wider text-jam-text-secondary">
              <span className="font-bold text-jam-text-primary">
                {stats.votes}
              </span>{" "}
              VOTES CAST
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-jam-cyan" />
            <span className="font-mono text-xs tracking-wider text-jam-text-secondary">
              <span className="font-bold text-jam-text-primary">
                {stats.discussions}
              </span>{" "}
              DISCUSSIONS
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-jam-border" />

      {/* Topic List */}
      <TopicList
        topics={activeTab === "upcoming" ? openTopics : doneTopics}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
      />
    </div>
  );
}
