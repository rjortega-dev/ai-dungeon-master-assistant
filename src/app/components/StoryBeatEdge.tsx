import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { useState } from "react";

type StoryBeatEdgeData = {
  transitionType: string;
  conditionDescription?: string | null;
  isHidden: boolean;
  color: string;
  isDimmed: boolean;
};

export function StoryBeatEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps & { data: StoryBeatEdgeData }) {
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = data.isHidden ? "???" : data.transitionType;
  const description = data.isHidden ? null : data.conditionDescription;

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer", pointerEvents: "stroke" }}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: data.color,
          strokeWidth: data.isDimmed ? 1.5 : 2.5,
          strokeDasharray: data.isHidden ? "4 4" : undefined,
          opacity: data.isDimmed ? 0.3 : 0.9,
          pointerEvents: "none",
        }}
      />
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -100%) translate(${labelX}px,${labelY - 8}px)`,
              pointerEvents: "none",
            }}
            className="rounded-lg border border-accent/30 bg-card px-3 py-2 text-xs shadow-lg z-50"
          >
            <p className="font-semibold text-accent-text uppercase tracking-wide">
              {label}
            </p>
            {description && (
              <p className="text-foreground/70 mt-1 max-w-48">{description}</p>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
