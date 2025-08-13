import React, { type JSX } from 'react';

const Footer: React.FC = (): JSX.Element => {
  return (
    
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">
          © {new Date().getFullYear()} AI Project Manager. All rights reserved.
        </div>
      </div>
    
  );
};

export default Footer;