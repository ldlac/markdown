# Markdown Editor

A clean, minimal markdown editor with live preview built with Vite and vanilla JavaScript.

## Features

- **Split pane layout** - Editor on the left, live preview on the right
- **Live preview** - See your markdown rendered in real-time
- **Syntax highlighting** - Code blocks are highlighted with highlight.js
- **Auto-save** - Content is automatically saved to localStorage
- **Export to PDF** - Download your document as a PDF
- **Responsive** - Works on desktop and mobile

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Keyboard Shortcuts

- **Tab** - Insert 2-space indentation

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [marked](https://marked.js.org/) - Markdown parser
- [highlight.js](https://highlightjs.org/) - Syntax highlighting
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - PDF export
