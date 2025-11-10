
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FileUpload } from '../shared/FileUpload';
import { CodeBlock } from '../shared/CodeBlock';
import { generateCodeFromImage, fileToBase64 } from '../../services/geminiService';
import { TechStack } from '../../types';
import { TECH_STACKS } from '../../constants';

const ImageToCode: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState('');
  const [stack, setStack] = useState<TechStack>(TECH_STACKS[0] as TechStack);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!file) {
      setError('Please upload an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedCode('');
    try {
        const base64Image = await fileToBase64(file);
        const imagePart = { inlineData: { data: base64Image, mimeType: file.type } };
        const code = await generateCodeFromImage(imagePart, instructions, stack);
        setGeneratedCode(code);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Code from UI Image</h2>
          <p className="text-text-secondary">Upload a UI design image, provide instructions, and let Gemini generate the code for you.</p>
          
          <FileUpload onFileSelect={setFile} />
          
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-text-secondary mb-1">Instructions (Optional)</label>
            <textarea
              id="instructions"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Make the primary button purple. The form should handle submissions."
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="tech-stack" className="block text-sm font-medium text-text-secondary mb-1">Tech Stack</label>
            <select
              id="tech-stack"
              value={stack}
              onChange={(e) => setStack(e.target.value as TechStack)}
              className="w-full bg-brand-bg border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TECH_STACKS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!file}>Generate Code</Button>
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {generatedCode && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Generated Code</h3>
          <CodeBlock code={generatedCode} language={stack.startsWith('React') ? 'jsx' : 'html'} />
        </Card>
      )}
    </div>
  );
};

export default ImageToCode;
