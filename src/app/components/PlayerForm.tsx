import type { Player } from "../types/player";

type PlayerFormProps = {
  player: Player;
  index: number;
  updatePlayer: (
    index: number,
    field: keyof Player,
    value: string | number | null,
  ) => void;
};

const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

export default function PlayerForm({
  player,
  index,
  updatePlayer,
}: PlayerFormProps) {
  return (
    <div className="bg-background/50 border border-accent/20 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-foreground/90 text-sm uppercase tracking-wider">
        Player {index + 1}
      </h3>

      <input
        value={player.playerName}
        onChange={(e) => updatePlayer(index, "playerName", e.target.value)}
        placeholder="Player Name"
        className={inputClass}
      />
      <input
        value={player.characterName}
        onChange={(e) => updatePlayer(index, "characterName", e.target.value)}
        placeholder="Character Name"
        className={inputClass}
      />
      <input
        value={player.characterClass}
        onChange={(e) => updatePlayer(index, "characterClass", e.target.value)}
        placeholder="Character Class"
        className={inputClass}
      />
      <input
        value={player.characterRace}
        onChange={(e) => updatePlayer(index, "characterRace", e.target.value)}
        placeholder="Character Race"
        className={inputClass}
      />
      <input
        value={player.characterLevel ?? ""}
        onChange={(e) =>
          updatePlayer(
            index,
            "characterLevel",
            e.target.value === "" ? null : Number(e.target.value),
          )
        }
        placeholder="Character Level"
        className={inputClass}
      />
      <input
        value={player.notes}
        onChange={(e) => updatePlayer(index, "notes", e.target.value)}
        placeholder="Notes"
        className={inputClass}
      />
    </div>
  );
}
