import React, { useState, useEffect } from 'react';
import { Card } from '../shared/Card';
import { getSavedPrompts, deletePrompt } from '../../utils/promptManager.ts';
import { SavedPrompt } from '../../types';
import { CopyIcon, Trash2Icon, CheckIcon } from '../shared/Icon';

const SavedPrompts: React.FC = () => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setPrompts(getSavedPrompts());
  }, []);

  const handleDelete = (id: string) => {
    deletePrompt(id);
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold">Saved Prompts</h2>
        <p className="text-text-secondary mt-2">
          Here are your saved prompts. You can copy them to your clipboard or delete them.
        </p>
      </Card>

      {prompts.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center">You have no saved prompts yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {prompts.map(prompt => (
            <Card key={prompt.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-text-secondary whitespace-pre-wrap">{prompt.text}</p>
                  <p className="text-xs text-text-secondary/60 mt-3">
                    Saved on: {new Date(prompt.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.text)}
                    className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Copy prompt"
                  >
                    {copiedId === prompt.id ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-red-500 transition-colors"
                    aria-label="Delete prompt"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;
