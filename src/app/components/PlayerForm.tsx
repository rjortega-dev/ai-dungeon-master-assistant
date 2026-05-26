import type { Player } from "../types/player";

type PlayerFormProps = {
  player: Player;
  index: number;
  updatePlayer: (
    index: number,
    field: keyof Player,
    value: string | number | null
  ) => void;
};

export default function PlayerForm({
  player,
  index,
  updatePlayer,
}: PlayerFormProps) {
  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-bold text-lg">
        Player {index + 1}
      </h2>

      <input
        value={player.playerName}
        onChange={(e) =>
          updatePlayer(index, "playerName", e.target.value)
        }
        placeholder="Player Name"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.characterName}
        onChange={(e) =>
          updatePlayer(index, "characterName", e.target.value)
        }
        placeholder="Character Name"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.characterClass}
        onChange={(e) =>
          updatePlayer(index, "characterClass", e.target.value)
        }
        placeholder="Character Class"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.characterRace}
        onChange={(e) =>
          updatePlayer(index, "characterRace", e.target.value)
        }
        placeholder="Character Race"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.characterLevel ?? ""}
        onChange={(e) =>
          updatePlayer(
            index, 
            "characterLevel", 
            e.target.value === "" 
              ? null
              : Number(e.target.value)
          )
        }
        placeholder="Character Level"
        className="border px-3 py-2 rounded w-full"
      />

       <input
        value={player.notes}
        onChange={(e) =>
          updatePlayer(index, "notes", e.target.value)
        }
        placeholder="Notes"
        className="border px-3 py-2 rounded w-full"
      />

    </div>
  );
}