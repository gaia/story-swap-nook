
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
}

interface BookListProps {
  books: Book[];
  onBookRemoved: () => void;
}

const BookList = ({ books, onBookRemoved }: BookListProps) => {
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
