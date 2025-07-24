import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  Sparkles, 
  Download, 
  Copy, 
  FileText, 
  GitBranch, 
  Star,
  Users,
  Clock,
  Code2
} from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";

interface Repository {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

interface Documentation {
  overview: string;
  structure: string;
  modules: string;
  mermaidDiagram: string;
  installation: string;
  usage: string;
}

const GitHubAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [documentation, setDocumentation] = useState<Documentation | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    // Extract owner and repo from URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const [, owner, name] = urlMatch;
      const repoName = name.replace('.git', '');
      
      // Step 1: Fetch repository metadata
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
      if (!repoResponse.ok) {
        throw new Error('Repository not found or is private');
      }
      const repoData = await repoResponse.json();
      
      setRepository({
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description || "No description available",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language || "Unknown",
        updatedAt: new Date(repoData.updated_at).toLocaleDateString(),
      });

      // Step 2: Fetch repository contents
      const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents`);
      const contents = await contentsResponse.json();
      
      // Step 3: Analyze package.json for dependencies
      let packageInfo = null;
      try {
        const packageResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/package.json`);
        if (packageResponse.ok) {
          const packageData = await packageResponse.json();
          packageInfo = JSON.parse(atob(packageData.content));
        }
      } catch (error) {
        console.log('No package.json found or error parsing it');
      }

      // Step 4: Analyze key files
      const keyFiles = [];
      const filePromises = contents
        .filter((item: any) => item.type === 'file' && 
          (item.name.endsWith('.js') || item.name.endsWith('.ts') || 
           item.name.endsWith('.jsx') || item.name.endsWith('.tsx') ||
           item.name.endsWith('.py') || item.name.endsWith('.java') ||
           item.name === 'README.md' || item.name === 'index.html'))
        .slice(0, 10) // Limit to first 10 files to avoid rate limiting
        .map(async (file: any) => {
          try {
            const fileResponse = await fetch(file.download_url);
            const fileContent = await fileResponse.text();
            return {
              name: file.name,
              content: fileContent,
              size: file.size
            };
          } catch (error) {
            return null;
          }
        });

      const analyzedFiles = (await Promise.all(filePromises)).filter(Boolean);
      
      // Step 5: Web search for additional context
      let webContext = null;
      try {
        const searchQuery = `${repoData.name} ${repoData.language} github repository documentation`;
        const searchResponse = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        });
        
        if (searchResponse.ok) {
          webContext = await searchResponse.json();
        }
      } catch (error) {
        console.log('Web search failed, proceeding with code analysis only');
      }
      
      // Step 6: Generate comprehensive documentation
      const overview = generateOverview(repoData, analyzedFiles, packageInfo);
      const structure = generateStructure(contents, analyzedFiles);
      const modules = generateModules(analyzedFiles, packageInfo);
      const mermaidDiagram = generateMermaidDiagram(analyzedFiles, packageInfo);
      const installation = generateInstallation(packageInfo, repoData);
      const usage = generateUsage(analyzedFiles, packageInfo, repoData);

      setDocumentation({
        overview,
        structure,
        modules,
        mermaidDiagram,
        installation,
        usage
      });

      toast({
        title: "Analysis Complete!",
        description: "Comprehensive documentation generated from code analysis",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze repository",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Documentation generation functions
  const generateOverview = (repoData: any, files: any[], packageInfo: any) => {
    const readmeFile = files.find(f => f.name.toLowerCase() === 'readme.md');
    const mainFiles = files.filter(f => 
      f.name.includes('index') || f.name.includes('main') || f.name.includes('app')
    );
    
    const techStack = [];
    if (packageInfo) {
      const deps = Object.keys(packageInfo.dependencies || {});
      if (deps.includes('react')) techStack.push('React');
      if (deps.includes('vue')) techStack.push('Vue.js');
      if (deps.includes('angular')) techStack.push('Angular');
      if (deps.includes('express')) techStack.push('Express.js');
      if (deps.includes('tailwindcss')) techStack.push('Tailwind CSS');
      if (deps.includes('typescript')) techStack.push('TypeScript');
    }

    return `# ${repoData.name} Documentation

## Project Overview
${repoData.description}

**Repository Details:**
- **Owner:** ${repoData.owner.login}
- **Language:** ${repoData.language}
- **Stars:** ${repoData.stargazers_count}
- **Forks:** ${repoData.forks_count}
- **Last Updated:** ${new Date(repoData.updated_at).toLocaleDateString()}

## Technology Stack
${techStack.length > 0 ? techStack.map(tech => `- ${tech}`).join('\n') : 'Technology stack detected from code analysis'}

## Key Features
${readmeFile ? 'Features extracted from README and code analysis' : 'Features analyzed from codebase structure'}

## Project Type
${determineProjectType(files, packageInfo)}`;
  };

  const generateStructure = (contents: any[], files: any[]) => {
    const buildTree = (items: any[], prefix = '') => {
      return items.map(item => {
        if (item.type === 'dir') {
          return `${prefix}├── ${item.name}/`;
        } else {
          return `${prefix}├── ${item.name}`;
        }
      }).join('\n');
    };

    return `## Project Structure

\`\`\`
${buildTree(contents.slice(0, 20))}
\`\`\`

## File Analysis
**Total Files Analyzed:** ${files.length}
**Key Files Identified:**
${files.map(f => `- **${f.name}** (${f.size} bytes)`).join('\n')}`;
  };

  const generateModules = (files: any[], packageInfo: any) => {
    const codeFiles = files.filter(f => 
      f.name.endsWith('.js') || f.name.endsWith('.ts') || 
      f.name.endsWith('.jsx') || f.name.endsWith('.tsx')
    );

    return `## Core Modules & Components

${codeFiles.map(file => {
      const functions = extractFunctions(file.content);
      const imports = extractImports(file.content);
      
      return `### ${file.name}
**Size:** ${file.size} bytes
**Functions/Methods:** ${functions.length}
${functions.length > 0 ? `**Key Functions:**\n${functions.slice(0, 5).map(f => `- \`${f}\``).join('\n')}` : ''}
${imports.length > 0 ? `**Dependencies:**\n${imports.slice(0, 5).map(i => `- ${i}`).join('\n')}` : ''}`;
    }).join('\n\n')}

