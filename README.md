# UI Snippets

A collection of UI component snippets and design system documentation featuring multiple design styles:

- **JetBrains Style** - Based on JetBrains IDE design system with dense, functional spacing
- **Liquid Glass** - Apple's WWDC 2025 material design with frosted glass effects
- **Vercel Style** - Clean, modern component design

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
bun install
# or
npm install
```

### Development

```bash
bun dev
# or
npm run dev
```

### Build

```bash
bun run build
# or
npm run build
```

## Project Structure

```
├── docs/
│   └── styles/
│       ├── jetbrains.md      # JetBrains design system
│       ├── liquid-glass.md   # Liquid Glass material design
│       ├── vercel.md         # Vercel design system
│       └── APP_SPEC.md       # Application specifications
├── src/                      # Source code
├── public/                   # Static assets
└── scripts/                  # Build and utility scripts
```

## Design Systems

### JetBrains Style

The JetBrains style follows the design language of JetBrains IDEs (IntelliJ, PyCharm, WebStorm). Features include:
- Graphite color palette (dark grays)
- 4px/6px/8px border radius
- Dense spacing optimized for productivity
- Semantic color usage (only for code and status)

### Liquid Glass

Apple's Liquid Glass is a material design system featuring:
- Glass layers with backdrop blur
- Refracted content underneath
- Rounded edges and soft shadows
- Colorful, gradient backdrops

## License

MIT
