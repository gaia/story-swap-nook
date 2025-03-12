
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MessageComposerProps {
  receiverId: string;
  onMessageSent: (message: any) => void;
}

const MessageComposer = ({ receiverId, onMessageSent }: MessageComposerProps) => {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        receiver_id: receiverId,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
      return;
    }

    if (data) {
      onMessageSent(data);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg"
        placeholder="Type your message..."
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageComposer;
