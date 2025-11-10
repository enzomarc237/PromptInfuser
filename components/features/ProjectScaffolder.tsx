import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { CodeBlock } from '../shared/CodeBlock';
import { scaffoldProject } from '../../services/geminiService';
import { GeneratedFile, TechStack } from '../../types';
import { TECH_STACKS } from '../../constants';

const ProjectScaffolder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState<TechStack>(TECH_STACKS[1] as TechStack);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description) {
      setError('Please enter a project description.');
      return;
    }
    setIsLoading(true);
    setError('');
    setFiles([]);
    try {
      const result = await scaffoldProject(description, stack);
      setFiles(result);
    } catch (err) {
      setError('Failed to scaffold project. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        default:
            return 'bash';
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Project Scaffolder</h2>
          <p className="text-text-secondary">Describe your application, and Gemini will generate a complete project structure with starter code, configuration files, and documentation.</p>
          
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-text-secondary mb-1">Project Description</label>
            <textarea
              id="project-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A simple to-do list application with the ability to add and remove tasks. It should have a clean, minimalist design."
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="scaffold-stack" className="block text-sm font-medium text-text-secondary mb-1">Tech Stack</label>
            <select
              id="scaffold-stack"
              value={stack}
              onChange={(e) => setStack(e.target.value as TechStack)}
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TECH_STACKS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!description}>Scaffold Project</Button>
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {files.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Generated Project Files</h3>
          <div className="space-y-4">
            {files.map((file) => (
              <details key={file.name} className="bg-brand-bg border border-border-color rounded-lg">
                <summary className="font-mono text-sm p-3 cursor-pointer text-text-primary">{file.name}</summary>
                <div className="border-t border-border-color">
                  <CodeBlock code={file.content} language={getLanguage(file.name)} />
                </div>
              </details>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProjectScaffolder;