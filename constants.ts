
import { Feature, FeatureConfig } from './types';
import { SparklesIcon, ImageIcon, LayoutTemplateIcon, CodeIcon, FolderGit2Icon, BookOpenIcon } from './components/shared/Icon';

export const FEATURES: FeatureConfig[] = [
  { id: Feature.PROMPT_GENERATOR, name: 'Prompt Generator', icon: SparklesIcon },
  { id: Feature.IMAGE_TO_PROMPT, name: 'Image to Prompt', icon: ImageIcon },
  { id: Feature.MOCKUP_GENERATOR, name: 'Mockup Generator', icon: LayoutTemplateIcon },
  { id: Feature.IMAGE_TO_CODE, name: 'Image to Code', icon: CodeIcon },
  { id: Feature.PROJECT_SCAFFOLDER, name: 'Project Scaffolder', icon: FolderGit2Icon },
  { id: Feature.AI_GUIDE, name: 'AI Guide', icon: BookOpenIcon },
];

export const TECH_STACKS = ['HTML/Tailwind', 'React/Tailwind'];

export const AI_DESIGN_TOOLS = ['General LLM', 'Midjourney', 'DALL-E 3', 'Stable Diffusion'];

export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-2.5-pro',
};
