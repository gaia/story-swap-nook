
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  description: string | null;
  isbn_10: string | null;
  isbn_13: string | null;
  status: string;
}

interface BookListProps {
  books: Book[];
  onBookRemoved: () => void;
  showAvailabilityToggle?: boolean;
}

const BookList = ({ books, onBookRemoved, showAvailabilityToggle = false }: BookListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (bookId: string) => {
    setDeletingId(bookId);
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book removed successfully"
      });
      
      onBookRemoved();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove book",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailability = async (bookId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
      const { error } = await supabase
        .from('books')
        .update({ status: newStatus })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Book marked as ${newStatus}`
      });
      
      onBookRemoved(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {books.map((book) => (
        <div key={book.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
          {book.cover_url && (
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-24 h-32 object-cover rounded"
            />
          )}
          <div className="flex-grow space-y-2">
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
            {book.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
            )}
            <p className="text-xs text-gray-500">
              ISBN: {book.isbn_13 || book.isbn_10}
            </p>
            {showAvailabilityToggle && (
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={book.status === 'available'}
                  onCheckedChange={() => toggleAvailability(book.id, book.status)}
                />
                <span className="text-sm">
                  {book.status === 'available' ? 'Available for borrowing' : 'Not available'}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(book.id)}
            disabled={deletingId === book.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BookList;
