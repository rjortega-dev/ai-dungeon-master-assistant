import Button from "./Button";
import StoryBeatForm from "./StoryBeatForm";

import type { StoryBeat } from "../../features/campaigns/generation/input-schemas";

type StoryBeatSectionProps = {
  storyBeats: StoryBeat[];

  setStoryBeats: (
    storyBeats: StoryBeat[]
  ) => void;
};

export default function StoryBeatSection({
  storyBeats,
  setStoryBeats,
}: StoryBeatSectionProps) {
  
  function addStoryBeat() {
    setStoryBeats([
      ...storyBeats,

      {
        title: "",
        storyBeatType: "Main Story",
        beatTaskType: "Exploration",
        notes: "",
      },
    ]);
  }

    function updateStoryBeat(
      index: number,
      field: keyof StoryBeat,
      value: string
    ) {
      const updatedStoryBeats = [...storyBeats];

      updatedStoryBeats[index] = {
        ...updatedStoryBeats[index],
        [field]: value,
      };

      setStoryBeats(updatedStoryBeats);
    }

    return (
      <div className="space-y-6 border p-6 rounded">
        <h2 className="text-2xl font-bold">
          Story Beats
        </h2>

        <Button
          type="button"
          onClick={addStoryBeat}
        >
          Add Story Beat
        </Button>

        <div className="space-y-4">
          {storyBeats.map(
            (storyBeat, index) => (
              <StoryBeatForm
                key={index}
                storyBeat={storyBeat}
                index={index}
                updateStoryBeat={
                  updateStoryBeat
                }
              />
            )
          )}
        </div>
      </div>
    );
}