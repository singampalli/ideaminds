// ThemeWrapper.tsx
import React, { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  return <div className="bg-gray-900">{children}</div>;
};

export default ThemeWrapper;