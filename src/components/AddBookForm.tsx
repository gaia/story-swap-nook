
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateISBN, fetchBookData } from '@/lib/isbn';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AddBookForm = () => {
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

    setLoading(true);
    try {
      const bookData = await fetchBookData(cleanISBN);
      
      const { error } = await supabase.from('books').insert({
        owner_id: user.id,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
  );
};

export default AddBookForm;
