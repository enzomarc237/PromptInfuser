import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { generateMockup } from '../../services/geminiService';
import { MockupComponent } from '../../types';

const RenderComponent: React.FC<{ component: MockupComponent }> = ({ component }) => {
  const renderChildren = () => component.children?.map((child, index) => <RenderComponent key={index} component={child} />);

  switch (component.component) {
    case 'container':
      return <div className="p-4 space-y-4">{renderChildren()}</div>;
    case 'header':
      return <h1 className="text-2xl font-bold border-b border-border-color pb-2">{component.text}</h1>;
    case 'text':
      return <p className="text-text-secondary">{component.text}</p>;
    case 'button':
      return <button className="bg-primary text-white px-4 py-2 rounded-md">{component.text}</button>;
    case 'input':
      return <input type="text" placeholder={component.text} className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2" />;
    case 'card':
        return <div className="bg-surface/50 border border-border-color rounded-lg p-4 space-y-2">{renderChildren()}</div>
    default:
      return <div className="border border-red-500 p-2 text-red-500">Unknown component: {component.component}</div>;
  }
};


const MockupGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mockup, setMockup] = useState<MockupComponent | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description for the mockup.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMockup(null);
    try {
      const result = await generateMockup(prompt);
      setMockup(result);
    } catch (err) {
      setError('Failed to generate mockup. The generated format might be invalid. Please try again with a different prompt.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate UI Wireframe</h2>
          <p className="text-text-secondary">Describe the UI you want to build, and Gemini will generate a basic wireframe to visualize the layout and components.</p>
          
          <div>
            <label htmlFor="mockup-prompt" className="block text-sm font-medium text-text-secondary mb-1">UI Description</label>
            <textarea
              id="mockup-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A login screen for a modern social media app with a logo, email and password fields, and a login button."
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>Generate Mockup</Button>
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {mockup && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Generated Mockup</h3>
          <div className="bg-brand-bg border border-border-color rounded-lg aspect-[9/16] w-full max-w-sm mx-auto overflow-hidden">
            <RenderComponent component={mockup} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MockupGenerator;