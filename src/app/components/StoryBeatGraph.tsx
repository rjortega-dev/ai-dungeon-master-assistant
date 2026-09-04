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
import { flushSync } from "react-dom";
import { GraphLegend } from "./GraphLegend";
import { StoryBeatEdge } from "./StoryBeatEdge";
import { computeBeatState, computeForeclosedSet } from "@/lib/beat-graph-state";

const nodeTypes = {
  storyBeat: StoryBeatNode,
};

const edgeTypes = {
  storyBeatEdge: StoryBeatEdge,
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

const TRANSITION_COLORS: Record<string, string> = {
  SUCCESS: "var(--edge-success)",
  FAILURE: "var(--edge-failure)",
  OPTIONAL: "var(--edge-optional)",
  SECRET: "var(--edge-secret)",
  COMBAT_WIN: "var(--edge-combat-win)",
  COMBAT_LOSS: "var(--edge-combat-loss)",
  ACCEPT: "var(--edge-accept)",
  REJECT: "var(--edge-reject)",
};

function buildEdges(beats: BeatForGraph[]): Edge[] {
  return beats.flatMap((beat) =>
    beat.outgoingTransitions.map((transition) => {
      const color =
        TRANSITION_COLORS[transition.transitionType] ?? "var(--edge-optional)";
      const isDimmed = beat.state === "default" || beat.state === "foreclosed";

      return {
        id: transition.id,
        source: transition.fromBeatId,
        target: transition.toBeatId,
        type: "storyBeatEdge",
        data: {
          transitionType: transition.transitionType,
          conditionDescription: transition.conditionDescription,
          isHidden: transition.isHidden,
          color,
          isDimmed,
        },
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
  const [actionError, setActionError] = useState<string | null>(null);
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
    setActionError(null);
    setErrorBeatIds((prev) => {
      if (!prev.has(beatId)) return prev;
      const next = new Set(prev);
      next.delete(beatId);
      return next;
    });
    setSelectedBeatId((current) => (current === beatId ? null : beatId));
  }, []);

  const refetchBeats = useCallback(async () => {
    const refreshed = await fetch(`/api/campaigns/${campaignId}/beats`);
    if (!refreshed.ok) throw new Error("Failed to refresh graph");
    const data: CampaignBeatsResponse = await refreshed.json();
    setBeats(data.beats);
  }, [campaignId]);

  // Shared plumbing for the three actions that CAN be optimistic (complete,
  // uncomplete, set-active): apply a local snapshot immediately, fire the
  // request, refetch on success to reconcile, roll back and surface the
  // server's error reason on failure.
  const runAction = useCallback(
    async (
      beatId: string,
      optimisticBeats: BeatForGraph[],
      request: () => Promise<Response>,
    ) => {
      const previousBeats = beats;
      if (!previousBeats) return;

      setActionError(null);

      flushSync(() => {
        setBeats(optimisticBeats);
        setIsUpdating(true);
        setErrorBeatIds((prev) => {
          const next = new Set(prev);
          next.delete(beatId);
          return next;
        });
      });

      try {
        const response = await request();

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "UNKNOWN_ERROR");
        }

        await refetchBeats();
      } catch (err) {
        setBeats(previousBeats);
        setErrorBeatIds((prev) => new Set(prev).add(beatId));
        setActionError(err instanceof Error ? err.message : "UNKNOWN_ERROR");
      } finally {
        setIsUpdating(false);
      }
    },
    [beats, refetchBeats],
  );

  const handleComplete = useCallback(
    (beatId: string, transitionId?: string) => {
      if (!beats) return;

      const now = new Date().toISOString();
      const chosenTransition = transitionId
        ? beats
            .find((b) => b.id === beatId)
            ?.outgoingTransitions.find((t) => t.id === transitionId)
        : undefined;

      const withCompletion = beats.map((beat) =>
        beat.id === beatId ? { ...beat, completedAt: now } : beat,
      );

      const withTakenTransition = withCompletion.map((beat) =>
        beat.id === beatId
          ? {
              ...beat,
              outgoingTransitions: beat.outgoingTransitions.map((t) =>
                t.id === transitionId ? { ...t, takenAt: now } : t,
              ),
            }
          : beat,
      );

      const nextActiveBeatId = chosenTransition?.toBeatId ?? null;
      const foreclosedIds = computeForeclosedSet(withTakenTransition);
      const optimisticBeats = withTakenTransition.map((beat) => ({
        ...beat,
        state: computeBeatState(
          beat,
          withTakenTransition,
          nextActiveBeatId,
          foreclosedIds,
        ),
      }));

      runAction(beatId, optimisticBeats, () =>
        fetch(`/api/beats/${beatId}/complete`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transitionId }),
        }),
      );
    },
    [beats, runAction],
  );

  const handleUncomplete = useCallback(
    (beatId: string) => {
      if (!beats) return;

      const beat = beats.find((b) => b.id === beatId);
      if (!beat) return;

      const takenTransition = beat.outgoingTransitions.find(
        (t) => !t.isBranch && t.takenAt !== null,
      );

      const reverted = beats.map((b) => {
        if (b.id === beatId) {
          return {
            ...b,
            completedAt: null,
            outgoingTransitions: b.outgoingTransitions.map((t) =>
              t.id === takenTransition?.id ? { ...t, takenAt: null } : t,
            ),
          };
        }
        return b;
      });

      const foreclosedIds = computeForeclosedSet(reverted);
      const optimisticBeats = reverted.map((b) => ({
        ...b,
        state: computeBeatState(b, reverted, beatId, foreclosedIds),
      }));

      runAction(beatId, optimisticBeats, () =>
        fetch(`/api/beats/${beatId}/complete`, { method: "DELETE" }),
      );
    },
    [beats, runAction],
  );

  const handleSetActive = useCallback(
    (beatId: string) => {
      if (!beats) return;

      const foreclosedIds = computeForeclosedSet(beats);
      const optimisticBeats = beats.map((b) => ({
        ...b,
        state: computeBeatState(b, beats, beatId, foreclosedIds),
      }));

      runAction(beatId, optimisticBeats, () =>
        fetch(`/api/campaigns/${campaignId}/active-beat`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ beatId }),
        }),
      );
    },
    [beats, campaignId, runAction],
  );

  // Creating a new beat can't be meaningfully optimistic the way the other
  // three actions are — we don't have a real id for the new beat or its
  // transition until the server responds. So this one skips the optimistic
  // snapshot: it shows the updating state, waits for the real response,
  // then refetches. Tradeoff is a brief pause instead of an instant (but
  // fabricated) preview.
  const handleCreateBeat = useCallback(
    (
      sourceBeatId: string,
      input: {
        title: string;
        description?: string;
        isMainContinuation: boolean;
      },
    ) => {
      if (!beats) return;

      const previousBeats = beats;
      setActionError(null);

      flushSync(() => {
        setIsUpdating(true);
        setErrorBeatIds((prev) => {
          const next = new Set(prev);
          next.delete(sourceBeatId);
          return next;
        });
      });

      fetch(`/api/beats/${sourceBeatId}/create-next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
        .then(async (response) => {
          if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error ?? "UNKNOWN_ERROR");
          }
          await refetchBeats();
        })
        .catch((err) => {
          setBeats(previousBeats);
          setErrorBeatIds((prev) => new Set(prev).add(sourceBeatId));
          setActionError(err instanceof Error ? err.message : "UNKNOWN_ERROR");
        })
        .finally(() => {
          setIsUpdating(false);
        });
    },
    [beats, refetchBeats],
  );

  const selectedBeat = useMemo(() => {
    if (!beats || !selectedBeatId) {
      return null;
    }

    return beats.find((beat) => beat.id === selectedBeatId) ?? null;
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
      <GraphLegend />
      {selectedBeat && (
        <div className="mt-3">
          <StoryBeatActionPanel
            beat={selectedBeat}
            allBeats={beats}
            onComplete={handleComplete}
            onUncomplete={handleUncomplete}
            onSetActive={handleSetActive}
            onCreateBeat={handleCreateBeat}
            onClose={() => setSelectedBeatId(null)}
            isUpdating={isUpdating}
            actionError={actionError}
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
          edgesFocusable={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
