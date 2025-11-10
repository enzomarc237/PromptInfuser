
import React from 'react';
import { Feature } from '../types';
import { FEATURES } from '../constants';

interface SidebarProps {
  activeFeature: Feature;
  onFeatureSelect: (feature: Feature) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, onFeatureSelect }) => {
  return (
    <aside className="w-64 bg-surface p-4 flex flex-col border-r border-border-color">
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
                : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }`}
          >
            <feature.icon className="w-5 h-5" />
            <span>{feature.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
