'use client';

import React, { createContext, useState, ReactNode } from 'react';

type WaitlistContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const WaitlistContext = createContext<WaitlistContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {},
});

type WaitlistProviderProps = {
  children: ReactNode;
};

export const WaitlistProvider = ({ children }: WaitlistProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <WaitlistContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </WaitlistContext.Provider>
  );
}; 