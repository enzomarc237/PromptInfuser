
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FileUpload } from '../shared/FileUpload';
import { generatePromptFromImage, fileToBase64 } from '../../services/geminiService';

const ImageToPrompt: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');

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
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
        <Card>
          <h3 className="text-lg font-semibold mb-4">Generated Prompt</h3>
          <p className="text-text-secondary whitespace-pre-wrap">{generatedPrompt}</p>
        </Card>
      )}
    </div>
  );
};

export default ImageToPrompt;
