import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { AI_DESIGN_TOOLS } from '../../constants';
import { getAIGuide } from '../../services/geminiService';
import { MarkdownPreview } from '../shared/MarkdownPreview';
import { CheckIcon, CopyIcon } from '../shared/Icon';

const AIGuide: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>(AI_DESIGN_TOOLS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isMarkdownCopied, setIsMarkdownCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setGuide('');
    setSources([]);
    try {
      const result = await getAIGuide(selectedTool);
      setGuide(result.text);
      setSources(result.sources);
    } catch (err) {
      setError('Failed to generate guide. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyMarkdown = () => {
    if (!guide) return;
    navigator.clipboard.writeText(guide);
    setIsMarkdownCopied(true);
    setTimeout(() => setIsMarkdownCopied(false), 2000);
  };


  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Design & Prompting Guides</h2>
          <p className="text-text-secondary">Select an AI tool to get up-to-date guides and best practices for writing effective UI design prompts, powered by Google Search.</p>
          
          <div>
            <label htmlFor="ai-tool" className="block text-sm font-medium text-text-secondary mb-1">AI Design Tool</label>
            <select
              id="ai-tool"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {AI_DESIGN_TOOLS.map(tool => <option key={tool} value={tool}>{tool}</option>)}
            </select>
          </div>
          
          <Button onClick={handleGenerate} isLoading={isLoading}>Get Guide</Button>
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {guide && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Guide for {selectedTool}</h3>
             <button
                onClick={handleCopyMarkdown}
                className="p-1.5 bg-surface rounded-md text-text-secondary hover:text-text-primary transition-colors flex items-center space-x-2 text-xs"
                aria-label="Copy Markdown"
            >
                {isMarkdownCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                <span>Copy Markdown</span>
            </button>
          </div>
          <MarkdownPreview content={guide} />
           {sources.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-text-primary">Sources:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {sources.map((source, index) => source.web && (
                  <li key={index}>
                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {source.web.title || source.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIGuide;