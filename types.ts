// FIX: Import React to resolve errors for React.SVGProps and JSX.Element
import React from 'react';

export enum Feature {
  PROMPT_GENERATOR = 'Prompt Generator',
  IMAGE_TO_PROMPT = 'Image to Prompt',
  MOCKUP_GENERATOR = 'Mockup Generator',
  IMAGE_TO_CODE = 'Image to Code',
  PROJECT_SCAFFOLDER = 'Project Scaffolder',
  AI_GUIDE = 'AI Guide',
  SAVED_PROMPTS = 'Saved Prompts',
}

export interface FeatureConfig {
  id: Feature;
  name: string;
  // FIX: Use React.ReactElement instead of JSX.Element to avoid issues with the global JSX namespace in .ts files.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export type TechStack = 'HTML/Tailwind' | 'React/Tailwind';

export interface GeneratedFile {
  name: string;
  content: string;
}

export interface MockupComponent {
    component: 'container' | 'header' | 'text' | 'button' | 'input' | 'card';
    text?: string;
    props?: Record<string, string>;
    children?: MockupComponent[];
}

export interface SavedPrompt {
  id: string;
  text: string;
  createdAt: string;
}
