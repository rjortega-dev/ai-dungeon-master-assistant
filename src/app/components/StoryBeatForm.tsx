import type { StoryBeat } from "../../features/campaigns//generation/input-schemas";

type StoryBeatFormProps = {
  storyBeat: StoryBeat;
  index: number;
  updateStoryBeat: (
    index: number,
    field: keyof StoryBeat,
    value: string,
  ) => void;
};

const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

export default function StoryBeatForm({
  storyBeat,
  index,
  updateStoryBeat,
}: StoryBeatFormProps) {
  return (
    <div className="bg-background/50 border border-accent/20 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-foreground/90 text-sm uppercase tracking-wider">
        Story Beat {index + 1}
      </h3>

      <input
        value={storyBeat.title}
        onChange={(e) => updateStoryBeat(index, "title", e.target.value)}
        placeholder="Story Beat Title"
        className={inputClass}
      />

      <select
        value={storyBeat.storyBeatType}
        onChange={(e) =>
          updateStoryBeat(index, "storyBeatType", e.target.value)
        }
        className={inputClass}
      >
        <option value="main_story">Main Story</option>
        <option value="side_story">Side Story</option>
      </select>

      <select
        value={storyBeat.beatTaskType}
        onChange={(e) => updateStoryBeat(index, "beatTaskType", e.target.value)}
        className={inputClass}
      >
        <option value="combat_encounter">Combat Encounter</option>
        <option value="meet_character">Meet New Character</option>
        <option value="find_item">Find Item</option>
        <option value="exploration">Exploration</option>
        <option value="puzzle">Puzzle</option>
        <option value="social_encounter">Social Encounter</option>
        <option value="boss_fight">Boss Fight</option>
        <option value="travel">Travel</option>
        <option value="other">Other</option>
      </select>

      <textarea
        value={storyBeat.notes}
        onChange={(e) => updateStoryBeat(index, "notes", e.target.value)}
        placeholder="Objectives, notes, required events..."
        className={`${inputClass} min-h-24`}
      />
    </div>
  );
}
