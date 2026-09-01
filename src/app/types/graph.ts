export type BeatState =
  | "completed"
  | "active"
  | "available"
  | "foreclosed"
  | "default";

export type TransitionForGraph = {
  id: string;
  fromBeatId: string;
  toBeatId: string;
  transitionType: string;
  conditionDescription: string | null;
  isHidden: boolean;
  isBranch: boolean;
  takenAt: string | null;
};

export type BeatForGraph = {
  id: string;
  title: string;
  description: string | null;
  beatType: string;
  sequenceOrder: number | null;
  completedAt: string | null;
  state: BeatState;
  outgoingTransitions: TransitionForGraph[];
  incomingTransitions: TransitionForGraph[];
};

export type CampaignBeatsResponse = {
  campaignId: string;
  beats: BeatForGraph[];
};
