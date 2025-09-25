// src/components/Projects/CaseStudy.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CaseStudy({ markdown, title = "Case Study" }: { markdown: string; title?: string }) {
    if (!markdown) return null;
    return (
        <div className="case-study">
            <h2>{title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
    );
}