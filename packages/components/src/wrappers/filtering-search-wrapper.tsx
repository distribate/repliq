"use client"

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SelectedWrapper } from '#wrappers/selected-wrapper.tsx';
import { Search } from 'lucide-react';

type FilteringSearch = {
  children: ReactNode;
}

export const FilteringSearchWrapper = ({
  children
}: FilteringSearch) => {
  const [ isInputVisible, setIsInputVisible ] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  
  const handleToggle = () => {
    setIsInputVisible(!isInputVisible);
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsInputVisible(false);
    }
  };
  
  useEffect(() => {
    if (isInputVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ isInputVisible ]);
  
  return (
    <>
      <div
        className={`transition-all duration-300 overflow-hidden relative -right-[52px] ${
          isInputVisible ? 'w-48 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div ref={inputRef}>
          {children}
        </div>
      </div>
      <SelectedWrapper
        ref={buttonRef}
        onClick={handleToggle}
        className={isInputVisible ? 'z-[2]' : ''}
      >
        <Search size={20} className="text-shark-300" />
      </SelectedWrapper>
    </>
  );
};