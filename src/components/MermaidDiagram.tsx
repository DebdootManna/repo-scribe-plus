import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

const MermaidDiagram = ({ chart, id = "mermaid-diagram" }: MermaidDiagramProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#10b981",
        primaryTextColor: "#f9fafb",
        primaryBorderColor: "#10b981",
        lineColor: "#6b7280",
        secondaryColor: "#374151",
        tertiaryColor: "#1f2937",
        background: "#111827",
        mainBkg: "#1f2937",
        secondBkg: "#374151",
        tertiaryBkg: "#4b5563",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "cardinal",
      },
    });
  }, []);

  useEffect(() => {
    if (mermaidRef.current && chart) {
      const renderDiagram = async () => {
        try {
          mermaidRef.current!.innerHTML = "";
          const uniqueId = `${id}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, chart);
          mermaidRef.current!.innerHTML = svg;
        } catch (error) {
          console.error("Error rendering Mermaid diagram:", error);
          mermaidRef.current!.innerHTML = `
            <div class="text-center text-muted-foreground p-8">
              <p>Error rendering diagram</p>
              <p class="text-sm mt-2">Please check the Mermaid syntax</p>
            </div>
          `;
        }
      };

      renderDiagram();
    }
  }, [chart, id]);

  return (
    <div className="w-full overflow-auto">
      <div 
        ref={mermaidRef} 
        className="flex justify-center items-center min-h-[300px] w-full"
      />
    </div>
  );
};

export default MermaidDiagram;