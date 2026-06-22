"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { StoryBeatNode, type StoryBeatNodeData } from "./StoryBeatNode";
import { useColorMode } from "@/app/hooks/useColorMode";
import type { CampaignBeatsResponse, BeatForGraph } from "@/app/types/graph";
import { StoryBeatActionPanel } from "./StoryBeatActionPanel";

const nodeTypes = {
  storyBeat: StoryBeatNode,
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 70;

function buildNodes(
  beats: BeatForGraph[],
  errorBeatIds: Set<string>,
  selectedBeatId: string | null,
): Node<StoryBeatNodeData>[] {
  return beats.map((beat) => ({
    id: beat.id,
    type: "storyBeat",
    position: { x: 0, y: 0 },
    data: {
      title: beat.title,
      beatType: beat.beatType,
      state: beat.state,
      hasError: errorBeatIds.has(beat.id),
      isSelected: beat.id === selectedBeatId,
    },
  }));
}

function buildEdges(beats: BeatForGraph[]): Edge[] {
  const beatById = new Map(beats.map((beat) => [beat.id, beat]));

  return beats.flatMap((beat) =>
    beat.outgoingTransitions.map((transition) => {
      const sourceBeat = beatById.get(transition.fromBeatId);
      const targetBeat = beatById.get(transition.toBeatId);

      let style: Edge["style"];

      if (targetBeat?.state === "current") {
        style = { strokeWidth: 3, stroke: "var(--accent)", opacity: 1 };
      } else if (targetBeat?.state === "completed") {
        style = { strokeWidth: 2, stroke: "#4ade80", opacity: 0.9 };
      } else if (sourceBeat?.state === "current") {
        style = {
          strokeDasharray: "4 4",
          stroke: "var(--accent)",
          opacity: transition.isHidden ? 0.4 : 0.6,
        };
      } else {
        style = {
          strokeDasharray: "4 4",
          opacity: transition.isHidden ? 0.1 : 0.18,
        };
      }

      return {
        id: transition.id,
        source: transition.fromBeatId,
        target: transition.toBeatId,
        type: "smoothstep",
        label: transition.isHidden ? "???" : transition.transitionType,
        labelStyle: {
          fill: "var(--foreground)",
          fontSize: 10,
          fontWeight: 600,
        },
        labelBgStyle: { fill: "var(--card-bg)", fillOpacity: 0.9 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
        style,
      };
    }),
  );
}

function applyDagreLayout(
  nodes: Node<StoryBeatNodeData>[],
  edges: Edge[],
  beats: BeatForGraph[],
): Node<StoryBeatNodeData>[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const positioned = nodes.map((node) => {
    const positionFromDagre = graph.node(node.id);
    return {
      ...node,
      position: {
        x: positionFromDagre.x - NODE_WIDTH / 2,
        y: positionFromDagre.y - NODE_HEIGHT / 2,
      },
    };
  });

  return offsetSideQuestLanes(positioned, beats);
}

const SIDE_QUEST_LANE_OFFSET = 400;

function offsetSideQuestLanes(
  nodes: Node<StoryBeatNodeData>[],
  beats: BeatForGraph[],
): Node<StoryBeatNodeData>[] {
  const beatById = new Map(beats.map((beat) => [beat.id, beat]));

  // Build adjacency from side-quest beats to their side-quest neighbors only,
  // so we can group connected side-quest chains into the same "lane."
  const sideQuestNeighbors = new Map<string, string[]>();

  beats.forEach((beat) => {
    if (beat.beatType !== "SIDE_QUEST") return;

    const neighbors: string[] = [];

    beat.outgoingTransitions.forEach((t) => {
      if (beatById.get(t.toBeatId)?.beatType === "SIDE_QUEST") {
        neighbors.push(t.toBeatId);
      }
    });

    beat.incomingTransitions.forEach((t) => {
      if (beatById.get(t.fromBeatId)?.beatType === "SIDE_QUEST") {
        neighbors.push(t.fromBeatId);
      }
    });

    sideQuestNeighbors.set(beat.id, neighbors);
  });

  // Group connected side-quest beats into lanes via simple connected-components search
  const visited = new Set<string>();
  const lanes: string[][] = [];

  sideQuestNeighbors.forEach((_, beatId) => {
    if (visited.has(beatId)) return;

    const lane: string[] = [];
    const stack = [beatId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      lane.push(current);

      const neighbors = sideQuestNeighbors.get(current) ?? [];
      neighbors.forEach((neighbor) => stack.push(neighbor));
    }

    lanes.push(lane);
  });

  const laneOffsetByBeatId = new Map<string, number>();
  lanes.forEach((lane, laneIndex) => {
    const offset = SIDE_QUEST_LANE_OFFSET * (laneIndex + 1);
    lane.forEach((beatId) => laneOffsetByBeatId.set(beatId, offset));
  });

  return nodes.map((node) => {
    const offset = laneOffsetByBeatId.get(node.id);
    if (offset === undefined) return node;

    return {
      ...node,
      position: {
        x: node.position.x + offset,
        y: node.position.y,
      },
    };
  });
}

type StoryBeatGraphProps = {
  campaignId: string;
};

function StoryBeatGraphInner({ campaignId }: StoryBeatGraphProps) {
  const [beats, setBeats] = useState<BeatForGraph[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeatId, setSelectedBeatId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorBeatIds, setErrorBeatIds] = useState<Set<string>>(new Set());
  const colorMode = useColorMode();

  useEffect(() => {
    let isCancelled = false;

    async function loadBeats() {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/beats`);

        if (!response.ok) {
          throw new Error("Failed to load story beats");
        }

        const data: CampaignBeatsResponse = await response.json();

        if (!isCancelled) {
          setBeats(data.beats);
        }
      } catch {
        if (!isCancelled) {
          setError("Could not load the story beat graph.");
        }
      }
    }

    loadBeats();

    return () => {
      isCancelled = true;
    };
  }, [campaignId]);

  const handleSelect = useCallback((beatId: string) => {
    setSelectedBeatId((current) =>
      current === beatId ? null : beatId
    );
  }, []);

  const handleToggleComplete = useCallback(
    async (beatId: string) => {
      const previousBeats = beats;
      if (!previousBeats) return;

      const targetBeat = previousBeats.find(
        (beat) => beat.id === beatId
      );

      if (!targetBeat) return;

      const isCurrentlyComplete =
        targetBeat.completedAt !== null;

      const optimisticBeats = previousBeats.map((beat) =>
        beat.id === beatId
          ? {
              ...beat,
              completedAt: isCurrentlyComplete
                ? null
                : new Date().toISOString(),
            }
          : beat
      );

      setBeats(optimisticBeats);
      setIsUpdating(true);

      setErrorBeatIds((prev) => {
        const next = new Set(prev);
        next.delete(beatId);
        return next;
      });

      try {
        const response = await fetch(
          `/api/beats/${beatId}/complete`,
          {
            method: "PATCH",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update beat");
        }

        const refreshed = await fetch(
          `/api/campaigns/${campaignId}/beats`
        );

        if (!refreshed.ok) {
          throw new Error("Failed to refresh graph");
        }

        const data: CampaignBeatsResponse =
          await refreshed.json();

        setBeats(data.beats);
      } catch {
        setBeats(previousBeats);

        setErrorBeatIds(
          (prev) => new Set(prev).add(beatId)
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [beats, campaignId]
  );

  const selectedBeat = useMemo(() => {
    if (!beats || !selectedBeatId) {
      return null;
    }

    return (
      beats.find((beat) => beat.id === selectedBeatId) ??
      null
    );
  }, [beats, selectedBeatId]);

  const { nodes, edges } = useMemo(() => {
    if (!beats) return { nodes: [], edges: [] };

    const rawNodes = buildNodes(beats, errorBeatIds, selectedBeatId);
    const builtEdges = buildEdges(beats);
    const layoutedNodes = applyDagreLayout(rawNodes, builtEdges, beats);

    return { nodes: layoutedNodes, edges: builtEdges };
  }, [beats, errorBeatIds, selectedBeatId]);

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (!beats) {
    return <p className="text-muted text-sm">Loading story beat graph...</p>;
  }

  return (
    <>
    {selectedBeat && (
        <div className="mt-3">
          <StoryBeatActionPanel
            beat={selectedBeat}
            onToggleComplete={handleToggleComplete}
            onClose={() => setSelectedBeatId(null)}
            isUpdating={isUpdating}
          />
        </div>
      )}
      <div
        style={{ height: 600, backgroundColor: "var(--card-bg)" }}
        className="rounded-xl border border-accent/20"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          colorMode={colorMode}
          onNodeClick={(_event, node) => handleSelect(node.id)}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      
    </>
  );
}

export function StoryBeatGraph({ campaignId }: StoryBeatGraphProps) {
  return (
    <ReactFlowProvider>
      <StoryBeatGraphInner campaignId={campaignId} />
    </ReactFlowProvider>
  );
}
