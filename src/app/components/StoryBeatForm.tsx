import type { StoryBeat } from "../types/storyBeat";

type StoryBeatFormProps = {
  storyBeat: StoryBeat;

  index: number;

  updateStoryBeat: (
    index: number,
    field: keyof StoryBeat,
    value: string
  ) => void;
};

export default function StoryBeatForm({
  storyBeat,
  index,
  updateStoryBeat,
}: StoryBeatFormProps) {
  return (
    <div className="border p-4 rounded space-y-4">
      <h3 className="text-lg font-bold">
        Story Beat {index + 1}
      </h3>

      {/* TITLE */}
      <input
        value={storyBeat.title}
        onChange={(e) =>
          updateStoryBeat(
            index,
            "title",
            e.target.value
          )
        }
        placeholder="Story Beat Title"
        className="border px-3 py-2 rounded w-full"
      />

      {/* IMPORTANCE */}
      <select
        value={storyBeat.importance}
        onChange={(e) =>
          updateStoryBeat(
            index,
            "importance",
            e.target.value
          )
        }
        className="border px-3 py-2 rounded w-full"
        >
          <option value="main_story">
            Main Story
          </option>

          <option value="side_story">
            Side Story
          </option>
        </select>

        {/* TYPE */}
        <select
          value={storyBeat.type}
          onChange={(e) =>
            updateStoryBeat(
              index,
              "type",
              e.target.value
            )
          }
          className="border px-3 -y-2 rounded w-full"
        >
          <option value="combat_encounter">
            Combat Encounter
          </option>

          <option value="meet_character">
            Meet New Character
          </option>

          <option value="find_item">
            Find Item
          </option>

          <option value="exploration">
            Exploration
          </option>

          <option value="puzzle">
            Puzzle
          </option>

          <option value="social_encounter">
            Social Encounter
          </option>

          <option value="boss_fight">
            Boss Fight
          </option>

          <option value="travel">
            Travel
          </option>

          <option value="other">
            Other
          </option>
        </select>

        {/* NOTES */}
        <textarea
          value={storyBeat.notes}
          onChange={(e) =>
            updateStoryBeat(
              index,
              "notes",
              e.target.value
            )
          }
          placeholder="Objectives, notes, required events..."
          className="border px-3 py-2 rounded w-full min-h-[120px]"
        />
    </div>
  )
}