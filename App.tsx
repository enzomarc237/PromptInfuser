
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feature } from './types';
import PromptGenerator from './components/features/PromptGenerator';
import ImageToPrompt from './components/features/ImageToPrompt';
import MockupGenerator from './components/features/MockupGenerator';
import ImageToCode from './components/features/ImageToCode';
import ProjectScaffolder from './components/features/ProjectScaffolder';
import AIGuide from './components/features/AIGuide';
import SavedPrompts from './components/features/SavedPrompts';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.PROMPT_GENERATOR);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Respect user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default to dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };


  const renderActiveFeature = () => {
    switch (activeFeature) {
      case Feature.PROMPT_GENERATOR:
        return <PromptGenerator />;
      case Feature.IMAGE_TO_PROMPT:
        return <ImageToPrompt />;
      case Feature.MOCKUP_GENERATOR:
        return <MockupGenerator />;
      case Feature.IMAGE_TO_CODE:
        return <ImageToCode />;
      case Feature.PROJECT_SCAFFOLDER:
        return <ProjectScaffolder />;
      case Feature.AI_GUIDE:
        return <AIGuide />;
      case Feature.SAVED_PROMPTS:
        return <SavedPrompts />;
      default:
        return <PromptGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-text-primary">
      <Sidebar 
        activeFeature={activeFeature} 
        onFeatureSelect={setActiveFeature} 
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {renderActiveFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;