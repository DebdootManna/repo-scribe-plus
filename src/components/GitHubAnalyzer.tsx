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
    
    // Simulate analysis process
    setTimeout(() => {
      const [, owner, name] = urlMatch;
      
      // Mock repository data
      setRepository({
        name: name.replace('.git', ''),
        owner,
        description: "AI-powered documentation generator for GitHub repositories",
        stars: 1247,
        forks: 89,
        language: "TypeScript",
        updatedAt: "2024-01-15",
      });

      // Mock generated documentation
      setDocumentation({
        overview: `# ${name.replace('.git', '')} Documentation

This repository contains a modern web application that automatically generates comprehensive documentation for GitHub repositories using AI technology.

## Key Features
- AI-powered code analysis
- Automatic documentation generation
- Mermaid.js diagram creation
- Export to multiple formats
- GitHub Wiki integration`,
        
        structure: `## Project Structure

\`\`\`
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── GitHubAnalyzer.tsx
│   │   └── MermaidDiagram.tsx
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── public/
└── README.md
\`\`\``,

        modules: `## Core Modules

### GitHubAnalyzer
Main component responsible for repository analysis and documentation generation.

**Key Functions:**
- \`handleAnalyze()\` - Processes GitHub repository URLs
- \`generateDocumentation()\` - Creates AI-powered documentation
- \`exportDocs()\` - Handles document export functionality

### MermaidDiagram
Component for rendering interactive Mermaid.js diagrams.

**Features:**
- Real-time diagram rendering
- Multiple diagram types support
- Export to SVG/PNG formats`,

        mermaidDiagram: `graph TD
    A[GitHub Repository URL] --> B[Repository Analysis]
    B --> C[Code Structure Parsing]
    C --> D[AI Documentation Generation]
    D --> E[Mermaid Diagram Creation]
    E --> F[Documentation Preview]
    F --> G[Export Options]
    G --> H[GitHub Wiki Integration]
    
    B --> I[Repository Metadata]
    I --> J[Language Detection]
    J --> K[Dependency Analysis]
    K --> D`,

        installation: `## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/${owner}/${name.replace('.git', '')}.git

# Navigate to project directory
cd ${name.replace('.git', '')}

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\``,

        usage: `## Usage

1. **Enter Repository URL**: Paste any public GitHub repository URL
2. **Analyze**: Click the "Generate Documentation" button
3. **Review**: Browse through generated documentation sections
4. **Export**: Download as Markdown files or push to GitHub Wiki
5. **Customize**: Edit generated content as needed

### API Integration

\`\`\`typescript
const analyzeRepository = async (url: string) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repositoryUrl: url })
  });
  return response.json();
};
\`\`\``
      });

      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete!",
        description: "Documentation has been generated successfully",
      });
    }, 3000);
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
                <div className="flex items-center gap-3 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  <span>Analyzing repository structure and generating documentation...</span>
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