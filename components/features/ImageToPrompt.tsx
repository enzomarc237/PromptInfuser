
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FileUpload } from '../shared/FileUpload';
import { generatePromptFromImage, fileToBase64 } from '../../services/geminiService';
import { ResultDisplay } from '../shared/ResultDisplay';
import { addPromptToHistory, savePrompt } from '../../utils/promptManager.ts';
import { Feature } from '../../types';
import { PromptHistory } from '../shared/PromptHistory';

const ImageToPrompt: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerate = async () => {
    if (!file) {
      setError('Please upload an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');
    try {
      const base64Image = await fileToBase64(file);
      const imagePart = { inlineData: { data: base64Image, mimeType: file.type } };
      const prompt = await generatePromptFromImage(imagePart);
      setGeneratedPrompt(prompt);
      addPromptToHistory(prompt, Feature.IMAGE_TO_PROMPT);
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (generatedPrompt) {
      savePrompt(generatedPrompt);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate UI Prompt from Image</h2>
          <p className="text-text-secondary">Have a design you like? Upload an image and let Gemini create a detailed prompt to help you replicate or iterate on it.</p>
          
          <FileUpload onFileSelect={setFile} />
          
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!file}>Generate Prompt</Button>
        </div>
      </Card>

      {error && <Card><p className="text-red-500">{error}</p></Card>}
      
      {generatedPrompt && (
        <ResultDisplay 
          title="Generated Prompt" 
          content={generatedPrompt}
          onSave={handleSave}
        />
      )}

      <PromptHistory
        features={[Feature.PROMPT_GENERATOR, Feature.IMAGE_TO_PROMPT]}
        refreshTrigger={refreshHistory}
      />
    </div>
  );
};

export default ImageToPrompt;