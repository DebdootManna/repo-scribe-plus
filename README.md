# Repo Scibe Plus - GitHub Documentation Generator

A powerful AI-driven tool that automatically generates comprehensive documentation for GitHub repositories through intelligent code analysis and structure detection.

## 🚀 Features

- **Deep Code Analysis**: Analyzes source code files to extract functions, imports, and dependencies
- **GitHub API Integration**: Fetches repository metadata, file structure, and content directly from GitHub
- **Technology Stack Detection**: Automatically identifies the project's tech stack from dependencies
- **Interactive Mermaid Diagrams**: Generates context-aware architectural diagrams
- **Comprehensive Documentation**: Creates detailed docs including overview, structure, modules, installation, and usage
- **Multiple Export Options**: Copy to clipboard or download as Markdown file
- **Real-time Analysis**: Live progress tracking with intuitive UI

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Hooks
- **API Integration**: GitHub REST API
- **Diagram Generation**: Mermaid.js
- **Routing**: React Router DOM

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone repo-scribe-plus

# Navigate to project directory
cd repo-scribe-plus

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Usage

### Basic Usage

1. **Enter Repository URL**: Paste any public GitHub repository URL into the input field
2. **Generate Documentation**: Click the "Generate Docs" button to start the analysis
3. **Review Results**: Browse through the generated documentation sections:
   - **Overview**: Project summary with tech stack and metadata
   - **Structure**: File tree and project organization
   - **Modules**: Detailed code analysis with functions and dependencies
   - **Architecture**: Interactive Mermaid diagram showing project flow
   - **Installation**: Step-by-step setup instructions
   - **Usage**: Code examples and API documentation

4. **Export Documentation**: Copy individual sections or download the complete documentation as a Markdown file

### Supported Repository Types

- React applications
- Vue.js projects
- Node.js/Express servers
- Python applications
- Java projects
- General JavaScript/TypeScript projects

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── GitHubAnalyzer.tsx  # Main analyzer component
│   └── MermaidDiagram.tsx  # Diagram rendering component
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Application pages
│   ├── Index.tsx          # Main page
│   └── NotFound.tsx       # 404 page
└── styles/
    └── index.css          # Global styles and design tokens
```

## 🎨 Design System

The project uses a sophisticated design system built with Tailwind CSS:

- **Semantic Color Tokens**: HSL-based color system for consistent theming
- **Custom Gradients**: Beautiful gradient backgrounds and accents
- **Animation System**: Smooth transitions and micro-interactions
- **Component Variants**: Extensible component styling with shadcn/ui
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## 🔍 How It Works

1. **Repository Fetching**: Uses GitHub API to retrieve repository metadata and file structure
2. **Content Analysis**: Downloads and analyzes key source files (JS, TS, Python, Java, etc.)
3. **Dependency Detection**: Parses package.json and other config files to identify tech stack
4. **Code Parsing**: Extracts functions, imports, and exports using regex patterns
5. **Documentation Generation**: Creates structured documentation based on analysis results
6. **Diagram Creation**: Generates contextual Mermaid diagrams based on detected architecture
7. **Export Options**: Provides copy and download functionality for generated content

## 🚀 Features in Detail

### Code Analysis Engine
- Extracts function definitions and method signatures
- Identifies import/export patterns
- Analyzes project dependencies
- Detects common frameworks and libraries

### Smart Documentation Generation
- Creates context-aware overview sections
- Generates installation instructions based on package manager
- Produces usage examples tailored to the technology stack
- Builds comprehensive API references

### Visual Architecture Diagrams
- Context-sensitive Mermaid diagram generation
- Supports React component flows, backend architectures, and general application structures
- Interactive diagram rendering with zoom and pan capabilities

## 🎯 Use Cases

- **Open Source Projects**: Generate documentation for public repositories
- **Code Reviews**: Quickly understand project structure and dependencies
- **Developer Onboarding**: Create comprehensive guides for new team members
- **Project Analysis**: Analyze technology choices and architectural patterns
- **Documentation Maintenance**: Keep project docs up-to-date with code changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and component patterns
- Use semantic tokens from the design system instead of hardcoded colors
- Write TypeScript for type safety
- Test components thoroughly before submitting
- Update documentation for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues & Support

If you encounter any issues or have feature requests, please [create an issue](../../issues) on GitHub.

## 🔮 Future Enhancements

- Support for private repositories with authentication
- Advanced code metrics and complexity analysis
- Multi-language documentation generation
- Integration with popular documentation platforms
- Batch processing for multiple repositories
- Custom documentation templates
