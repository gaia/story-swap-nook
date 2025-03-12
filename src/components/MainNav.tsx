
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Library, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MainNav = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('');

  useEffect(() => {
    const currentRoute = location.pathname.replace('/', '') || 'discover';
    setActive(currentRoute);
  }, [location]);

  // If user is not authenticated, don't render the navigation
  if (!user) return null;

  const navItems = [
    { name: 'Discover', icon: BookOpen, route: 'discover' },
    { name: 'My Library', icon: Library, route: 'library' },
    { name: 'Profile', icon: User, route: 'profile' },
  ];

  const handleNavigation = (route: string) => {
    setActive(route);
    navigate(`/${route === 'discover' ? '' : route}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.route}
            variant="ghost"
            className={cn(
              "flex items-center space-x-2",
              active === item.route 
                ? "text-primary bg-primary/10 rounded-lg" 
                : "text-gray-500"
            )}
            onClick={() => handleNavigation(item.route)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-500"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default MainNav;
