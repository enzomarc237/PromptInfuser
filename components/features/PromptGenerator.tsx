
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { generateUIPrompt, refineUIPrompt } from '../../services/geminiService';
import { ResultDisplay } from '../shared/ResultDisplay';
import { addPromptToHistory, savePrompt } from '../../utils/promptManager.ts';
import { Feature } from '../../types';
import { PromptHistory } from '../shared/PromptHistory';

const PromptGenerator: React.FC = () => {
  const [task, setTask] = useState('');
  const [existingPrompt, setExistingPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'refine'>('generate');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const prompt = await generateUIPrompt(task);
      setResult(prompt);
      addPromptToHistory(prompt, Feature.PROMPT_GENERATOR);
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    try {
        const prompt = await refineUIPrompt(existingPrompt);
        setResult(prompt);
        addPromptToHistory(prompt, Feature.PROMPT_GENERATOR);
        setRefreshHistory(prev => prev + 1);
    } catch (err) {
        setError('Failed to refine prompt. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      savePrompt(result);
    }
  };

  const handleUsePromptFromHistory = (text: string) => {
    setExistingPrompt(text);
    setActiveTab('refine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">UI Prompt Engineering</h2>
            <p className="text-text-secondary">Generate a brand new, detailed UI prompt from a simple idea, or refine an existing prompt to make it more effective.</p>

            <div className="flex border-b border-border-color">
                <button onClick={() => setActiveTab('generate')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'generate' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>Generate</button>
                <button onClick={() => setActiveTab('refine')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'refine' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>Refine</button>
            </div>
            
            {activeTab === 'generate' && (
                <div className="space-y-4 pt-4">
                    <label htmlFor="task-description" className="block text-sm font-medium text-text-secondary">Describe the UI you want to design:</label>
                    <textarea
                    id="task-description"
                    rows={3}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="e.g., A settings page for a mobile music app"
                    className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading} disabled={!task}>Generate Prompt</Button>
                </div>
            )}

            {activeTab === 'refine' && (
                <div className="space-y-4 pt-4">
                     <label htmlFor="existing-prompt" className="block text-sm font-medium text-text-secondary">Paste your existing prompt:</label>
                    <textarea
                    id="existing-prompt"
                    rows={5}
                    value={existingPrompt}
                    onChange={(e) => setExistingPrompt(e.target.value)}
                    placeholder="e.g., Make a login screen"
                    className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleRefine} isLoading={isLoading} disabled={!existingPrompt}>Refine Prompt</Button>
                </div>
            )}
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {result && (
        <ResultDisplay 
            title="Result" 
            content={result}
            onSave={handleSave} 
        />
      )}

      <PromptHistory 
        features={[Feature.PROMPT_GENERATOR, Feature.IMAGE_TO_PROMPT]}
        onUsePrompt={handleUsePromptFromHistory}
        refreshTrigger={refreshHistory}
      />
    </div>
  );
};

export default PromptGenerator;