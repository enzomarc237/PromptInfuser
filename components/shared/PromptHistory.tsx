import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { getPromptHistory, deletePromptFromHistory } from '../../utils/promptManager.ts';
import { HistoryPrompt, Feature } from '../../types';
import { CopyIcon, Trash2Icon, CheckIcon, RotateCwIcon } from './Icon';

interface PromptHistoryProps {
  features: Feature[];
  onUsePrompt?: (text: string) => void;
  refreshTrigger: any; 
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({ features, onUsePrompt, refreshTrigger }) => {
  const [history, setHistory] = useState<HistoryPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const allHistory = getPromptHistory();
    setHistory(allHistory.filter(item => features.includes(item.feature)));
  }, [features, refreshTrigger]);

  const handleDelete = (id: string) => {
    deletePromptFromHistory(id);
    setHistory(history.filter(p => p.id !== id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleUsePrompt = (text: string) => {
    if (onUsePrompt) {
        onUsePrompt(text);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Prompt History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.map(item => (
          <div key={item.id} className="bg-brand-bg border border-border-color p-3 rounded-lg text-sm">
            <div className="flex justify-between items-start space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-text-secondary whitespace-pre-wrap break-words">{item.text}</p>
                <p className="text-xs text-text-secondary/60 mt-2">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {onUsePrompt && (
                    <button
                    onClick={() => handleUsePrompt(item.text)}
                    className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                    title="Use this prompt"
                    aria-label="Use this prompt"
                    >
                    <RotateCwIcon className="w-4 h-4" />
                    </button>
                )}
                <button
                  onClick={() => handleCopy(item.id, item.text)}
                  className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                  title="Copy prompt"
                  aria-label="Copy prompt"
                >
                  {copiedId === item.id ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-red-500 transition-colors"
                  title="Delete prompt"
                  aria-label="Delete prompt"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};