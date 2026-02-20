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
import { updateTopic } from "@/lib/actions";
import { toast } from "sonner";

interface EditTopicDialogProps {
  topic: {
    id: string;
    title: string;
    description: string;
  };
}

export function EditTopicDialog({ topic }: EditTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(topic.title);
  const [description, setDescription] = useState(topic.description);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Both fields are required");
      return;
    }

    startTransition(async () => {
      try {
        await updateTopic(topic.id, title, description);
        toast.success("Topic updated!");
        setOpen(false);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update topic"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="font-mono text-[9px] font-bold tracking-wider text-jam-text-secondary transition-colors hover:text-jam-text-primary">
          EDIT
        </button>
      </DialogTrigger>
      <DialogContent className="border-jam-border bg-jam-bg-elevated sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-sans text-lg font-bold tracking-wider text-jam-text-primary">
            EDIT TOPIC
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
              {isPending ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
