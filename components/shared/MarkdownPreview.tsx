import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        marked: any;
    }
}

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    const [html, setHtml] = useState('');

    useEffect(() => {
        if (window.marked) {
            setHtml(window.marked.parse(content, { gfm: true, breaks: true }));
        }
    }, [content]);

    return (
        <div
            className="prose prose-invert max-w-none text-text-secondary"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
