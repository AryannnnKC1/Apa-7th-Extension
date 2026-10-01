import { useState, useEffect } from 'react';
import { generateAPACitation } from '../lib/apaGenerator';
import type { PageMetadata } from '../types/metadata';

export default function Popup() {
  const [citation, setCitation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        // Send message to content script
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: 'EXTRACT_METADATA' },
          (response: PageMetadata | undefined) => {
            if (chrome.runtime.lastError) {
              setError("Could not extract metadata. Please refresh the page and try again.");
              setIsLoading(false);
              return;
            }

            if (response) {
              const generatedCitation = generateAPACitation(response);
              setCitation(generatedCitation);
            } else {
              setError("No metadata found.");
            }
            setIsLoading(false);
          }
        );
      } else {
        setError("No active tab found.");
        setIsLoading(false);
      }
    });
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full bg-white text-gray-800">
      <h1 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">
        APA 7 Citation Generator
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Extracting metadata...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4 flex-1">
            <p className="text-sm font-serif break-words">{citation}</p>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors flex items-center justify-center
              ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
                Copy Citation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
