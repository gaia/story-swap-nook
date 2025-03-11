import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateISBN, fetchBookData } from '@/lib/isbn';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BookList from './BookList';

const AddBookForm = () => {
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [pendingIsbn, setPendingIsbn] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserBooks = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching books:', error);
      return;
    }
    
    setBooks(data);
  };

  useEffect(() => {
    fetchUserBooks();
  }, [user]);

  const checkForDuplicate = async (bookData: { title: string; author: string }) => {
    const { data } = await supabase
      .from('books')
      .select('title, author')
      .eq('owner_id', user?.id)
      .eq('title', bookData.title)
      .eq('author', bookData.author);

    return data && data.length > 0;
  };

  const handleDuplicateConfirm = async () => {
    if (!pendingIsbn) return;
    await addBook(pendingIsbn);
    setPendingIsbn(null);
    setDuplicateDialogOpen(false);
  };

  const addBook = async (cleanISBN: string) => {
    setLoading(true);
    try {
      const bookData = await fetchBookData(cleanISBN);
      
      const { error } = await supabase.from('books').insert({
        owner_id: user?.id,
        isbn_10: cleanISBN.length === 10 ? cleanISBN : null,
        isbn_13: cleanISBN.length === 13 ? cleanISBN : null,
        ...bookData
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Book added successfully"
      });
      
      setIsbn('');
      fetchUserBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add book",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add books",
        variant: "destructive"
      });
      return;
    }

    const cleanISBN = isbn.replace(/[-\s]/g, '');
    if (!validateISBN(cleanISBN)) {
      toast({
        title: "Invalid ISBN",
        description: "Please enter a valid ISBN-10 or ISBN-13",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookData = await fetchBookData(cleanISBN);
      const isDuplicate = await checkForDuplicate(bookData);
      if (isDuplicate) {
        setPendingIsbn(cleanISBN);
        setDuplicateDialogOpen(true);
        return;
      }

      await addBook(cleanISBN);
    } catch (error) {
      console.error('Error checking for duplicate:', error);
      toast({
        title: "Error",
        description: "Failed to check for duplicate book",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            Enter ISBN (10 or 13 digits)
          </label>
          <Input
            id="isbn"
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN-10 or ISBN-13"
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding Book...' : 'Add Book'}
        </Button>
      </form>

      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Book</AlertDialogTitle>
            <AlertDialogDescription>
              Do you mean to add this book again? You should only do that when you have multiple copies of the same book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPendingIsbn(null);
              setDuplicateDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateConfirm}>
              Add Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BookList books={books} onBookRemoved={fetchUserBooks} />
    </div>
  );
};

export default AddBookForm;
