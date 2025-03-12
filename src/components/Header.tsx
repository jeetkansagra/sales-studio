
import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-6 px-4 sm:px-6 backdrop-blur-md bg-white/70 border-b border-slate-200/80 sticky top-0 z-10",
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2" />
              <path d="M19 11V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
              <path d="M13 5V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
              <path d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
            </svg>
          </div>
          <span className="font-medium text-lg tracking-tight">Coupon Guru</span>
        </div>
        <nav className="hidden sm:block">
          <ul className="flex items-center space-x-8">
            <li>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
