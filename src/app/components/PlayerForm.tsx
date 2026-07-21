import type { Player } from "../types/player";
import { useState } from "react";

type PlayerFormProps = {
  player: Player;
  index: number;
  updatePlayer: (
    index: number,
    field: keyof Player,
    value: string | number | null | boolean
  ) => void;
};

const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

export default function PlayerForm({
  player,
  index,
  updatePlayer,
}: PlayerFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="bg-background/50 border border-accent/20 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-foreground/90 text-sm uppercase tracking-wider">
        Player {index + 1}
      </h3>

      {/* TODO MAYBE?: style NPC checkbox to match design system */}
      <label className="flex items-center gap-2 text-foreground">
        <input
          type="checkbox"
          checked={player.isNpc}
          onChange={(e) => updatePlayer(index, "isNpc", e.target.checked)}
        />
        NPC
      </label>

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
      
      <div className="flex gap-3">
        <input
          value={player.age ?? ""}
          onChange={(e) => updatePlayer(index, "age", e.target.value)}
          placeholder="Age"
          className={inputClass}
        />
        <input
          value={player.gender ?? ""}
          onChange={(e) => updatePlayer(index, "gender", e.target.value)}
          placeholder="Gender"
          className={inputClass}
        />
      </div>

      <textarea
        value={player.appearance ?? ""}
        onChange={(e) => updatePlayer(index, "appearance", e.target.value)}
        placeholder="Appearance"
        className={inputClass}
      />

      <select
        value={player.alignment ?? ""}
        onChange={(e) => updatePlayer(index, "alignment", e.target.value)}
        className={inputClass}
      >
        <option value="">Alignment</option>
        <option value="Lawful Good">Lawful Good</option>
        <option value="Neutral Good">Neutral Good</option>
        <option value="Chaotic Good">Chaotic Good</option>
        <option value="Lawful Neutral">Lawful Neutral</option>
        <option value="True Neutral">True Neutral</option>
        <option value="Chaotic Neutral">Chaotic Neutral</option>
        <option value="Lawful Evil">Lawful Evil</option>
        <option value="Neutral Evil">Neutral Evil</option>
        <option value="Chaotic Evil">Chaotic Evil</option>
      </select>

      <textarea
        value={player.backstory ?? ""}
        onChange={(e) => updatePlayer(index, "backstory", e.target.value)}
        placeholder="Backstory"
        className={inputClass}
      />

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-accent hover:underline"
      >
        {showAdvanced ? "Hide Advanced" : "Show Advanced"}
      </button>

      {showAdvanced && (
        <div className="space-y-3">
          <textarea
            value={player.motivation ?? ""}
            onChange={(e) => updatePlayer(index, "motivation", e.target.value)}
            placeholder="Motivation"
            className={inputClass}
          />
          <textarea
            value={player.goals ?? ""}
            onChange={(e) => updatePlayer(index, "goals", e.target.value)}
            placeholder="Goals"
            className={inputClass}
          />
          <textarea
            value={player.fears ?? ""}
            onChange={(e) => updatePlayer(index, "fears", e.target.value)}
            placeholder="Fears"
            className={inputClass}
          />
          <textarea
            value={player.secrets ?? ""}
            onChange={(e) => updatePlayer(index, "secrets", e.target.value)}
            placeholder="Secrets"
            className={inputClass}
          />
        </div>
      )}

    </div>
  );
}
