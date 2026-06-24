export type BeatState = "completed" | "current" | "default";

export type TransitionForGraph = {
  id: string;
  fromBeatId: string;
  toBeatId: string;
  transitionType: string;
  isHidden: boolean;
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
