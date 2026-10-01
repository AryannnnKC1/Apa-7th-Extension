import type { PageMetadata } from '../types/metadata';

export function generateAPACitation(metadata: PageMetadata): string {
  const { title, url } = metadata;
  const siteName = metadata.siteName?.trim();
  const author = metadata.author?.trim() || siteName || 'Unknown Author';

  // Format Date
  let dateStr = 'n.d.';
  if (metadata.publishedDate) {
    try {
      const dateObj = new Date(metadata.publishedDate);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const day = dateObj.getDate();
        dateStr = `${year}, ${month} ${day}`;
      }
    } catch (e) {
      // fallback to n.d. if parsing fails
    }
  }

  // Author. (Date). Title. SiteName. URL
  let citation = `${author}. (${dateStr}). ${title}.`;
  if (siteName) {
    citation += ` ${siteName}.`;
  }
  citation += ` ${url}`;

  return citation;
}
