
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import BookList from '@/components/BookList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Library = () => {
  const { user } = useAuth();
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return;

      // Fetch books owned by the user
      const { data: owned, error: ownedError } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', user.id);

      if (ownedError) {
        console.error('Error fetching owned books:', ownedError);
      } else {
        setOwnedBooks(owned || []);
      }

      // Fetch books borrowed by the user
      const { data: exchanges, error: borrowedError } = await supabase
        .from('book_exchanges')
        .select('*, book:books(*)')
        .eq('borrower_id', user.id)
        .eq('status', 'active');

      if (borrowedError) {
        console.error('Error fetching borrowed books:', borrowedError);
      } else {
        const borrowedBooks = exchanges?.map(exchange => exchange.book) || [];
        setBorrowedBooks(borrowedBooks);
      }

      setLoading(false);
    };

    fetchBooks();
  }, [user]);

  if (!user) return null;

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-serif font-bold mb-6">My Library</h1>
        
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owned">Books I Own ({ownedBooks.length})</TabsTrigger>
            <TabsTrigger value="borrowed">Books I'm Borrowing ({borrowedBooks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="owned" className="mt-6">
            {ownedBooks.length > 0 ? (
              <BookList 
                books={ownedBooks} 
                onBookRemoved={() => {
                  // Refresh the owned books list
                  const fetchOwnedBooks = async () => {
                    const { data } = await supabase
                      .from('books')
                      .select('*')
                      .eq('owner_id', user.id);
                    setOwnedBooks(data || []);
                  };
                  fetchOwnedBooks();
                }}
                showAvailabilityToggle={true}
              />
            ) : (
              <p className="text-center text-gray-500">You haven't added any books yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="borrowed" className="mt-6">
            {borrowedBooks.length > 0 ? (
              <BookList books={borrowedBooks} onBookRemoved={() => {}} />
            ) : (
              <p className="text-center text-gray-500">You aren't borrowing any books at the moment.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default Library;
