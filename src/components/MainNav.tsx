
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Library, LogOut, MapPin, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MainNav = () => {
  const [active, setActive] = useState('discover');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Discover', icon: BookOpen, route: 'discover' },
    { name: 'My Library', icon: Library, route: 'library' },
    { name: 'Messages', icon: MessageCircle, route: 'messages' },
    { name: 'Location', icon: MapPin, route: 'location' },
    { name: 'Profile', icon: User, route: 'profile' },
  ];

  const handleNavigation = (route: string) => {
    setActive(route);
    if (route === 'messages') {
      navigate('/messages');
    }
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
              active === item.route ? "text-primary" : "text-gray-500"
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
