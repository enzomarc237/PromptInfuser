import { SavedPrompt, HistoryPrompt, Feature } from '../types';

const PROMPTS_KEY = 'savedUIPrompts';
const HISTORY_KEY = 'promptHistory';

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

export const getPromptHistory = (): HistoryPrompt[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to parse prompt history from localStorage', error);
    return [];
  }
};

export const addPromptToHistory = (text: string, feature: Feature): void => {
  if (!text) return;
  const history = getPromptHistory();
  const newHistoryItem: HistoryPrompt = {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
    feature,
  };
  // Limit history to the last 50 prompts
  const updatedHistory = [newHistoryItem, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const deletePromptFromHistory = (id: string): void => {
  const history = getPromptHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};