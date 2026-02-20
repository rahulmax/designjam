"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTopic } from "@/lib/actions";
import { toast } from "sonner";

export function SubmitTopicDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Both fields are required");
      return;
    }

    startTransition(async () => {
      try {
        await createTopic(title, description);
        toast.success("Topic submitted!");
        setTitle("");
        setDescription("");
        setOpen(false);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to submit topic"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-10 items-center gap-2.5 bg-jam-yellow px-5 font-sans text-xs font-bold tracking-wider text-jam-text-on-accent transition-opacity hover:opacity-90">
          <span>+</span>
          SUBMIT NEW TOPIC
        </button>
      </DialogTrigger>
      <DialogContent className="border-jam-border bg-jam-bg-elevated sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-sans text-lg font-bold tracking-wider text-jam-text-primary">
            SUBMIT NEW TOPIC
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Topic title"
              required
              className="h-10 border-jam-border-secondary bg-jam-bg font-mono text-sm text-jam-text-primary placeholder:text-jam-text-placeholder focus-visible:ring-jam-yellow"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-jam-text-secondary">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your topic..."
              required
              rows={4}
              className="border-jam-border-secondary bg-jam-bg font-mono text-sm text-jam-text-primary placeholder:text-jam-text-placeholder focus-visible:ring-jam-yellow"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-jam-border-secondary font-mono text-xs font-bold tracking-wider text-jam-text-secondary hover:bg-jam-border hover:text-jam-text-primary"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-jam-yellow font-mono text-xs font-bold tracking-wider text-jam-text-on-accent hover:bg-jam-yellow/90 disabled:opacity-50"
            >
              {isPending ? "SUBMITTING..." : "SUBMIT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
