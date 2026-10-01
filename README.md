# APA 7 Citation Generator Extension

A Chrome Extension built with React, Vite, TypeScript, and Tailwind CSS that generates APA 7th Edition citations for the currently open webpage.

## Project Structure
- `src/popup`: React popup UI.
- `src/content`: Content script for metadata extraction.
- `src/background`: Background service worker.
- `src/lib`: Citation generator utility logic.
- `src/types`: TypeScript types.
- `public`: Manifest V3 configuration.

## Setup and Build Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```
   This command compiles TypeScript, builds the React popup, and generates the `dist/` directory.

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked".
   - Select the `dist/` folder from this project directory.

## Core Features
- Extracts page metadata (Title, Author, Date, Site Name).
- Formats correctly into APA 7th Edition.
- Simple, modern popup UI built with Tailwind CSS.
- 1-click clipboard copy functionality.
