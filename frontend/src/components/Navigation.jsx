import React from "react";
import { Home, ShoppingCart, User, Trophy } from "lucide-react";

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: "game", label: "Farm", icon: Home },
    { id: "shop", label: "Shop", icon: ShoppingCart },
    { id: "profile", label: "Profile", icon: User },
    { id: "leaderboard", label: "Ranks", icon: Trophy }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-green-100 text-green-600 scale-105" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IconComponent size={20} className={isActive ? "mb-1" : "mb-1"} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;