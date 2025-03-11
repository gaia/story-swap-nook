
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Library, MapPin, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const [active, setActive] = useState('discover');

  const navItems = [
    { name: 'Discover', icon: BookOpen, route: 'discover' },
    { name: 'My Library', icon: Library, route: 'library' },
    { name: 'Messages', icon: MessageCircle, route: 'messages' },
    { name: 'Location', icon: MapPin, route: 'location' },
    { name: 'Profile', icon: User, route: 'profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:relative md:border-t-0 md:px-0 md:py-0">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto md:justify-start md:space-x-8">
        {navItems.map((item) => (
          <Button
            key={item.route}
            variant="ghost"
            className={cn(
              "flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2",
              active === item.route ? "text-primary" : "text-gray-500"
            )}
            onClick={() => setActive(item.route)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs md:text-sm">{item.name}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default MainNav;
