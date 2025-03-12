
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import MessageList from '@/components/messages/MessageList';
import MessageComposer from '@/components/messages/MessageComposer';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

type RealtimePayload = {
  new: Message;
  old: Message;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

const Messages = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      setUsers(data || []);
    };

    fetchUsers();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedUserId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages with correct channel configuration
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user?.id},receiver_id=eq.${selectedUserId}`
        },
        (payload: RealtimePayload) => {
          if (payload.new && 
              ((payload.new.sender_id === user?.id && payload.new.receiver_id === selectedUserId) ||
               (payload.new.sender_id === selectedUserId && payload.new.receiver_id === user?.id))) {
            setMessages(current => [...current, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUserId, user?.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          {users.map((otherUser) => (
            <Button
              key={otherUser.id}
              variant={selectedUserId === otherUser.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedUserId(otherUser.id)}
            >
              {otherUser.full_name || otherUser.username || 'Anonymous User'}
            </Button>
          ))}
        </div>
        
        <div className="md:col-span-3">
          {selectedUserId ? (
            <div className="space-y-4">
              <MessageList messages={messages} currentUserId={user?.id} />
              <MessageComposer 
                receiverId={selectedUserId}
                onMessageSent={(message) => setMessages(current => [...current, message])}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
