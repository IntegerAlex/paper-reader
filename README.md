# Paper Reader

A PDF reader that renders documents on textured paper surfaces. Uses SVG noise filters for grain, weave, and parchment effects. No images, no network requests for textures.

## Features

- PDF rendering via pdf.js with page-fit, scrolling, text selection
- Nine procedural paper textures with dark mode support
- Bookmarks, annotations (highlights + notes)
- Sidebar with thumbnails, table of contents, search
- PWA — installable, works offline
- Keyboard shortcuts, focus mode, ink modes (sepia/warm/dark)

## Usage

```
pnpm dev
```

Open `http://localhost:3000`. Drop a PDF or click to open.

## Stack

Next.js, pdf.js, Zustand, Framer Motion, Tailwind CSS. Zero image assets — all textures are generated from SVG `<feTurbulence>` filters.
