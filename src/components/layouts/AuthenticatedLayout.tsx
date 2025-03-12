
import { ReactNode } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-primary hover:text-primary/90 transition-colors">
              BookNook.space
            </Link>
          </div>
        </div>
      </header>

      <MainNav />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;
