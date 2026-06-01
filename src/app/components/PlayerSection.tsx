import Button from "./Button";
import PlayerForm from "./PlayerForm";
import type { Player } from "../types/player";

type PlayerSectionProps = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
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
        characterLevel: null,
        characterRace: "",
        notes: "",
      },
    ]);
  }

  function updatePlayer(
    index: number,
    field: keyof Player,
    value: string | number | null,
  ) {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-accent">Players</h2>
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
