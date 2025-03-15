import React from 'react';

const HighLight = ({ children }: { children: React.ReactNode }) => {
  return (
    <code className="px-1 py-0.5 bg-[#282a36]  rounded font-mono">
      {children}
    </code>
  );
};

export default HighLight;
