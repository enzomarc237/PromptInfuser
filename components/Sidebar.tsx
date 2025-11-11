
import React from 'react';
import { Feature } from '../types';
import { FEATURES } from '../constants';
import { MoonIcon, SunIcon } from './shared/Icon';

interface SidebarProps {
  activeFeature: Feature;
  onFeatureSelect: (feature: Feature) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, onFeatureSelect, theme, onToggleTheme }) => {
  return (
    <aside className="w-64 bg-surface p-4 flex flex-col border-r border-border-color transition-colors duration-300">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">PromptInfuser <span className="text-primary">AI</span></h1>
          <p className="text-xs text-text-secondary">UI Design Assistant</p>
        </div>
        <nav className="flex flex-col space-y-2">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className={`flex items-center space-x-3 p-2 rounded-lg text-sm text-left transition-colors duration-200
                ${activeFeature === feature.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary'
                }`}
            >
              <feature.icon className="w-5 h-5" />
              <span>{feature.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-border-color">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center space-x-3 p-2 rounded-lg text-sm text-left transition-colors duration-200 text-text-secondary hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
      </div>
    </aside>
  );
};