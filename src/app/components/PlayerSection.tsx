import Button from "./Button";
import PlayerForm from "./PlayerForm";
import type { Player } from "../types/player";
import { PlayerCharacter } from "@/features/campaigns/generation/input-schemas";

type PlayerSectionProps = {
  players: PlayerCharacter[];
  setPlayers: (players: PlayerCharacter[]) => void;
};

export default function PlayerSection({
  players,
  setPlayers,
}: PlayerSectionProps) {
  function addPlayer() {
    setPlayers([
      ...players,
      {
        playerName: "",
        characterName: "",
        characterClass: "",
        characterLevel: 0,
        characterRace: "",
        notes: "",

        age: "",
        gender: "",
        appearance: "",
        alignment: "",
        backstory: "",
        motivation: "",
        goals: "",
        secrets: "",
        fears: "",
        isNpc: false,
      },
    ]);
  }

  function updatePlayer(
    index: number,
    field: keyof Player,
    value: string | number | null | boolean
  ) {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-accent-text">Players</h2>
      <Button type="button" onClick={addPlayer}>
        Add Player
      </Button>
      {players.map((player, index) => (
        <PlayerForm
          key={index}
          player={player}
          index={index}
          updatePlayer={updatePlayer}
        />
      ))}
    </div>
  );
}
