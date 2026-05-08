"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDateTime } from "@/lib/format";
import { Send } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MessageThreadProps {
  issueId: Id<"issues">;
}

export function IssueMessageThread({ issueId }: MessageThreadProps) {
  const { profile } = useCurrentUser();
  const messages = useQuery(api.messages.listByIssue, { issueId }) ?? [];
  const sendMessage = useMutation(api.messages.send);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await sendMessage({ issueId, content: content.trim() });
      setContent("");
    } finally {
      setSending(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    tenant: "bg-blue-50 text-blue-700",
    landlord: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Messages</h3>
      <ScrollArea className="flex-1 max-h-[400px] pr-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === profile?._id;
              return (
                <div
                  key={msg._id}
                  className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {!isMe && (
                      <p className="text-xs font-medium mb-0.5">
                        {msg.senderName}
                        <span className={cn("ml-1.5 px-1.5 py-0.5 rounded text-[10px]", roleColors[msg.senderRole])}>
                          {msg.senderRole}
                        </span>
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn("text-[10px] mt-1", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {formatDateTime(msg._creationTime)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="flex gap-2 mt-3 pt-3 border-t">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={sending || !content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
