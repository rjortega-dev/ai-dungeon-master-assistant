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
        value={player.player_name}
        onChange={(e) =>
          updatePlayer(index, "player_name", e.target.value)
        }
        placeholder="Player Name"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.character_name}
        onChange={(e) =>
          updatePlayer(index, "character_name", e.target.value)
        }
        placeholder="Character Name"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.character_class}
        onChange={(e) =>
          updatePlayer(index, "character_class", e.target.value)
        }
        placeholder="Character Class"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.race}
        onChange={(e) =>
          updatePlayer(index, "race", e.target.value)
        }
        placeholder="Character Race"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={player.character_level ?? ""}
        onChange={(e) =>
          updatePlayer(
            index, 
            "character_level", 
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