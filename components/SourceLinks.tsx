import React from 'react';
import { GroundingChunk } from '../types';

interface SourceLinksProps {
  chunks: GroundingChunk[];
}

export const SourceLinks: React.FC<SourceLinksProps> = ({ chunks }) => {
  // Deduplicate links based on URI
  const uniqueChunks = chunks.reduce((acc, current) => {
    if (current.web && !acc.find(item => item.web?.uri === current.web?.uri)) {
      acc.push(current);
    }
    return acc;
  }, [] as GroundingChunk[]);

  if (uniqueChunks.length === 0) return null;

  const getHostname = (uri: string) => {
    try {
      return new URL(uri).hostname.replace('www.', '');
    } catch (e) {
      return 'External Source';
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Sources Verified by Google Search
      </h3>
      <div className="flex flex-wrap gap-2">
        {uniqueChunks.map((chunk, index) => {
          if (!chunk.web || !chunk.web.uri) return null;
          
          return (
            <a
              key={index}
              href={chunk.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors truncate max-w-[200px]"
            >
              <span className="truncate">{chunk.web.title || getHostname(chunk.web.uri)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
};