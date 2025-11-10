
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { AI_DESIGN_TOOLS } from '../../constants';
import { getAIGuide } from '../../services/geminiService';

const AIGuide: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>(AI_DESIGN_TOOLS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

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
          <h3 className="text-lg font-semibold mb-4">Guide for {selectedTool}</h3>
          <div className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap">{guide}</div>
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