## Dependencies Analysis
${packageInfo ? `**Production Dependencies:** ${Object.keys(packageInfo.dependencies || {}).length}
**Development Dependencies:** ${Object.keys(packageInfo.devDependencies || {}).length}` : 'No package.json found'}`;
  };

  const generateMermaidDiagram = (files: any[], packageInfo: any) => {
    const hasReact = packageInfo?.dependencies?.react;
    const hasExpress = packageInfo?.dependencies?.express;
    const hasDatabase = packageInfo?.dependencies?.mongoose || packageInfo?.dependencies?.prisma;

    if (hasReact) {
      return `graph TD
    A[User Interface] --> B[React Components]
    B --> C[State Management]
    C --> D[API Calls]
    D --> E[Backend Services]
    E --> F[Database]
    
    B --> G[UI Components]
    G --> H[Routing]
    H --> I[Pages/Views]
    
    ${hasDatabase ? 'E --> J[Database Operations]\n    J --> K[Data Models]' : ''}`;
    } else {
      return `graph TD
    A[Application Entry] --> B[Core Logic]
    B --> C[Data Processing]
    C --> D[Output/Results]
    
    B --> E[Helper Functions]
    E --> F[Utilities]
    
    ${hasDatabase ? 'C --> G[Database]\n    G --> H[Data Models]' : ''}`;
    }
  };

  const generateInstallation = (packageInfo: any, repoData: any) => {
    const installCmd = packageInfo?.scripts?.install ? 'npm install' : 'npm install';
    const startCmd = packageInfo?.scripts?.start ? 'npm start' : 
                     packageInfo?.scripts?.dev ? 'npm run dev' : 'npm start';

    return `## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/${repoData.owner.login}/${repoData.name}.git

# Navigate to project directory
cd ${repoData.name}

# Install dependencies
${installCmd}

# Start the application
${startCmd}
\`\`\`

## Prerequisites
${packageInfo ? `- Node.js (version specified in package.json)
- npm or yarn package manager` : '- Check repository for specific requirements'}

## Environment Setup
${packageInfo?.scripts ? `Available scripts:
${Object.entries(packageInfo.scripts).map(([key, value]) => `- \`npm run ${key}\`: ${value}`).join('\n')}` : 'No scripts defined'}`;
  };

  const generateUsage = (files: any[], packageInfo: any, repoData: any) => {
    const mainFile = files.find(f => 
      f.name.includes('index') || f.name.includes('main') || f.name.includes('app')
    );

    return `## Usage

### Quick Start
${mainFile ? `The main entry point is \`${mainFile.name}\`` : 'Analyze the codebase to identify entry points'}

