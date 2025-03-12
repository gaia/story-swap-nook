
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: any[];
  currentUserId: string | undefined;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto p-4 border rounded-lg">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "max-w-[80%] p-3 rounded-lg",
            message.sender_id === currentUserId
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p>{message.content}</p>
          <span className="text-xs opacity-70">
            {new Date(message.created_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
