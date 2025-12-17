import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-black/30 backdrop-blur-sm border-b border-cyan-500/30 overflow-hidden">
      {/* Background gaming pattern */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/images/header.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-lg">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SteamPay
            </h1>
            <p className="text-xs text-gray-400">Пополнение Steam</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;