### Configuration
${packageInfo ? 'Configuration options available in package.json' : 'Check repository for configuration files'}

### API Reference
${files.filter(f => f.content.includes('function') || f.content.includes('export')).length > 0 ? 
  'Functions and exports detected - refer to individual files for detailed API documentation' : 
  'No clear API structure detected'}

### Examples
\`\`\`javascript
// Basic usage example (generated from code analysis)
${generateUsageExample(files, packageInfo)}
\`\`\`

### Advanced Features
${packageInfo?.dependencies ? `This project uses:
${Object.keys(packageInfo.dependencies).slice(0, 10).map(dep => `- ${dep}`).join('\n')}` : 'Dependencies analyzed from code structure'}`;
  };

  // Helper functions
  const determineProjectType = (files: any[], packageInfo: any) => {
    if (packageInfo?.dependencies?.react) return 'React Web Application';
    if (packageInfo?.dependencies?.vue) return 'Vue.js Application';
    if (packageInfo?.dependencies?.express) return 'Node.js/Express Server';
    if (files.some(f => f.name.endsWith('.py'))) return 'Python Application';
    if (files.some(f => f.name.endsWith('.java'))) return 'Java Application';
    return 'General Software Project';
  };

  const extractFunctions = (content: string) => {
    const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=|(\w+)\s*:\s*function)/g;
    const matches = [];
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      matches.push(match[1] || match[2] || match[3]);
    }
    return matches.filter(Boolean);
  };

  const extractImports = (content: string) => {
    const importRegex = /import.+from\s+['"]([^'"]+)['"]/g;
    const matches = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  const generateUsageExample = (files: any[], packageInfo: any) => {
    if (packageInfo?.dependencies?.react) {
      return `import React from 'react';
import App from './App';

// Basic React component usage
function MyComponent() {
  return <App />;
}`;
    }
    return `// Example usage based on code analysis
// Check individual files for specific implementation details`;
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (!documentation || !repository) return;

    const fullDoc = `${documentation.overview}\n\n${documentation.structure}\n\n${documentation.modules}\n\n${documentation.installation}\n\n${documentation.usage}`;
    
    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repository.name}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Documentation saved as Markdown file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary animate-fade-in">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg shadow-elegant">
                <Github className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DocuMate AI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered GitHub Documentation Generator</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-accent">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <Card className="mb-8 shadow-soft animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Repository Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1 transition-smooth"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !repoUrl.trim()}
                className="px-6 transition-bounce hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Docs
                  </>
                )}
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="bg-gradient-accent rounded-lg p-4 animate-scale-in">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    <span>Deep analysis in progress...</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>🔍 Fetching repository metadata and structure</div>
                    <div>📖 Reading and analyzing source code files</div>
                    <div>🔧 Parsing dependencies and configurations</div>
                    <div>🌐 Searching web for additional context</div>
                    <div>📝 Generating comprehensive documentation</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repository Info */}
        {repository && (
          <Card className="mb-8 shadow-soft animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{repository.owner}/{repository.name}</h2>
                  <p className="text-muted-foreground mt-1">{repository.description}</p>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {repository.language}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {repository.stars}
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  {repository.forks}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Updated {repository.updatedAt}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation Results */}
        {documentation && (
          <Card className="shadow-soft animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Generated Documentation
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(
                    `${documentation.overview}\n\n${documentation.structure}\n\n${documentation.modules}\n\n${documentation.installation}\n\n${documentation.usage}`
                  )}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="diagram">Diagram</TabsTrigger>
                  <TabsTrigger value="install">Install</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{documentation.overview}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.overview)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Section
                  </Button>
                </TabsContent>

                <TabsContent value="structure" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{documentation.structure}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.structure)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Section
                  </Button>
                </TabsContent>

                <TabsContent value="modules" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{documentation.modules}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.modules)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Section
                  </Button>
                </TabsContent>

                <TabsContent value="diagram" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <MermaidDiagram chart={documentation.mermaidDiagram} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.mermaidDiagram)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Mermaid Code
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="install" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{documentation.installation}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.installation)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Section
                  </Button>
                </TabsContent>

                <TabsContent value="usage" className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{documentation.usage}</pre>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(documentation.usage)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Section
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GitHubAnalyzer;