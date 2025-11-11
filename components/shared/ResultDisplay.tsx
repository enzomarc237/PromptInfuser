import React, { useState } from 'react';
import { Card } from './Card';
import { CopyIcon, CheckIcon, BookmarkIcon } from './Icon';

interface ResultDisplayProps {
  title: string;
  content: string;
  onSave?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSave) {
        onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center space-x-2">
                {onSave && (
                    <button
                        onClick={handleSave}
                        className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                        aria-label="Save content"
                    >
                        {saved ? <CheckIcon className="w-4 h-4 text-green-500" /> : <BookmarkIcon className="w-4 h-4" />}
                    </button>
                )}
                <button
                    onClick={handleCopy}
                    className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Copy content"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                </button>
            </div>
        </div>
        <p className="text-text-secondary whitespace-pre-wrap bg-brand-bg p-4 rounded-md border border-border-color">{content}</p>
    </Card>
  );
};
