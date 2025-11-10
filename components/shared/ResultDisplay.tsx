import React, { useState } from 'react';
import { Card } from './Card';
import { CopyIcon, CheckIcon } from './Icon';

interface ResultDisplayProps {
  title: string;
  content: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
                onClick={handleCopy}
                className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Copy content"
            >
                {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
            </button>
        </div>
        <p className="text-text-secondary whitespace-pre-wrap bg-brand-bg p-4 rounded-md border border-border-color">{content}</p>
    </Card>
  );
};