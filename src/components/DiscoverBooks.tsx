
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

const DiscoverBooks = () => {
  const { user } = useAuth();

  const { data: books, isLoading } = useQuery({
    queryKey: ['available-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Book[];
    },
    refetchInterval: 2000,
    enabled: !!user, // Only fetch if user is authenticated
  });

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Please sign in to view available books.</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow">
            <Skeleton className="w-24 h-32" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No books are available for borrowing at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {books?.map((book) => (
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
        </div>
      ))}
    </div>
  );
};

export default DiscoverBooks;
