import { SavedPrompt } from '../types';

const PROMPTS_KEY = 'savedUIPrompts';

export const getSavedPrompts = (): SavedPrompt[] => {
  try {
    const promptsJson = localStorage.getItem(PROMPTS_KEY);
    return promptsJson ? JSON.parse(promptsJson) : [];
  } catch (error) {
    console.error('Failed to parse saved prompts from localStorage', error);
    return [];
  }
};

export const savePrompt = (text: string): void => {
  const prompts = getSavedPrompts();
  const newPrompt: SavedPrompt = {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };
  const updatedPrompts = [newPrompt, ...prompts];
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(updatedPrompts));
};

export const deletePrompt = (id: string): void => {
  const prompts = getSavedPrompts();
  const updatedPrompts = prompts.filter(prompt => prompt.id !== id);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(updatedPrompts));
};
