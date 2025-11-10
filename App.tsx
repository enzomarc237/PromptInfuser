
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feature } from './types';
import PromptGenerator from './components/features/PromptGenerator';
import ImageToPrompt from './components/features/ImageToPrompt';
import MockupGenerator from './components/features/MockupGenerator';
import ImageToCode from './components/features/ImageToCode';
import ProjectScaffolder from './components/features/ProjectScaffolder';
import AIGuide from './components/features/AIGuide';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.PROMPT_GENERATOR);

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
      default:
        return <PromptGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-text-primary">
      <Sidebar activeFeature={activeFeature} onFeatureSelect={setActiveFeature} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {renderActiveFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;
