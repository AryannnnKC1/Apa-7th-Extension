import type { PageMetadata } from '../types/metadata';

function getMetaContent(selector: string): string | null {
  const element = document.querySelector(selector) as HTMLMetaElement;
  return element ? element.content.trim() : null;
}

function extractMetadata(): PageMetadata {
  const title = 
    getMetaContent('meta[property="og:title"]') || 
    document.title || 
    'Untitled Webpage';

  const author = 
    getMetaContent('meta[name="author"]') || 
    getMetaContent('meta[property="article:author"]') || 
    null;

  const publishedDate = 
    getMetaContent('meta[property="article:published_time"]') || 
    getMetaContent('meta[name="date"]') || 
    getMetaContent('meta[name="pubdate"]') || 
    null;

  const siteName = 
    getMetaContent('meta[property="og:site_name"]') || 
    null;

  return {
    title,
    author,
    publishedDate,
    siteName,
    url: window.location.href,
  };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  if (request.action === 'EXTRACT_METADATA') {
    const metadata = extractMetadata();
    sendResponse(metadata);
  }
  return true;
});
