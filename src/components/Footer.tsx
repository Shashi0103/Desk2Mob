import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 py-6 text-center">
      <div className="border-t border-white/20 pt-6">
        <p className="text-white/80 text-sm font-medium">
          © {currentYear} Desk2Mob Share. All rights reserved.
        </p>
        <p className="text-white/80 text-sm mt-2">
          Made with ❤️ in India | Created by - Shashi Kumar
        </p>
      </div>
    </footer>
  );
};