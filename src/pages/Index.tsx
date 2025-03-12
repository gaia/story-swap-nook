import { Button } from "@/components/ui/button";
import { BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AddBookForm from "@/components/AddBookForm";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import Footer from "@/components/Footer";
import DiscoverBooks from "@/components/DiscoverBooks";

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Add a Book</h2>
            <AddBookForm />
          </section>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-primary hover:text-primary/90 transition-colors">
              BookNook.space
            </Link>
            <Button variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            Share Stories, Build Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join Barcelona's community of English-speaking parents exchanging children's books,
            connecting families through the joy of reading.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 border rounded-lg bg-white">
              <BookOpen className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Share Your Books</h3>
              <p className="text-gray-600">
                List your children's books and connect with nearby families
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white">
              <Users className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Meet Local Parents</h3>
              <p className="text-gray-600">
                Exchange books in person and grow your community
              </p>
            </div>
          </div>

          <Button size="lg" asChild className="mt-8">
            <Link to="/auth">Join the Community</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
