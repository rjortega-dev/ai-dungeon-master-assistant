import type { Player } from "./player";
import type { World } from "./world";
import type { StoryBeat } from "./storyBeat";

export type Campaign = {
  campaignName: string;

  players: Player[];

  world: World;

  storyBeats: StoryBeat[];
}