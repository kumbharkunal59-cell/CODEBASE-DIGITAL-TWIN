import { useEffect, useState } from "react";
import { ArchitectureGraph as GraphData, GraphNode } from "./types";
import { api } from "./api/client";
import TopBar from "./components/TopBar";
import Sidebar, { View } from "./components/Sidebar";
import ArchitectureGraph from "./components/ArchitectureGraph";
import DetailPanel from "./components/DetailPanel";
import RiskBoard from "./pages/RiskBoard";
import OwnershipOverview from "./pages/OwnershipOverview";
import AIAssistantChat from "./components/AIAssistantChat";

export default function App() {
  const [view, setView] = useState<View>("graph");
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedId, setSelectedId] = useState<string | undefined>();

  useEffect(() => {
    api.getGraph().then(setGraph);
  }, []);

  const selectedNode: GraphNode | undefined = graph.nodes.find((n) => n.id === selectedId);

  const goToGraph = (id: string) => {
    setSelectedId(id);
    setView("graph");
  };

  return (
    <div className="flex h-screen flex-col">
      <TopBar nodeCount={graph.nodes.length} edgeCount={graph.edges.length} />
      <div className="flex min-h-0 flex-1">
        <Sidebar view={view} onChange={setView} />

        <main className="min-w-0 flex-1">
          {view === "graph" && (
            <ArchitectureGraph graph={graph} selectedId={selectedId} onSelect={setSelectedId} />
          )}
          {view === "risk" && <RiskBoard nodes={graph.nodes} onSelect={goToGraph} />}
          {view === "ownership" && <OwnershipOverview onSelect={goToGraph} />}
          {view === "assistant" && (
            <div className="mx-auto h-full max-w-2xl p-6">
              <AIAssistantChat />
            </div>
          )}
        </main>

        {view === "graph" && selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedId(undefined)} />
        )}
      </div>
    </div>
  );
}
